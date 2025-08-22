import { Component, effect, OnInit } from '@angular/core';
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
  ChartEvent,
  ChartType,
  registerables
} from 'chart.js';
import { Expense } from 'src/app/classes/domain/entities/website/accounting/expense/expense';
import { OpeningBalance } from 'src/app/classes/domain/entities/website/masters/openingbalance/openingbalance';
import { BankAccount } from 'src/app/classes/domain/entities/website/masters/bankaccount/banckaccount';
import { Ledger } from 'src/app/classes/domain/entities/website/masters/ledgermaster/ledger';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { ExpenseBreakdown } from 'src/app/classes/domain/entities/website/Dashboard/expensebreakdown/expensebreakdown';
import { CRMFunnel } from 'src/app/classes/domain/entities/website/Dashboard/crmfunnel/crmfunnel';
import { ExpenseGraph } from 'src/app/classes/domain/entities/website/Dashboard/expensegraph/expensegraph';
import { IncomeGraph } from 'src/app/classes/domain/entities/website/Dashboard/incomegraph/incomegraph';
import { InvoiceSumExpenseSum } from 'src/app/classes/domain/entities/website/Dashboard/invoicesumexpensesum/invoicesumexpensesum';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  // Animated values
  shreeBalance: number = 0;
  cashBalance: number = 0;
  bankBalance: number = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  BankList: OpeningBalance[] = [];
  IncomeBankList: BankAccount[] = [];
  LedgerList: any = [];
  WeekMonthList: any = [];
  ExpenseGraphList: any = [];
  IncomeGraphList: any = [];
  ExpenseBreakdownList: any = [];
  LedgerColorShadesList: any = [];
  BalanceList: Expense[] = [];
  SiteList: Site[] = [];
  TotalNoOfPlots: number = 0;
  TotalNoOfSoldPlots: number = 0;
  TotalRevenueGenerated: number = 0;
  TotalExpense: number = 0;
  TotalIncome: number = 0;
  InvoiceSumExpenseSumList: InvoiceSumExpenseSum[] = []

  private doughnutChart: Chart | null = null;
  private barChart: Chart | null = null;


  BarSiteRef: number = 0
  DoughnutSiteRef: number = 0
  CRMSiteRef: number = 0

  BarFilterType: number = 57
  DoughnutFilterType: number = 57
  CRMFilterType: number = 57
  BillPayableFilterType: number = 57

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
  isLoading = true;  // ✅ stop loading once data arrives


  private duration: number = 2000; // total duration in ms

  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private DateconversionService: DateconversionService,
    private appStateManage: AppStateManageService,
    private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement
  ) { }

  ngOnInit() {
    Chart.register({
      id: 'noDataPlugin',
      afterDraw: (chart) => {
        if (chart.data.datasets.length === 0 || chart.data.datasets[0].data.length === 0) {
          const { ctx, chartArea: { width, height } } = chart;
          ctx.save();
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = '20px Poppins';
          ctx.fillStyle = '#7a1e1e';
          ctx.fillText('Data Not Found', width / 2, height / 2);
          ctx.restore();
        }
      }
    });

    this.getCurrentBalanceByCompanyRef();
    this.getExpenseBreakdownListByCompanySiteMonthFilterType();
    this.getSiteListByCompanyRef();
    this.FormulateBankList();
    this.getIncomeExpenseGraphList();
    this.getCRMFunnelListByCompanySiteMonthFilterType();
    this.getInvoiceSumExpenseSumListByCompanySiteMonthFilterType();

    if (this.BarFilterType == 57) {
      this.WeekMonthList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  }

  setIncomeExpenseChart = () => {
    const labels = this.WeekMonthList;

    const data: ChartData<'bar'> = {
      labels: labels,
      datasets: [
        {
          label: `Income`,
          data: this.IncomeGraphList,
          backgroundColor: 'rgba(122, 30, 30, 0.8)',
          borderRadius: 6
        },
        {
          label: `Expense`,
          data: this.ExpenseGraphList,
          backgroundColor: 'rgba(122, 30, 30, 0.2)',
          borderColor: 'rgba(122, 30, 30, 1)',
          borderWidth: 1,
          borderRadius: 6
        }
      ]
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
              // font: { weight: '600' }
            }
          }
        },
        scales: {
          x: {
            ticks: { color: '#7a1e1e' },
            grid: { drawTicks: false }
          },
          y: {
            ticks: { color: '#7a1e1e' },
            beginAtZero: true
          }
        }
      }
    };

    // ✅ destroy old chart if exists
    if (this.barChart) {
      this.barChart.destroy();
    }

    // ✅ keep reference to new one
    this.barChart = new Chart('barChart', config);
  };


  generateShades = (count: number): string[] => {
    const colors: string[] = [];
    const hueStep = 360 / count; // spread evenly on color wheel

    for (let i = 0; i < count; i++) {
      const hue = Math.round(i * hueStep);
      colors.push(`hsl(${hue}, 70%, 50%)`);
    }

    return colors;
  }

  private animateValue(property: keyof DashboardComponent, target: number) {
    const startTime = performance.now();
    const startValue = 0;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.duration, 1);

      // Ease-out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const value = startValue + (target - startValue) * easedProgress;

      // ✅ Keep 2 decimal places
      (this as any)[property] = parseFloat(value.toFixed(2));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  getCurrentBalanceByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Expense.FetchCurrentBalanceByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.BalanceList = lst;
    if (lst.length > 0) {
      this.shreeTarget = lst[0].p.ShreesBalance;
    }

    let cash = lst.find((data) => data.p.ModeOfPayment == 'Cash');
    if (cash) {
      this.cashTarget = cash.p.NetBalance
    }
    this.getBankCurrentBalance();

    this.animateValue('shreeBalance', this.shreeTarget);
    this.animateValue('cashBalance', this.cashTarget);
  }

  getBankCurrentBalance = () => {
    if (this.BankAccountRef != 0) {
      let bankTarget = this.BalanceList.find((data) => data.p.BankAccountRef == this.BankAccountRef);
      if (bankTarget) {
        this.bankTarget = bankTarget.p.NetBalance;
      }
    } else {
      let allbankTarget = this.BalanceList.filter(item => item.p.ModeOfPayment.trim() === 'Bank').reduce((sum, item) => sum + (item.p.NetBalance || 0), 0);
      if (allbankTarget) {
        this.bankTarget = allbankTarget
      }
    }
    this.animateValue('bankBalance', this.bankTarget);
  }

  setDoughnutChart = () => {
    // 🔑 Destroy old chart if exists
    if (this.doughnutChart) {
      this.doughnutChart.destroy();
    }

    // 🔑 Store reference to new chart
    this.doughnutChart = new Chart("doughnutChart", {
      type: 'doughnut',
      data: {
        labels: this.LedgerList,
        datasets: [{
          label: 'Expenses',
          data: this.ExpenseBreakdownList,
          backgroundColor: this.LedgerColorShadesList,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,   // keeps it circular
        aspectRatio: 1,              // force square shape
        plugins: {
          legend: {
            position: 'right',       // as in your screenshot
            labels: {
              boxWidth: 15,
              padding: 10
            }
          }
        }
      }
    });
  }

  // Optional cleanup when component is destroyed
  ngOnDestroy() {
    if (this.doughnutChart) {
      this.doughnutChart.destroy();
    }

    if (this.barChart) {
      this.barChart.destroy();
    }
  }


  getExpenseBreakdownListByCompanySiteMonthFilterType = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await ExpenseBreakdown.FetchEntireListByCompanySiteMonthFilterType(this.companyRef(), this.DoughnutSiteRef, this.SelectedDoughnutMonths, this.DoughnutFilterType, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.LedgerColorShadesList = this.generateShades(lst.length);
    // debugger
    if (lst.length > 0) {
      this.isLoading = false;  // ✅ stop loading once data arrives
      this.LedgerList = lst.map(item => item.p.LedgerName);
      this.ExpenseBreakdownList = lst.map(item => item.p.TotalGivenAmount);
      this.setDoughnutChart();
    }
    else {
      this.LedgerList = []
      this.ExpenseBreakdownList = []
      this.setDoughnutChart();
    }
  }

  getIncomeExpenseGraphList = async () => {
    await this.getExpenseGraphListByCompanySiteMonthFilterType();
    await this.getIncomeGraphListByCompanySiteMonthFilterType();
  }

  getExpenseGraphListByCompanySiteMonthFilterType = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await ExpenseGraph.FetchEntireListByCompanySiteMonthFilterType(this.companyRef(), this.BarSiteRef, this.SelectedBarMonths, this.BarFilterType, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.ExpenseGraphList = lst.map(item => item.p.TotalGivenAmount);
    this.TotalExpense = lst.reduce((sum, item) => sum + (item.p.TotalGivenAmount || 0), 0);
    this.setIncomeExpenseChart();
  }


  getIncomeGraphListByCompanySiteMonthFilterType = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await IncomeGraph.FetchEntireListByCompanySiteMonthFilterType(this.companyRef(), this.BarSiteRef, this.SelectedBarMonths, this.BarFilterType, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.TotalIncome = lst.reduce((sum, item) => sum + (item.p.TotalIncomeAmount || 0), 0);
    this.IncomeGraphList = lst.map(item => item.p.TotalIncomeAmount);
    if (this.BarFilterType == 63 && this.SelectedBarMonths) {
      this.WeekMonthList = lst.map(item => item.p.WeekName);
    } else if (this.BarFilterType == 63) {
      this.WeekMonthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'Jul', 'Aug', 'Spet', 'Oct', 'Nov', 'Dec']
    } else {
      this.WeekMonthList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
    this.setIncomeExpenseChart();
  }

  getCRMFunnelListByCompanySiteMonthFilterType = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }

    let lst = await CRMFunnel.FetchEntireListByCompanySiteMonthFilterType(this.companyRef(), this.CRMSiteRef, this.SelectedCRMMonths, this.CRMFilterType, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    if (lst.length > 0) {
      this.TotalNoOfPlots = lst[0].p.TotalNoOfPlots
      this.TotalNoOfSoldPlots = lst[0].p.TotalNoOfSoldPlots
      this.TotalRevenueGenerated = lst[0].p.TotalRevenueGenerated
    } else {
      this.TotalNoOfPlots = 0;
      this.TotalNoOfSoldPlots = 0;
      this.TotalRevenueGenerated = 0;
    }
  }

  getInvoiceSumExpenseSumListByCompanySiteMonthFilterType = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await InvoiceSumExpenseSum.FetchEntireListByCompanySiteMonthFilterType(this.companyRef(), this.SelectedBillPayableMonths, this.BillPayableFilterType, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.InvoiceSumExpenseSumList = lst;
  }

  getSiteListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
  }

  public FormulateBankList = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await OpeningBalance.FetchEntireListByCompanyRef(this.companyRef(), async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.BankList = lst.filter((item) => item.p.BankAccountRef > 0 && (item.p.OpeningBalanceAmount > 0 || item.p.InitialBalance > 0));
  };

}
