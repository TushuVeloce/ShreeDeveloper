import { Component, OnInit, OnDestroy } from '@angular/core';
import { SegmentValue } from '@ionic/angular';
import { AttendanceLogType, DomainEnums, LeaveRequestType } from 'src/app/classes/domain/domainenums/domainenums';
import { AttendanceLogs } from 'src/app/classes/domain/entities/website/HR_and_Payroll/attendancelogs/attendancelogs';
import { FinancialYear } from 'src/app/classes/domain/entities/website/masters/financialyear/financialyear';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';

@Component({
  selector: 'app-all-attendance-mobile-app',
  templateUrl: './all-attendance-mobile-app.component.html',
  styleUrls: ['./all-attendance-mobile-app.component.scss'],
  standalone: false,
})
export class AllAttendanceMobileAppComponent implements OnInit, OnDestroy {
  selectedMonth: number = 0;
  months: any[] = DomainEnums.MonthList();
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
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    public loadingService: LoadingService,
    private companystatemanagement: CompanyStateManagement,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.loadAttendanceDetailsIfEmployeeExists();
  }

  ngOnDestroy(): void {
    // Any cleanup logic
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
      await this.loadingService.show();

      const employeeRef = Number(this.appStateManagement.localStorage.getItem('LoginEmployeeRef'));
      this.companyRef = Number(this.appStateManagement.localStorage.getItem('SelectedCompanyRef'));
      this.CompanyRef = this.companyRef;
      this.CompanyName = this.companystatemanagement.getCurrentCompanyName();
      this.attendanceLogFilter.p.EmployeeRef = employeeRef;

      await this.getFinancialYearListByCompanyRef();

      if (employeeRef > 0) {
        this.months = DomainEnums.MonthList();
        await this.fetchAttendanceByMonth(new Date().getMonth()+1);
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

  async getFinancialYearListByCompanyRef(): Promise<void> {
    try {
      if (this.CompanyRef <= 0) {
        await this.toastService.present('Company not selected', 1000, 'warning');
        await this.haptic.warning();
        return;
      }

      const lst = await FinancialYear.FetchEntireListByCompanyRef(
        this.CompanyRef,
        async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg)
      );

      const updatedArray = lst.map(item => ({
        ...item,
        FromDate: item.p.FromDate?.substring(0, 4) || '',
        ToDate: item.p.ToDate?.substring(0, 4) || '',
      }));

      const years: string[] = [];

      updatedArray.forEach(item => {
        if (item.FromDate) years.push(item.FromDate);
        if (item.ToDate) years.push(item.ToDate);
      });

      this.FinancialYearList = Array.from(new Set(years)).sort();
    } catch (error) {
      this.handleError(error, 'Fetching financial year list');
    }
  }

  // async fetchAttendanceByMonth(value: SegmentValue | undefined): Promise<void> {
  //   try {
  //     const SelectedMonth = Number(value)+1;
  //     if (isNaN(SelectedMonth)) return;

  //     this.selectedMonth = SelectedMonth;
  //     this.attendanceLogFilter.p.Months = SelectedMonth;

  //     await this.fetchMonthlyLogs();
  //   } catch (error) {
  //     this.handleError(error, 'Fetching attendance for selected month');
  //   }
  // }
  async fetchAttendanceByMonth(value: number | undefined): Promise<void> {
    try {
      await this.loadingService.show();
      const SelectedMonth = Number(value);
      if (isNaN(SelectedMonth)) return;

      this.selectedMonth = SelectedMonth;
      this.attendanceLogFilter.p.Months = SelectedMonth;

      await this.fetchMonthlyLogs();
    } catch (error) {
      this.handleError(error, 'Fetching attendance for selected month');
    }finally{
      await this.loadingService.hide();
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
        async errMsg => {
          await this.toastService.present(errMsg, 1000, 'danger');
          await this.haptic.error();
        }
      );
      // console.log('logs :', logs);

      this.monthlyAttendanceLogsList = logs;
      this.filteredMonthlyAttendanceLogsList = logs;

      this.PresentCount = logs.filter(log => log.p.FirstCheckInTime).length;
      this.AbsentCount = logs.filter(log => !log.p.FirstCheckInTime && !log.p.OnLeave).length;
    } catch (error) {
      this.handleError(error, 'Fetching monthly logs');
    }
  }

  onYearChange(): void {
    if (!this.SelectedYear || this.SelectedYear.length === 0) return;
    this.fetchMonthlyLogs();
  }

  getDayName(dateString: string): string {
    const formatted = this.formatDate(dateString);
    const date = this.parseFormattedDate(formatted);
    return isNaN(date.getTime()) ? '--' : date.toLocaleDateString(this.DEFAULT_LOCALE, { weekday: 'long' });
  }

  formatDay(dateString: string): string {
    const formatted = this.formatDate(dateString);
    const date = this.parseFormattedDate(formatted);
    return isNaN(date.getTime()) ? '--' : date.toLocaleDateString(this.DEFAULT_LOCALE, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  private parseFormattedDate(dateString: string): Date {
    const [day, month, year] = dateString.split('-');
    return new Date(`${year}-${month}-${day}`);
  }

  formatDate(date: string | Date): string {
    return this.dateConversionService.formatDate(date);
  }

  private async handleError(error: any, context: string): Promise<void> {
    // console.error(`${context} failed:`, error);
    await this.toastService.present(`Error: ${error?.message || error}`, 1000, 'danger');
    await this.haptic.error();
  }
}
