import { Component, OnInit } from '@angular/core';
import { SegmentValue } from '@ionic/angular';
import { AttendanceLogType, DomainEnums, LeaveRequestType } from 'src/app/classes/domain/domainenums/domainenums';
import { AttendanceLogs } from 'src/app/classes/domain/entities/website/HR_and_Payroll/attendancelogs/attendancelogs';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { ToastService } from '../../core/toast.service';
import { HapticService } from '../../core/haptic.service';
import { AlertService } from '../../core/alert.service';
import { LoadingService } from '../../core/loading.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { FinancialYear } from 'src/app/classes/domain/entities/website/masters/financialyear/financialyear';

@Component({
  selector: 'app-attendance-details-mobile',
  templateUrl: './attendance-details-mobile.page.html',
  styleUrls: ['./attendance-details-mobile.page.scss'],
  standalone: false
})
export class AttendanceDetailsMobilePage implements OnInit {
  selectedMonth: number = 0;
  months: any[] = [];
  // isLoading: boolean = false;
  companyRef: number = 0;

  attendanceLogFilter: AttendanceLogs = AttendanceLogs.CreateNewInstance();
  monthlyAttendanceLogsList: AttendanceLogs[] = [];
  filteredMonthlyAttendanceLogsList: any[] = [];
  selectedAttendanceLog: AttendanceLogs = AttendanceLogs.CreateNewInstance();
  
  public SelectedYear: any[] = [];
  public FinancialYearList: string[] = [];
  private CompanyRef: number = 0;
  private CompanyName: string = '';
  public PresentCount: number = 0;
  public AbsentCount: number = 0;

  readonly leaveTypeEnum = LeaveRequestType;
  readonly DEFAULT_LOCALE = 'en-US';

  constructor(
    private uiUtils: UIUtils,
    private appStateManagement: AppStateManageService,
    private dateConversionService: DateconversionService,
    private dateService: DateconversionService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private companystatemanagement: CompanyStateManagement,

  ) { 
    // this.filteredMonthlyAttendanceLogsList = [
    //   {
    //     p: {
    //       TransDateTime: '2025-07-01',
    //       FirstCheckInTime: '09:15 AM',
    //       LastCheckOutTime: '05:45 PM',
    //       TotalWorkingHrs: '8:30',
    //       OnLeave: false
    //     }
    //   },
    //   {
    //     p: {
    //       TransDateTime: '2025-07-02',
    //       FirstCheckInTime: '',
    //       LastCheckOutTime: '',
    //       TotalWorkingHrs: '',
    //       OnLeave: true
    //     }
    //   },
    //   {
    //     p: {
    //       TransDateTime: '2025-07-03',
    //       FirstCheckInTime: '',
    //       LastCheckOutTime: '',
    //       TotalWorkingHrs: '',
    //       OnLeave: false
    //     }
    //   },
    //   {
    //     p: {
    //       TransDateTime: '2025-07-04',
    //       FirstCheckInTime: '10:00 AM',
    //       LastCheckOutTime: '06:00 PM',
    //       TotalWorkingHrs: '8:00',
    //       OnLeave: false
    //     }
    //   }
    // ];
  }

  async ngOnInit(): Promise<void> {
    await this.loadAttendanceDetailsIfEmployeeExists();
  }

  ngOnDestroy(): void {
    // cleanup if needed in the future
  }

  ionViewWillEnter = async () => {
    await this.loadAttendanceDetailsIfEmployeeExists();
  };

  async handleRefresh(event: CustomEvent): Promise<void> {
    await this.loadAttendanceDetailsIfEmployeeExists();
    (event.target as HTMLIonRefresherElement).complete();
  }

  async loadAttendanceDetailsIfEmployeeExists(): Promise<void> {
    try {
      this.loadingService.show();
      this.attendanceLogFilter.p.EmployeeRef = this.appStateManagement.getEmployeeRef();
      this.CompanyRef = Number(this.appStateManagement.localStorage.getItem('SelectedCompanyRef'));
      this.CompanyName = this.companystatemanagement.getCurrentCompanyName();
      await this.getFinancialYearListByCompanyRef();

      if (this.attendanceLogFilter.p.EmployeeRef > 0) {
        this.months = DomainEnums.MonthList();
        await this.fetchAttendanceByMonth(new Date().getMonth());
      } else {
        await this.toastService.present('Employee not selected', 1000, 'danger');
        await this.haptic.error();
      }
    } catch (error) {
      this.handleError(error, 'Loading attendance details');
    } finally {
      this.loadingService.hide();
    }
  }

