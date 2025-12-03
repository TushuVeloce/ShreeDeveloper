import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  ApplicationFeatures,
  AttendanceLocationType,
  AttendanceLogType,
  DomainEnums,
} from 'src/app/classes/domain/domainenums/domainenums';
import { AttendanceLogsCount } from 'src/app/classes/domain/entities/website/HR_and_Payroll/attendancelogs/attendancelogcount/attendancelogsCount';
import { WebAttendaneLog } from 'src/app/classes/domain/entities/website/HR_and_Payroll/web_attendance_log/web_attendance_log/webattendancelog';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { FeatureAccessMobileAppService } from 'src/app/services/feature-access-mobile-app.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { GestureService } from 'src/app/views/mobile-app/components/core/gesture.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';

@Component({
  selector: 'app-attendance-approval-mobile-app',
  templateUrl: './attendance-approval-mobile-app.component.html',
  styleUrls: ['./attendance-approval-mobile-app.component.scss'],
  standalone: false,
})
export class AttendanceApprovalMobileAppComponent implements OnInit {
  Entity: WebAttendaneLog = WebAttendaneLog.CreateNewInstance();
  AttendanceLogCount: AttendanceLogsCount =
    AttendanceLogsCount.CreateNewInstance();
  MasterList: WebAttendaneLog[] = [];
  DisplayMasterList: WebAttendaneLog[] = [];
  FilteredMasterList: WebAttendaneLog[] = [];
  SelectedAttendance: WebAttendaneLog = WebAttendaneLog.CreateNewInstance();
  employeeDataList: [] = [];
  AttendanceLogTypeList = DomainEnums.AttendanceLogTypeList();
  MonthList = DomainEnums.MonthList();
  EmployeeList: Employee[] = [];
  LocationType = AttendanceLocationType;
  isModalOpen = false;
  ImageBaseUrl: string = '';
  TimeStamp = Date.now();
  LoginToken = '';

  currentDateTime = '';
  DateValue = '';
  selectedPeriod: number = 0;
  selectEmployee: number = 0;
  selectMonth: number = 0;

