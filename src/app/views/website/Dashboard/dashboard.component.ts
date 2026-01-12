import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

import {
  Chart,
  ChartConfiguration,
  ChartData,
  registerables,
} from 'chart.js';
import { Expense } from 'src/app/classes/domain/entities/website/accounting/expense/expense';
import { OpeningBalance } from 'src/app/classes/domain/entities/website/masters/openingbalance/openingbalance';
import { BankAccount } from 'src/app/classes/domain/entities/website/masters/bankaccount/banckaccount';
import { Ledger } from 'src/app/classes/domain/entities/website/masters/ledgermaster/ledger';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import {
  ApplicationFeatures,
  AttendanceLocationType,
  AttendanceLogType,
  DomainEnums,
} from 'src/app/classes/domain/domainenums/domainenums';
import { InvoiceSumExpenseSum } from 'src/app/classes/domain/entities/website/Dashboard/invoicesumexpensesum/invoicesumexpensesum';
import { DashboardStats } from 'src/app/classes/domain/entities/website/Dashboard/stats/dashboardstats';
import { WebAttendaneLog } from 'src/app/classes/domain/entities/website/HR_and_Payroll/web_attendance_log/web_attendance_log/webattendancelog';
import { FeatureAccessService } from 'src/app/services/feature-access.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Animated values
  shreeBalance: number = 0;
  cashBalance: number = 0;
  bankBalance: number = 0;

  // Replace the previous property to a getter that always returns the selected company ref
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  BankList: OpeningBalance[] = [];
  IncomeBankList: BankAccount[] = [];
  LedgerList: string[] = [];
  WeekMonthList: string[] = [];
  ExpenseGraphList: number[] = [];
  IncomeGraphList: number[] = [];
  ExpenseBreakdownList: number[] = [];
  LedgerColorShadesList: string[] = [];
  BalanceList: Expense[] = [];
  SiteList: Site[] = [];
  TotalNoOfPlots: number = 0;
  TotalEnquiries: number = 0;
  TotalNoOfSoldPlots: number = 0;
  TotalRevenueGenerated: number = 0;
  TotalExpense: number = 0;
  TotalIncome: number = 0;
  InvoiceSumExpenseSumList: InvoiceSumExpenseSum[] = [];

  DashboardStatsList: DashboardStats[] = [];

  private doughnutChart: Chart | null = null;
  private barChart: Chart | null = null;

  BarSiteRef: number = 0;
  DoughnutSiteRef: number = 0;
  CRMSiteRef: number = 0;
  BillsPayableSiteRef: number = 0;

  BarFilterType: number = 57;
  DoughnutFilterType: number = 57;
  CRMFilterType: number = 57;
  BillPayableFilterType: number = 57;

  SelectedBarMonths: number = 0;
  SelectedDoughnutMonths: number = 0;
  SelectedCRMMonths: number = 0;
  SelectedBillPayableMonths: number = 0;

  MonthList = DomainEnums.MonthList(true, '--Select Month--');

  // Target values
  private shreeTarget: number = 0;
  private cashTarget: number = 0;
  private bankTarget: number = 0;

  BankAccountRef: number = 0;
  isLoading = true; // stop loading once data arrives

  private duration: number = 2000; // total duration in ms
  refreshInterval: any;
  public isAdmin = false;
  featureRef: ApplicationFeatures = ApplicationFeatures.Dashboard;
  public todayAttendanceList: WebAttendaneLog[] = [];
  public LocationType = AttendanceLocationType;
  currentDate = new Date();
  public greeting: string = '';
  public userName: string = 'User';

  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private DateconversionService: DateconversionService,
    private appStateManage: AppStateManageService,
    private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement,
    public access: FeatureAccessService
  ) {}

  ngOnInit() {
    this.access.refresh();

    // Register a small plugin to show "Data Not Found"
    Chart.register({
      id: 'noDataPlugin',
      afterDraw: (chart: any) => {
        try {
          if (
            !chart.data ||
            !chart.data.datasets ||
            chart.data.datasets.length === 0 ||
            (chart.data.datasets[0].data || []).length === 0
          ) {
            const {
              ctx,
              chartArea: { width, height },
            } = chart;
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '20px Poppins';
            ctx.fillStyle = '#7a1e1e';
            ctx.fillText('Data Not Found', width / 2, height / 2);
            ctx.restore();
          }
        } catch (e) {
          // silently ignore plugin errors
        }
      },
    });

    // Start the periodic load (this will call loadData immediately once)
    this.startAutoRefresh();
  }

  /**
   * Primary data loading function. Runs many parallel fetches but is defensive.
   */
  loadData = async () => {
    try {
      this.isAdmin = this.appStateManage.StorageKey.getItem('IsDefaultUser') == '1';
      this.userName = this.appStateManage.StorageKey.getItem('UserDisplayName') || 'User';
      this.setGreeting();

      // Quick checks
      if (this.companyRef() <= 0) {
        // keep isLoading true so UI can show a message if needed
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }

      // Kick off data fetches in parallel where safe
      // some methods are independent, some rely on companyRef
      // await Promise.allSettled([
        this.getDashboardStats();
        this.getCurrentBalanceByCompanyRef();
        this.getSiteListByCompanyRef();
        this.FormulateBankList();
        this.getInvoiceSumExpenseSumListByCompanySiteMonthFilterType();
        this.fetchEmployeeData();
      // ]);

      // If Week view default
      if (this.BarFilterType == 57) {
        this.WeekMonthList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      }
    } catch (err) {
      console.error('loadData error', err);
      await this.uiUtils.showErrorToster('Failed to load dashboard data.');
    } finally {
      // don't force isLoading false here — individual fetchers set it when appropriate
    }
  };

  startAutoRefresh() {
    // Call immediately when user opens page
    this.loadData();

    // Then call every 1 minute (60000 ms)
    this.refreshInterval = setInterval(() => {
      this.loadData();
    }, 60000);
  }

  stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  setGreeting() {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
      this.greeting = 'Good Morning.';
    } else if (hour >= 12 && hour < 17) {
      this.greeting = 'Good Afternoon.';
    } else {
      this.greeting = 'Good Evening.';
    }
  }

  private async fetchEmployeeData(): Promise<void> {
    try {
      const employeeRef = Number(
        this.appStateManage.StorageKey.getItem('LoginEmployeeRef')
      );
      if (!employeeRef) {
        await this.uiUtils.showErrorToster('Employee not identified.');
        return;
      }

      let allTodayLogs =
        await WebAttendaneLog.FetchEntireListByCompanyRefAndAttendanceLogType(
          this.companyRef(),
          AttendanceLogType.TodaysAttendanceLog,
          async (errMsg) => {
            await this.uiUtils.showErrorToster(
              'Failed to load attendance: ' + errMsg
            );
          }
        );

      this.todayAttendanceList = allTodayLogs || [];
    } catch (error) {
      console.error('fetchEmployeeData error', error);
      await this.uiUtils.showErrorToster('Failed to load employee data.');
    }
  }

  goToBillsPayablePage() {
    this.router.navigate(['homepage/Website/Bill_Payable_Report']); // your full list page route
  }

  setIncomeExpenseChart = () => {
    const labels = this.WeekMonthList || [];

    const data: ChartData<'bar'> = {
      labels: labels,
      datasets: [
        {
          label: `Income`,
          data: this.IncomeGraphList || [],
          backgroundColor: 'rgba(122, 30, 30, 0.8)',
          borderRadius: 6,
        },
        {
          label: `Expense`,
          data: this.ExpenseGraphList || [],
          backgroundColor: 'rgba(122, 30, 30, 0.2)',
          borderColor: 'rgba(122, 30, 30, 1)',
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    };

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#7a1e1e',
            },
          },
        },
        scales: {
          x: {
            ticks: { color: '#7a1e1e' },
            grid: { drawTicks: false },
          },
          y: {
            ticks: { color: '#7a1e1e' },
            beginAtZero: true,
          },
        },
      },
    };

    // destroy old chart if exists
    if (this.barChart) {
      try {
        this.barChart.destroy();
      } catch (e) {
        // ignore
      } finally {
        this.barChart = null;
      }
    }

    // create new chart
    try {
      this.barChart = new Chart('barChart', config);
    } catch (e) {
      console.error('Failed to create bar chart', e);
    }
  };

  generateShades = (count: number): string[] => {
    if (!count || count <= 0) return [];
    const colors: string[] = [];
    const hueStep = 360 / count; // spread evenly on color wheel

    for (let i = 0; i < count; i++) {
      const hue = Math.round(i * hueStep);
      colors.push(`hsl(${hue}, 70%, 50%)`);
    }

    return colors;
  };

  /**
   * Animate numeric property from its current value to target value.
   * property: name of numeric property on this component (e.g. 'shreeBalance')
   */
  private animateValue(property: keyof DashboardComponent, target: number) {
    const startTime = performance.now();
    const startValue = Number((this as any)[property]) || 0;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.duration, 1);

      // Ease-out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const value = startValue + (target - startValue) * easedProgress;

      // Keep 2 decimal places
      (this as any)[property] = parseFloat(value.toFixed(2));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  getCurrentBalanceByCompanyRef = async () => {
    try {
      if (this.companyRef() <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }
      let lst = await Expense.FetchCurrentBalanceByCompanyRef(
        this.companyRef(),
        async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
      );
      this.BalanceList = lst || [];

      if (this.BalanceList.length > 0) {
        this.shreeTarget = this.BalanceList[0].p?.ShreesBalance || 0;
      } else {
        this.shreeTarget = 0;
      }

      let cash = (this.BalanceList || []).find((data) => data.p?.ModeOfPayment == 'Cash');
      this.cashTarget = cash ? cash.p.NetBalance || 0 : 0;

      this.getBankCurrentBalance();

      this.animateValue('shreeBalance', this.shreeTarget);
      this.animateValue('cashBalance', this.cashTarget);
    } catch (err) {
      console.error('getCurrentBalanceByCompanyRef error', err);
      await this.uiUtils.showErrorToster('Failed to load balances.');
    }
  };

  getBankCurrentBalance = () => {
    try {
      if (this.BankAccountRef != 0) {
        let bankTarget = this.BalanceList.find(
          (data) => data.p?.BankAccountRef == this.BankAccountRef
        );
        this.bankTarget = bankTarget ? bankTarget.p.NetBalance || 0 : 0;
      } else {
        let allbankTarget = (this.BalanceList || [])
          .filter((item) => (item.p?.ModeOfPayment || '').trim() === 'Bank')
          .reduce((sum, item) => sum + (item.p?.NetBalance || 0), 0);
        this.bankTarget = allbankTarget || 0;
      }
      this.animateValue('bankBalance', this.bankTarget);
    } catch (err) {
      console.error('getBankCurrentBalance error', err);
      this.bankTarget = 0;
    }
  };

  setDoughnutChart = () => {
    // Destroy old chart if exists
    if (this.doughnutChart) {
      try {
        this.doughnutChart.destroy();
      } catch (e) {
        // ignore
      } finally {
        this.doughnutChart = null;
      }
    }

    // Build dataset defensively
    const labels = this.LedgerList || [];
    const dataValues = this.ExpenseBreakdownList || [];
    const colors = this.LedgerColorShadesList || [];

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Expenses',
            data: dataValues,
            backgroundColor: colors,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 15,
              padding: 10,
            },
          },
        },
      },
    };

    try {
      this.doughnutChart = new Chart('doughnutChart', config);
    } catch (e) {
      console.error('Failed to create doughnut chart', e);
    }
  };

  ngOnDestroy() {
    if (this.doughnutChart) {
      try {
        this.doughnutChart.destroy();
      } catch (e) {}
      this.doughnutChart = null;
    }

    if (this.barChart) {
      try {
        this.barChart.destroy();
      } catch (e) {}
      this.barChart = null;
    }
    this.stopAutoRefresh();
  }

  getDashboardStats = async () => {
    try {
      if (this.companyRef() <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }
      let lst = await DashboardStats.FetchEntireListByAll(
        this.companyRef(),
        this.SelectedCRMMonths,
        this.CRMSiteRef,
        this.CRMFilterType,
        this.companyRef(),
        this.DoughnutSiteRef,
        this.DoughnutFilterType,
        this.SelectedDoughnutMonths,
        this.companyRef(),
        this.BarSiteRef,
        this.BarFilterType,
        this.SelectedBarMonths,
        async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
      );

      this.DashboardStatsList = lst || [];

      if (!this.DashboardStatsList || this.DashboardStatsList.length === 0) {
        // no data found - clear charts & values
        this.TotalEnquiries = this.TotalNoOfPlots = this.TotalNoOfSoldPlots = this.TotalRevenueGenerated = 0;
        this.ExpenseGraphList = [];
        this.IncomeGraphList = [];
        this.WeekMonthList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        this.LedgerList = [];
        this.ExpenseBreakdownList = [];
        this.LedgerColorShadesList = [];
        this.setIncomeExpenseChart();
        this.setDoughnutChart();
        this.isLoading = false;
        return;
      }

      const primary = this.DashboardStatsList[0];

      this.TotalEnquiries = primary.p?.TotalEnquiries || 0;
      this.TotalNoOfPlots = primary.p?.TotalNoOfPlots || 0;
      this.TotalNoOfSoldPlots = primary.p?.TotalNoOfSoldPlots || 0;
      this.TotalRevenueGenerated = primary.p?.TotalRevenueGenerated || 0;

      const periodList = primary.p?.IncomeExpenseAmountByPeriodList || [];
      this.ExpenseGraphList = periodList.map((item: any) => item.TotalGivenAmount || 0);
      this.IncomeGraphList = periodList.map((item: any) => item.TotalIncomeAmount || 0);

      this.TotalExpense = periodList.reduce((sum: number, item: any) => sum + (item.TotalGivenAmount || 0), 0);
      this.TotalIncome = periodList.reduce((sum: number, item: any) => sum + (item.TotalIncomeAmount || 0), 0);

      if (this.BarFilterType == 63 && this.SelectedBarMonths) {
        this.WeekMonthList = periodList.map((item: any) => item.WeekName || '');
      } else if (this.BarFilterType == 63) {
        this.WeekMonthList = ['Jan','Feb','Mar','Apr','May','June','Jul','Aug','Spet','Oct','Nov','Dec'];
      } else {
        this.WeekMonthList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      }

      this.setIncomeExpenseChart();

      const expenseBreakdown = primary.p?.ExpenseBreakDownResponseList || [];
      this.LedgerColorShadesList = this.generateShades(expenseBreakdown.length);
      this.LedgerList = expenseBreakdown.map((item: any) => item.LedgerName || '');
      this.ExpenseBreakdownList = expenseBreakdown.map((item: any) => item.TotalGivenAmount || 0);

      this.setDoughnutChart();
      this.isLoading = false;
    } catch (err) {
      console.error('getDashboardStats error', err);
      await this.uiUtils.showErrorToster('Failed to load dashboard stats.');
      this.isLoading = false;
    }
  };

  getStatusColor(Data: WebAttendaneLog): string {
    let status = '';
    if (Data.p.IsAttendanceVerified) {
      status = 'present';
    } else if (Data.p.IsLeave == true) {
      status = 'onLeave';
    } else if (Data.p.IsAbsent == true) {
      status = 'absent';
    } else {
      status = 'present';
    }
    switch (status) {
      case 'present':
        return 'success';
      case 'onLeave':
        return 'Warning';
      case 'absent':
        return 'danger';
      default:
        return 'success';
    }
  }
  getStatusText(Data: WebAttendaneLog): string {
    let status = '';
    if (Data.p.IsAttendanceVerified) {
      status = 'present';
    } else if (Data.p.IsLeave == true) {
      status = 'onLeave';
    } else if (Data.p.IsAbsent == true) {
      status = 'absent';
    } else {
      status = 'present';
    }
    switch (status) {
      case 'present':
        return 'Present';
      case 'onLeave':
        return 'on Leave';
      case 'absent':
        return 'Absent';
      default:
        return 'Present';
    }
  }

  getSiteListByCompanyRef = async () => {
    try {
      if (this.companyRef() <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }
      let lst = await Site.FetchEntireListByCompanyRef(
        this.companyRef(),
        async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
      );
      this.SiteList = lst || [];
    } catch (err) {
      console.error('getSiteListByCompanyRef error', err);
      await this.uiUtils.showErrorToster('Failed to load sites.');
    }
  };

  public FormulateBankList = async () => {
    try {
      if (this.companyRef() <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }
      let lst = await OpeningBalance.FetchEntireListByCompanyRef(
        this.companyRef(),
        async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
      );
      const all = lst || [];
      this.BankList = all.filter(
        (item) =>
          item.p?.BankAccountRef > 0 &&
          ((item.p?.OpeningBalanceAmount || 0) > 0 || (item.p?.InitialBalance || 0) > 0)
      );
    } catch (err) {
      console.error('FormulateBankList error', err);
      await this.uiUtils.showErrorToster('Failed to load bank list.');
    }
  };

  getInvoiceSumExpenseSumListByCompanySiteMonthFilterType = async () => {
    try {
      if (this.companyRef() <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }
      let lst =
        await InvoiceSumExpenseSum.FetchEntireListByCompanySiteMonthFilterType(
          this.companyRef(),
          this.BillsPayableSiteRef,
          this.SelectedBillPayableMonths,
          this.BillPayableFilterType,
          async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
        );
      this.InvoiceSumExpenseSumList = lst || [];
    } catch (err) {
      console.error('getInvoiceSumExpenseSumList error', err);
      await this.uiUtils.showErrorToster('Failed to load invoice / expense summary.');
    }
  };
}
