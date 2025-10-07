import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { App as CapacitorApp } from '@capacitor/app';
import { Chart, registerables } from 'chart.js';

import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { Expense } from 'src/app/classes/domain/entities/website/accounting/expense/expense';
import {
  AttendanceLocationType,
  AttendanceLogType,
  DomainEnums,
} from 'src/app/classes/domain/domainenums/domainenums';
import { ExpenseGraph } from 'src/app/classes/domain/entities/website/Dashboard/expensegraph/expensegraph';
import { IncomeGraph } from 'src/app/classes/domain/entities/website/Dashboard/incomegraph/incomegraph';
import { WebAttendaneLog } from 'src/app/classes/domain/entities/website/HR_and_Payroll/web_attendance_log/web_attendance_log/webattendancelog';
import {
  MenuItem,
  ValidMenuItemsStateManagementMobileApp,
} from 'src/app/views/mobile-app/components/core/ValidMenuItemsStateManagementMobileApp';

// Register Chart.js components
Chart.register(...registerables);

interface GridItem {
  icon: string;
  label: string;
  routerPath: string;
  group: number;
}

@Component({
  selector: 'app-home-view-mobile-app',
  templateUrl: './home-view-mobile-app.component.html',
  styleUrls: ['./home-view-mobile-app.component.scss'],
  standalone: false,
})
export class HomeViewMobileAppComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // === ViewChild for Charts ===
  @ViewChild('incomeExpenseChart') private incomeExpenseChartRef!: ElementRef;
  @ViewChild('bankBalanceChart') private bankBalanceChartRef!: ElementRef;
  @ViewChild('bankLegend') private bankLegendRef!: ElementRef; // === General Dashboard Data ===

  public userName: string = 'User'; // Placeholder for user's name
  public currentDate: string = '';
  public selectedIndex = 0;
  public companyRef: number = 0;
  private backButtonSub!: Subscription;
  public BalanceList: Expense[] = [];
  public WeekMonthList: any = [];
  public MonthList = DomainEnums.MonthList();
  public ExpenseGraphList: any = [];
  public IncomeGraphList: any = [];
  public BarSiteRef: number = 0;
  public BarFilterType: number = 63;
  public SelectedBarMonths: number = 0;
  public TotalExpense: number = 0;
  public TotalIncome: number = 0;
  public LocationType = AttendanceLocationType;

  public gridItems: GridItem[] = [];

  private featureMap: {
    [key: number]: {
      label: string;
      icon: string;
      routerPath: string;
      group: number;
    };
  } = {
    100: {
      label: 'Site',
      icon: 'assets/icons/site_management_mobile_app.png',
      routerPath: '/mobile-app/tabs/dashboard/site-management',
      group: 20,
    }, 
    200: {
      label: 'Accounting',
      icon: 'assets/icons/report_mobile_app.png',
      routerPath: '/mobile-app/tabs/dashboard/accounting',
      group: 20,
    }, 
    300: {
      label: 'Stock',
      icon: 'assets/icons/stock_mobile_app.png',
      routerPath: '/mobile-app/tabs/dashboard/stock-management',
      group: 20,
    }, 
    400: {
      label: 'CRM',
      icon: 'assets/icons/crm_mobile_app.png',
      routerPath: '/mobile-app/tabs/dashboard/customer-relationship-management',
      group: 20,
    },
    500: {
      label: 'Masters',
      icon: 'assets/icons/crm_mobile_app.png',
      routerPath: '/mobile-app/tabs/dashboard/masters',
      group: 20,
    },
  }; // === Admin View Data ===

  public isAdmin = false;
  public totalBalance: number = 0;
  public cashBalance: number = 0;
  public peoplePresent: number = 0;
  public todayAttendanceList: WebAttendaneLog[] = [];
  public greeting: string = '';
  private incomeExpenseData: any = [];

  private bankBalanceData: any;

  constructor(
    private router: Router,
    private platform: Platform,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private dateConversion: DateconversionService,
    private appState: AppStateManageService,
    private validMenuItemsService: ValidMenuItemsStateManagementMobileApp
  ) {}

  ngOnInit(): void {
    //     this.initializeData();
    this.backButtonSub = this.platform.backButton.subscribeWithPriority(
      10,
      async () => {
        await this.showExitConfirmation();
      }
    );
  }

  ngOnDestroy(): void {
    this.backButtonSub?.unsubscribe();
  }

  ngAfterViewInit(): void {
    // Use the new method to set the legend position
    const legendPosition = this.getLegendPosition();
  }

  ionViewWillEnter(): void {
    this.initializeData();
  }
  // === Data Fetching and Initialization ===
  async initializeData(): Promise<void> {
    this.userName =
      this.appState.localStorage.getItem('UserDisplayName') || 'User';
    this.isAdmin = this.appState.localStorage.getItem('IsDefaultUser') == '1';
    this.companyRef = Number(
      this.appState.localStorage.getItem('SelectedCompanyRef')
    );

    await this.fetchServerTime();
    this.setGreeting(); // 1. Filter the Quick Actions grid based on permissions

    this.filterGridItems(); // 2. Conditionally fetch data based on user role

    if (this.isAdmin) {
      await this.fetchAdminData();
    } else {
      await this.fetchEmployeeData();
    }
  } // Fetch data specific to a regular employee (non-admin)

  private async fetchEmployeeData(): Promise<void> {
    await this.loadingService.show();
    try {
      const employeeRef = Number(
        this.appState.localStorage.getItem('LoginEmployeeRef')
      );
      if (!employeeRef) {
        this.toastService.present('Employee not identified.', 1000, 'danger');
        return;
      } // Fetch all attendance logs for the company today

      let allTodayLogs =
        await WebAttendaneLog.FetchEntireListByCompanyRefAndAttendanceLogType(
          this.companyRef,
          AttendanceLogType.TodaysAttendanceLog,
          async (errMsg) => {
            await this.toastService.present(
              `Failed to load attendance: ${errMsg}`,
              1000,
              'danger'
            );
            await this.haptic.error();
          }
        ); // Filter the list to show only the logged-in employee's log

      // const employeeLog = allTodayLogs.filter(
      //   (log) => log.p.EmployeeRef === employeeRef
      // );
      const employeeLog = allTodayLogs;
      this.todayAttendanceList = employeeLog; // Set peoplePresent to 1 or 0 based on if the user has a log.
      this.peoplePresent = this.todayAttendanceList.length;
    } catch (error) {
      this.toastService.present(
        'Failed to load employee data.',
        1000,
        'danger'
      );
    } finally {
      this.loadingService.hide();
    }
  }

  private async fetchAdminData(): Promise<void> {
    await this.loadingService.show();
    try {
      // Admin fetches ALL financial and attendance data
      await this.getCurrentBalanceByCompanyRef();
      await this.getIncomeExpenseGraphList();
      await this.getTodayAttendanceLogByAttendanceListType(); // Fetches all today's logs and sets peoplePresent
      this.createIncomeExpenseChart();
    } catch (error) {
      console.error('Error fetching admin data:', error);
      this.toastService.present('Failed to load admin data.', 1000, 'danger');
    } finally {
      this.loadingService.hide();
    }
  }

  private filterGridItems(): void {
    // const validMenu = this.validMenuItemsService.getValidMenuItems(); // console.log('validMenu :', validMenu); // Keeping console.log for debugging purposes // 1. Map and return GridItem or null
    const validMenu = [
      {
        FeatureRef: 100,
        FeatureName: 'UnitMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 200,
        FeatureName: 'MaterialMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 300,
        FeatureName: 'StageMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 400,
        FeatureName: 'MarketingTypeMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 500,
        FeatureName: 'VendorServicesMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 600,
        FeatureName: 'VendorMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 700,
        FeatureName: 'BankAccountMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 800,
        FeatureName: 'StateMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 900,
        FeatureName: 'CountryMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 1000,
        FeatureName: 'CityMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 1100,
        FeatureName: 'DepartmentMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 1200,
        FeatureName: 'DesignationMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 1300,
        FeatureName: 'UserRoleMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 1400,
        FeatureName: 'UserRoleRight',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 1500,
        FeatureName: 'ExternalUserMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 1600,
        FeatureName: 'CompanyMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 1700,
        FeatureName: 'FinancialYearMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 1800,
        FeatureName: 'EmployeeMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 1900,
        FeatureName: 'AccountingTransaction',
        FeatureGroupRef: 20,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 2000,
        FeatureName: 'VendorReport',
        FeatureGroupRef: 30,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 2100,
        FeatureName: 'MaterialReport',
        FeatureGroupRef: 30,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 2200,
        FeatureName: 'EmployeeReport',
        FeatureGroupRef: 30,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 2300,
        FeatureName: 'MaterialTransaction',
        FeatureGroupRef: 20,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
    ];
    const mappedItems = validMenu
      .filter((item: MenuItem) => item.CanView) // Must have CanView permission
      .map((item: MenuItem) => {
        const mappedFeature = this.featureMap[item.FeatureRef]; // Return null if the feature is not mapped

        if (!mappedFeature) {
          return null;
        } // Return the GridItem object

        return {
          label: mappedFeature.label || item.FeatureName,
          icon: mappedFeature.icon,
          routerPath: mappedFeature.routerPath,
          group: mappedFeature.group,
        } as GridItem;
      }); // 2. Filter out null values, filter out group 10 (assuming masters), and sort // console.log('mappedItems :', mappedItems); // Keeping console.log for debugging purposes

    this.gridItems = mappedItems
      .filter((item): item is GridItem => item !== null) // Type Predicate fix to filter out nulls
      .filter((item: GridItem) => item.group !== 10) // Further filtering (e.g., hiding masters)
      .sort((a, b) => a.label.localeCompare(b.label));
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

  private async fetchServerTime(): Promise<void> {
    try {
      const serverDateStr = await CurrentDateTimeRequest.GetCurrentDateTime();
      this.currentDate = this.formatDateString(serverDateStr);
    } catch (error) {
      console.error('Error fetching date:', error);
      this.currentDate = this.formatDate(new Date());
    }
  }
  // === UI Helper Methods ===

  selectItem(index: number): void {
    this.selectedIndex = index;
  }

  async showExitConfirmation(): Promise<void> {
    await this.alertService.presentDynamicAlert({
      header: 'Exit App',
      subHeader: 'Confirmation Required',
      message: 'Are you sure you want to exit?',
      buttons: [
        { text: 'Cancel', role: 'cancel', cssClass: 'custom-cancel' },
        {
          text: 'Yes, Exit',
          cssClass: 'custom-confirm',
          handler: async () => {
            await CapacitorApp.exitApp();
          },
        },
      ],
    });
  }

  private createChart(
    chartRef: ElementRef,
    type: 'bar' | 'doughnut',
    data: any,
    options: any
  ): void {
    if (chartRef?.nativeElement) {
      const canvas = chartRef.nativeElement;

      const existingChart = Chart.getChart(canvas);

      if (existingChart) {
        existingChart.destroy();
      }
      new Chart(canvas, { type, data, options });
    }
  }

  formatDateString(raw: string): string {
    const parts = raw?.substring(0, 10)?.split('-');
    if (parts && parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY
    }
    return raw;
  }

  formatDate(date: string | Date): string {
    return this.dateConversion.formatDate(date);
  }

  getCurrentBalanceByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not Selected', 1000, 'warning');
      return;
    }
    let lst = await Expense.FetchCurrentBalanceByCompanyRef(
      this.companyRef,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
      }
    );
    this.BalanceList = lst;
    if (lst.length > 0) {
      this.totalBalance = lst[0].p.ShreesBalance ?? 0; // Use nullish coalescing
    }

    let cash = lst.find((data) => data.p.ModeOfPayment === 'Cash');
    if (cash) {
      this.cashBalance = cash.p.NetBalance ?? 0; // Use nullish coalescing
    }
    this.getBankCurrentBalance();
  };

  getBankCurrentBalance = () => {
    let allBankData = this.BalanceList.filter(
      (item) => item.p.ModeOfPayment.trim() === 'Bank'
    );
    this.bankBalanceData = this.getBankBalanceChartData(allBankData); // Now that the data is ready, create the chart

    setTimeout(() => {
      const legendPosition = this.getLegendPosition();
      this.createChart(
        this.bankBalanceChartRef,
        'doughnut',
        this.bankBalanceData,
        {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: legendPosition, // Use the responsive legend position
              labels: {
                boxWidth: 20,
                padding: 10,
                usePointStyle: true,
              },
            },
          },
        }
      );
    }, 0);
  };
  /**
   * Generates dynamic data for the bank balance doughnut chart.
   *
   * @param bankData - An array of Expense objects with a 'Bank' mode of payment.
   * @returns An object formatted for a Chart.js doughnut chart.
   */

  private getBankBalanceChartData(bankData: any[]) {
    // Maximum length before wrapping the label text
    const maxLabelLength = 15;

    const labels = bankData.map((item) => {
      const bankName = item.p.BankName || 'Unknown Bank'; // Split the label into two lines if it's too long
      if (bankName.length > maxLabelLength) {
        const words = bankName.split(' ');
        let line1 = '';
        let line2 = '';
        let addedToLine1 = false;

        for (const word of words) {
          if (
            !addedToLine1 &&
            line1.length + word.length + 1 <= maxLabelLength
          ) {
            line1 += (line1.length > 0 ? ' ' : '') + word;
          } else {
            addedToLine1 = true;
            line2 += (line2.length > 0 ? ' ' : '') + word;
          }
        }
        return `${line1}\n${line2}`;
      }
      return bankName;
    });

    const data = bankData.map((item) => item.p.NetBalance || 0); // A predefined palette of colors for the chart

    const backgroundColors = [
      '#2B6CB0',
      '#F6AD55',
      '#38A169',
      '#E53E3E',
      '#805AD5',
      '#319795',
      '#D53F8C',
    ]; // Cycle through the predefined colors for each bank

    const colors = labels.map(
      (_, index) => backgroundColors[index % backgroundColors.length]
    );

    return {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: colors,
          hoverOffset: 4,
        },
      ],
    };
  }
  private getLegendPosition(): 'right' | 'bottom' {
    // Use a media query-like check to determine screen size
    return window.innerWidth >= 768 ? 'right' : 'bottom';
  }

  getIncomeExpenseGraphList = async () => {
    await this.getExpenseGraphListByCompanySiteMonthFilterType();
    await this.getIncomeGraphListByCompanySiteMonthFilterType();
  };

  getExpenseGraphListByCompanySiteMonthFilterType = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not Selected', 1000, 'warning');
      return;
    }
    let lst = await ExpenseGraph.FetchEntireListByCompanySiteMonthFilterType(
      this.companyRef,
      this.BarSiteRef,
      this.SelectedBarMonths,
      this.BarFilterType,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'error');
      }
    );
    this.ExpenseGraphList = lst.map((item) => item.p.TotalGivenAmount ?? 0);
    this.TotalExpense = lst.reduce(
      (sum, item) => sum + (item.p.TotalGivenAmount ?? 0), // Use nullish coalescing
      0
    );
  };

  getIncomeGraphListByCompanySiteMonthFilterType = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not Selected', 1000, 'warning');
      return;
    }
    let lst = await IncomeGraph.FetchEntireListByCompanySiteMonthFilterType(
      this.companyRef,
      this.BarSiteRef,
      this.SelectedBarMonths,
      this.BarFilterType,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'error');
      }
    );
    this.TotalIncome = lst.reduce(
      (sum, item) => sum + (item.p.TotalIncomeAmount ?? 0), // Use nullish coalescing
      0
    );
    this.IncomeGraphList = lst.map((item) => item.p.TotalIncomeAmount ?? 0);
    if (this.BarFilterType == 63 && this.SelectedBarMonths) {
      this.WeekMonthList = lst.map((item) => item.p.WeekName);
    } else if (this.BarFilterType == 63) {
      // Corrected the month list spelling (Spet -> Sept)
      this.WeekMonthList = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'June',
        'Jul',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Dec',
      ];
    } else {
      this.WeekMonthList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    }
  }; // Add a new method to create the income/expense chart

  private createIncomeExpenseChart(): void {
    const legendPosition = this.getLegendPosition(); // Find the highest value to set a proper max for the y-axis

    const maxIncome = Math.max(...this.IncomeGraphList);
    const maxExpense = Math.max(...this.ExpenseGraphList);
    const maxValue = Math.max(maxIncome, maxExpense); // Round up to the nearest 50,000 to keep the ticks clean
    const suggestedMax = Math.ceil(maxValue / 50000) * 50000; // Update the data object here

    this.incomeExpenseData = {
      labels: this.WeekMonthList,
      datasets: [
        {
          label: 'Income',
          data: this.IncomeGraphList,
          backgroundColor: 'rgba(56, 161, 105, 0.6)',
          borderColor: '#38A169',
          borderWidth: 1,
        },
        {
          label: 'Expense',
          data: this.ExpenseGraphList,
          backgroundColor: 'rgba(235, 87, 87, 0.6)',
          borderColor: '#EB5757',
          borderWidth: 1,
        },
      ],
    };

    this.createChart(
      this.incomeExpenseChartRef,
      'bar',
      this.incomeExpenseData,
      {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: legendPosition,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              // stepSize: 50000,
              callback: function (value: number) {
                // Custom callback for Indian currency format (K, Lakhs, Cr)
                if (value >= 10000000) {
                  return (value / 10000000).toFixed(1) + ' Cr';
                } else if (value >= 100000) {
                  return (value / 100000).toFixed(1) + ' Lakhs';
                } else if (value >= 1000) {
                  return (value / 1000).toFixed(1) + ' K';
                }
                return value;
              },
            },
            suggestedMax: suggestedMax,
          },
        },
      }
    );
  }

  getTodayAttendanceLogByAttendanceListType = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let TodaysAttendanceLog =
      await WebAttendaneLog.FetchEntireListByCompanyRefAndAttendanceLogType(
        this.companyRef,
        AttendanceLogType.TodaysAttendanceLog,
        async (errMsg) => {
          await this.toastService.present('Error' + errMsg, 1000, 'danger');
          await this.haptic.error();
        }
      );
    this.todayAttendanceList = TodaysAttendanceLog; // Correctly set the people present count for the Admin view
    this.peoplePresent = this.todayAttendanceList.length;
  };
}
