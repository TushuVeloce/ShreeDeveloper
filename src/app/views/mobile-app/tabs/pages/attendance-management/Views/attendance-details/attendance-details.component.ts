import { Component, OnInit } from '@angular/core';
import { AttendenceLogType, DomainEnums, LeaveRequestType } from 'src/app/classes/domain/domainenums/domainenums';
import { AttendanceLogs } from 'src/app/classes/domain/entities/website/HR_and_Payroll/attendancelogs/attendancelogs';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import type { SegmentValue } from '@ionic/core';


@Component({
  selector: 'app-attendance-details',
  templateUrl: './attendance-details.component.html',
  styleUrls: ['./attendance-details.component.scss'],
  standalone: false
})
export class AttendanceDetailsComponent implements OnInit {
  selectedMonth: number = 0;
  months: any[] = [];
  isLoading: boolean = false;
  companyRef: number = 0;

  attendanceLogFilter: AttendanceLogs = AttendanceLogs.CreateNewInstance();
  monthlyAttendanceLogsList: AttendanceLogs[] = [];
  filteredMonthlyAttendanceLogsList: AttendanceLogs[] = [];
  selectedAttendanceLog: AttendanceLogs = AttendanceLogs.CreateNewInstance();

  readonly leaveTypeEnum = LeaveRequestType;
  readonly DEFAULT_LOCALE = 'en-US';

  constructor(
    private uiUtils: UIUtils,
    private appState: AppStateManageService,
    private dateConversionService: DateconversionService,
    private dateService: DateconversionService
  ) { }

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
      this.isLoading = true;
      this.attendanceLogFilter.p.EmployeeRef = this.appState.getEmployeeRef();
      this.companyRef = Number(this.appState.StorageKey.getItem('SelectedCompanyRef'));
      if (this.attendanceLogFilter.p.EmployeeRef > 0) {
        this.months = DomainEnums.MonthList();
        await this.fetchAttendanceByMonth(new Date().getMonth());
      } else {
        await this.uiUtils.showErrorToster('Employee not selected');
      }
    } catch (error) {
      this.handleError(error, 'Loading attendance details');
    } finally {
      this.isLoading = false;
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
        AttendenceLogType.MonthlyAttendanceLog,
        month,
        employeeRef,
        async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg)
      );
      this.monthlyAttendanceLogsList = logs;
      this.filteredMonthlyAttendanceLogsList = logs;
      console.log('filteredMonthlyAttendanceLogsList :', this.filteredMonthlyAttendanceLogsList);
    } catch (error) {
      this.handleError(error, 'Fetching monthly logs');
    }
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
    this.uiUtils.showErrorToster(`${context} failed`);
  }
}