  getStatusColor(Data: WebAttendaneLog): string {
    let status = '';
    if (Data.p.IsAttendanceVerified) {
      status = 'approved';
    } else if (Data.p.IsAbsent == true) {
      status = 'absent';
    } else {
      status = 'pending';
    }
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'danger';
      case 'absent':
        return 'danger';
      default:
        return 'medium';
    }
  }
  getStatusText(Data: WebAttendaneLog): string {
    let status = '';
    if (Data.p.IsAttendanceVerified) {
      status = 'approved';
    } else if (Data.p.IsAbsent == true) {
      status = 'absent';
    } else {
      status = 'pending';
    }
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Pending';
      case 'absent':
        return 'Absent';
      default:
        return 'medium';
    }
  }

  getInRemarkColor(Data: WebAttendaneLog): string {
    let status = '';
    if (Data.p.IsLateMark) {
      status = 'late';
    } else {
      status = 'onTime';
    }
    switch (status) {
      case 'late':
        return 'late';
      case 'onTime':
        return 'ontime';
      case 'rejected':
        return 'danger';
      case 'Absent':
        return 'danger';
      default:
        return 'medium';
    }
  }
  getInRemarkText(Data: WebAttendaneLog): string {
    let status = '';
    if (Data.p.IsLateMark) {
      status = 'late';
    } else {
      status = 'onTime';
    }
    switch (status) {
      case 'late':
        return 'late ' + Data.p.DisplayTotalLateMarkHrs;
      case 'onTime':
        return 'On Time';
      case 'rejected':
        return 'rejected';
      default:
        return 'medium';
    }
  }

  getOutRemarkColor(Data: WebAttendaneLog): string {
    let status = '';
    if (Data.p.IsHalfDay) {
      status = 'HalfDay';
    }
    switch (status) {
      case 'HalfDay':
        return 'halfday';
      default:
        return 'medium';
    }
  }
  getOutRemarkText(Data: WebAttendaneLog): string {
    let status = '';
    if (Data.p.IsHalfDay) {
      status = 'HalfDay';
    }
    switch (status) {
      case 'HalfDay':
        return 'Half Day';
      default:
        return '';
    }
  }
  getItemDisable(Data: WebAttendaneLog): string {
    let status = '';
    if (Data.p.IsAbsent == true) {
      status = 'item-card-disabled';
    }
    switch (status) {
      case 'item-card-disabled':
        return 'item-card-disabled';
      default:
        return '';
    }
  }
  getItemIsLeave(Data: WebAttendaneLog): boolean {
    if (Data.p.IsLeave == true) {
      return true;
    } else {
      return false;
    }
  }

  PeriodOptions = [
    { label: 'Today', value: 0 },
    { label: 'Weekly', value: 1 },
    { label: 'Monthly', value: 2 },
  ];

  approve(item: any) {
    item.status = 'Approved';
    // this.summary.pending--;
    // this.summary.approved++;
  }

  reject(item: any) {
    item.status = 'Rejected';
    // this.summary.pending--;
    // this.summary.rejected++;
  }

  isAdmin: boolean = false;
  employeeRef: number = 0;
  companyRef: number = 0;
  featureRef: ApplicationFeatures = ApplicationFeatures.HRAttendance;
  
  constructor(
    private appStateManagement: AppStateManageService,
    private dateConversionService: DateconversionService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    public loadingService: LoadingService,
    private companystatemanagement: CompanyStateManagement,
    private utils: Utils,
    private router: Router,
    private baseUrl: BaseUrlService,
    private gestureService: GestureService,
    public access: FeatureAccessMobileAppService
  ) {}

  async ngOnInit() {
     this.access.refresh();
    await this.loadAttendanceDetailsIfEmployeeExists();
  }

  ngOnDestroy(): void {
    // Any cleanup logic
  }

  ionViewWillEnter = async () => {
     this.access.refresh();
    await this.loadAttendanceDetailsIfEmployeeExists();
  };

  async handleRefresh(event: CustomEvent): Promise<void> {
    await this.loadAttendanceDetailsIfEmployeeExists();
    (event.target as HTMLIonRefresherElement).complete();
  }
  
  async loadAttendanceDetailsIfEmployeeExists(): Promise<void> {
    try {
      await this.loadingService.show();

      this.employeeRef = Number(
        this.appStateManagement.localStorage.getItem('LoginEmployeeRef')
      );
      this.companyRef = Number(
        this.appStateManagement.localStorage.getItem('SelectedCompanyRef')
      );
      this.isAdmin =
        (await this.appStateManagement.localStorage.getItem(
          'IsDefaultUser'
        )) === '1';
      this.ImageBaseUrl = this.baseUrl.GenerateImageBaseUrl();
      this.LoginToken = this.appStateManagement.getLoginTokenForMobile();
      await this.getCurrentTimeAndDate();
      await this.getEmployeeListByCompanyRef();
      await this.filterRequestsByStatus();
    } catch (error) {
    } finally {
      this.loadingService.hide();
    }
  }

  openModal(Data: WebAttendaneLog) {
    this.isModalOpen = true;
    this.SelectedAttendance = Data;
  }
  closeModal() {
    this.isModalOpen = false;
    this.SelectedAttendance = WebAttendaneLog.CreateNewInstance();
  }

  convertTo12HourFormat = (time: string): any => {
    const [hourStr, minuteStr] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour === 0 ? 12 : hour;

    return `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

  getCurrentTimeAndDate = async () => {
    try {
      const strCurrentDateTime =
        await CurrentDateTimeRequest.GetCurrentDateTime();
      this.DateValue = strCurrentDateTime.substring(0, 10);
      this.currentDateTime = strCurrentDateTime;
    } catch (error) {
      this.toastService.present(
        'Error obtaining current date/time',
        1000,
        'danger'
      );
      await this.haptic.warning();
    }
  };
  filterRequestsByStatus = async () => {
    switch (this.selectedPeriod) {
      case 0:
        await this.getTodayAttendanceLogByAttendanceListType();
        break;
      case 1:
        this.DisplayMasterList = [];
        this.Entity.p.EmployeeRef = 0;
        this.selectEmployee = 0;
        this.resetSummaryStats();
        break;
      case 2:
        this.DisplayMasterList = [];
        this.Entity.p.EmployeeRef = 0;
        this.selectEmployee = 0;
        this.selectMonth = 0;
        this.Entity.p.Months = 0;
        this.resetSummaryStats();
        break;
    }
  };

  onMonthChange = async () => {
    this.Entity.p.Months = this.selectMonth;
    if (this.selectedPeriod === 2) {
      await this.getMonthWiseAttendanceLogByAttendanceListType();
    }
  };
  onEmployeeChange = async () => {
    this.Entity.p.EmployeeRef = this.selectEmployee;
    if (this.selectedPeriod === 1) {
      await this.getWeekWiseAttendanceLogByAttendanceListType();
    }
    if (this.selectedPeriod === 2) {
      await this.getMonthWiseAttendanceLogByAttendanceListType();
    }
  };

  getEmployeeListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await Employee.FetchEntireListByCompanyRef(
      this.companyRef,
      async (errMsg) => {
        await this.toastService.present('Error' + errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.EmployeeList = lst;
  };

  getTodayAttendanceLogByAttendanceListType = async () => {
    this.resetSummaryStats();

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
    this.DisplayMasterList = TodaysAttendanceLog;
    this.getAttendanceCount(AttendanceLogType.TodaysAttendanceLog);
  };

  ChangeAttendanceStatus = async (Entity: WebAttendaneLog) => {
    this.Entity = Entity;
    this.Entity.p.UpdatedBy = Number(
      this.appStateManagement.localStorage.getItem('LoginEmployeeRef')
    );
    this.Entity.p.IsAttendanceVerified = true;
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      await this.toastService.present('Error' + tr.Message, 1000, 'danger');
      await this.haptic.error();
      Entity.p.IsAttendanceVerified = false;
      return;
    } else {
      if (this.selectedPeriod == 0) {
        this.getTodayAttendanceLogByAttendanceListType();
      }
      await this.toastService.present(
        'Attendance Updated successfully',
        1000,
        'success'
      );
      await this.haptic.success();
    }
  };

  getWeekWiseAttendanceLogByAttendanceListType = async () => {
    this.resetSummaryStats();

    let employeeref = this.Entity.p.EmployeeRef;

    if (employeeref <= 0) {
      await this.toastService.present('Employee not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }

    let WeeklyAttendanceLog =
      await WebAttendaneLog.FetchEntireListByCompanyRefAndAttendanceLogTypeAndEmployee(
        this.companyRef,
        AttendanceLogType.WeeklyAttendanceLog,
        employeeref,
        async (errMsg) => {
          await this.toastService.present('Error' + errMsg, 1000, 'danger');
          await this.haptic.error();
        }
      );
    this.DisplayMasterList = WeeklyAttendanceLog;
    this.getAttendanceCount(AttendanceLogType.WeeklyAttendanceLog);
  };
  getMonthWiseAttendanceLogByAttendanceListType = async () => {
    this.resetSummaryStats();
    this.DisplayMasterList = [];

    const month = this.Entity.p.Months;
    const employeeref = this.Entity.p.EmployeeRef;

    let MonthlyAttendanceLog =
      await WebAttendaneLog.FetchEntireListByCompanyRefAndAttendanceLogTypeAndMonth(
        this.companyRef,
        AttendanceLogType.MonthlyAttendanceLog,
        month,
        employeeref,
        async (errMsg) => {
          await this.toastService.present('Error' + errMsg, 1000, 'danger');
          await this.haptic.error();
        }
      );
    this.DisplayMasterList = MonthlyAttendanceLog;
    this.getAttendanceCount(AttendanceLogType.MonthlyAttendanceLog);
  };

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.dateConversionService.formatDate(date);
  };

  getAttendanceCount = async (AttendanceLogType: number) => {
    this.AttendanceLogCount.p.TeamSize = 0;
    this.AttendanceLogCount.p.Present = 0;
    this.AttendanceLogCount.p.Absent = 0;
    this.AttendanceLogCount.p.OnLeave = 0;
    this.AttendanceLogCount.p.TotalDaysInMonth = 0;
    this.AttendanceLogCount.p.TotalDaysInWeek = 0;
    let lst =
      await AttendanceLogsCount.FetchEntireListByCompanyRefAndAttendanceLogTypeAndMonth(
        this.companyRef,
        AttendanceLogType,
        this.Entity.p.Months,
        this.Entity.p.EmployeeRef,
        async (errMsg) => {
          await this.toastService.present('Error' + errMsg, 1000, 'danger');
          await this.haptic.error();
        }
      );
    this.AttendanceLogCount.p.TeamSize = lst[0]?.p?.TeamSize;
    this.AttendanceLogCount.p.Present = lst[0]?.p?.Present;
    this.AttendanceLogCount.p.Absent = lst[0]?.p?.Absent;
    this.AttendanceLogCount.p.OnLeave = lst[0]?.p?.OnLeave;
    this.AttendanceLogCount.p.TotalDaysInMonth = lst[0]?.p?.TotalDaysInMonth;
    this.AttendanceLogCount.p.TotalDaysInWeek = lst[0]?.p?.TotalDaysInWeek;
  };
  getImageURL(Data: string): string {
    return `${this.ImageBaseUrl}${Data}/${this.LoginToken}?${this.TimeStamp}`;
  }

  AddAttendance = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    this.router.navigate(['/homepage/Website/Attendance_Logs_Details']);
  };

  resetSummaryStats() {
    this.Entity.p.TeamSize = 0;
    this.Entity.p.Present = 0;
    this.Entity.p.Absent = 0;
    this.Entity.p.OnLeave = 0;
    this.Entity.p.TotalDaysInWeek = 0;
    this.Entity.p.TotalDaysInMonth = 0;

    this.AttendanceLogCount.p.Present = 0;
    this.AttendanceLogCount.p.Absent = 0;
    this.AttendanceLogCount.p.OnLeave = 0;
  }
}