    getFinancialYearListByCompanyRef = async () => {
      try {
        this.FinancialYearList = [];
        if (this.CompanyRef <= 0) {
          // await this.uiUtils.showErrorToster('Company not Selected');
          await this.toastService.present('Company not selected', 1000, 'warning');
          await this.haptic.warning();
          return;
        }
        let lst = await FinancialYear.FetchEntireListByCompanyRef(this.CompanyRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
  
        const updatedArray = lst.map(item => ({
          ...item,
          FromDate: item.p.FromDate.substring(0, 4),
          ToDate: item.p.ToDate.substring(0, 4)
        }));
  
        const years: string[] = [];
  
        updatedArray.forEach(item => {
          years.push(item.FromDate);
          years.push(item.ToDate);
        });
  
        // Step 2: Sort and remove duplicates
        const uniqueYears = Array.from(new Set(years)).sort();
  
        this.FinancialYearList = uniqueYears;
      } catch (error) {
  
      }
    }
  

  async fetchAttendanceByMonth(value: SegmentValue | undefined): Promise<void> {
    try {
      const SelectedMonth = Number(value);
      if (isNaN(SelectedMonth)) return;
      this.selectedMonth = SelectedMonth;
      this.attendanceLogFilter.p.Months = SelectedMonth;
      await this.fetchMonthlyLogs();
    } catch (error) {
      this.handleError(error, 'Fetching attendance for selected month');
    }
  }

  async fetchMonthlyLogs(): Promise<void> {
    try {
      const month = this.attendanceLogFilter.p.Months;
      const employeeRef = this.attendanceLogFilter.p.EmployeeRef;

      const logs = await AttendanceLogs.FetchEntireListByCompanyRefAndAttendanceLogTypeAndMonth(
        this.companyRef,
        AttendanceLogType.MonthlyAttendanceLog,
        month,
        employeeRef,
        async errMsg => { await this.toastService.present(errMsg, 1000, 'danger'), await this.haptic.error() }
      );
      this.monthlyAttendanceLogsList = logs;
      this.filteredMonthlyAttendanceLogsList = logs;
      this.PresentCount = logs.filter(log => log.p.FirstCheckInTime).length;
      this.AbsentCount = logs.filter(log => !log.p.FirstCheckInTime || log.p.OnLeave).length;
      console.log('filteredMonthlyAttendanceLogsList :', this.filteredMonthlyAttendanceLogsList);
    } catch (error) {
      this.handleError(error, 'Fetching monthly logs');
    }
  }


  onYearChange() {
    console.log('Selected year:', this.SelectedYear);
    this.fetchMonthlyLogs();
  }
  
  getDayName(dateString: string): string {
    const formatted = this.formatDate(dateString); // returns "23-05-2025"
    const date = this.parseFormattedDate(formatted);
    if (isNaN(date.getTime())) return '--';

    return date.toLocaleDateString(this.DEFAULT_LOCALE, { weekday: 'long' });
  }

  formatDay(dateString: string): string {
    const formatted = this.formatDate(dateString); // returns "23-05-2025"
    const date = this.parseFormattedDate(formatted);
    if (isNaN(date.getTime())) return '--';

    return date.toLocaleDateString(this.DEFAULT_LOCALE, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  private parseFormattedDate(dateString: string): Date {
    const [day, month, year] = dateString.split('-');
    return new Date(`${year}-${month}-${day}`);
  }

  // Custom date parsing for "DD-MM-YYYY"
  formatDate(date: string | Date): string {
    // console.log('this.dateConversionService.formatDate(date) :', this.dateConversionService.formatDate(date));
    return this.dateConversionService.formatDate(date);
  }

  private handleError(error: any, context: string): void {
    console.error(`${context} failed:`, error);
    // this.uiUtils.showErrorToster(`${context} failed`);
    this.toastService.present(`Error ${error}`, 1000, 'danger');
    this.haptic.error();
  }
}
