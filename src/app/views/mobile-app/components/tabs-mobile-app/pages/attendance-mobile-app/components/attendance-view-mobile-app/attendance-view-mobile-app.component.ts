import { Component, OnInit } from '@angular/core';
import { SegmentValue } from '@ionic/angular';
import {
  ApplicationFeatures,
  AttendanceLocationType,
  AttendanceLogType,
  DomainEnums,
  LeaveRequestType,
} from 'src/app/classes/domain/domainenums/domainenums';
import { AttendanceLog } from 'src/app/classes/domain/entities/mobile-app/attendance-management/attendancelog';
import { AttendanceLogs } from 'src/app/classes/domain/entities/website/HR_and_Payroll/attendancelogs/attendancelogs';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BottomsheetMobileAppService } from 'src/app/services/bottomsheet-mobile-app.service';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AttendanceLogCheckInCustomProcess } from 'src/app/classes/domain/entities/mobile-app/attendance-management/attendancelogcheckincustomprocess';
import { FileTransferObject } from 'src/app/classes/infrastructure/filetransferobject';
import { AttendanceLogCheckOutCustomProcess } from 'src/app/classes/domain/entities/mobile-app/attendance-management/attendancelogcheckoutcustomprocess';
import { LocationMobileAppService } from 'src/app/views/mobile-app/components/core/location-mobile-app.service';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs';
import { FeatureAccessMobileAppService } from 'src/app/services/feature-access-mobile-app.service';

@Component({
  selector: 'app-attendance-view-mobile-app',
  templateUrl: './attendance-view-mobile-app.component.html',
  styleUrls: ['./attendance-view-mobile-app.component.scss'],
  standalone: false,
})
export class AttendanceViewMobileAppComponent implements OnInit {
  isAdmin: boolean = false;
  punchModalOpen = false;
  isSubmitting = false;
  disableTopCard = false;

  currentDateTime = '';
  checkInTime = '';
  checkOutTime = '';
  attendanceStatus:
    | 'checkedIn'
    | 'checkedOut'
    | 'onLeave'
    | 'notCheckedIn'
    | 'disabled' = 'disabled';

  capturedSelfPhoto: string | null = null;
  rawCapturedSelfPhoto: string | null = null;
  capturedWorkLocationPhoto: string | null = null;
  rawCapturedWorkLocationPhoto: string | null = null;

  attendanceLog = AttendanceLog.CreateNewInstance();

  siteList: Site[] = [];
  selectedSite: Site[] = [];
  selectedAttendanceLocationType: any[] = [];
  SiteName = '';
  AttendanceLocationTypeName = '';
  AttendanceLocationTypeRef: number = 0;
  gridItems: any[] = [];

  weeklyAttendanceLogs: AttendanceLogs[] = [];
  filteredWeeklyAttendanceLogs: AttendanceLogs[] = [];

  AttendanceLocationTypes = AttendanceLocationType;
  attendanceLocationTypeList = DomainEnums.AttendanceLocationTypeList();
  AttendanceLogTypeList = DomainEnums.AttendanceLogTypeMobileAppList();
  readonly LeaveRequestTypeEnum = LeaveRequestType;

  selectedAttendanceLogType: number = AttendanceLogType.TodaysAttendanceLog;
  employeeRef: number = 0;
  companyRef: number = 0;
  selectedMonth: number = new Date().getMonth();

  employeeList: Employee[] = [];
  selectedEmployeeRef: number | null = null;
  employeeSearchTerm$ = new BehaviorSubject<string>('');
  filteredEmployeeList: Employee[] = [];

  constructor(
    private appStateManage: AppStateManageService,
    private dtu: DTU,
    private payloadPacketFacade: PayloadPacketFacade,
    private serverCommunicator: ServerCommunicatorService,
    private dateConversionService: DateconversionService,
    private bottomsheetMobileAppService: BottomsheetMobileAppService,
    private toastService: ToastService,
    private haptic: HapticService,
    public loadingService: LoadingService,
    public locationMobileAppService: LocationMobileAppService,
    public access: FeatureAccessMobileAppService
  ) {}

  ngOnInit = async () => {
    this.access.refresh();
    // Filter grid items based on access
    this.gridItems = this.gridItems.filter((item) =>
      item.Members.some((member: any) => this.access.hasAnyAccess(member))
    );
    // Setup search filter observable
    combineLatest([
      this.employeeSearchTerm$.pipe(debounceTime(300), distinctUntilChanged()),
      // this.employeeList$
    ]).subscribe(([searchTerm]) => {
      this.filterEmployees(searchTerm);
    });

    await this.loadAttendanceIfEmployeeExists();
  };

  ionViewWillEnter = async () => {
    this.access.refresh();
    // Filter grid items based on access
    this.gridItems = this.gridItems.filter((item) =>
      item.Members.some((member: any) => this.access.hasAnyAccess(member))
    );
    await this.loadAttendanceIfEmployeeExists();
  };

  private async buildGridItems() {
    this.gridItems = [
      {
        icon: 'assets/icons/approvals_mobile_app.png',
        label: 'Approvals',
        routerPath: '/mobile-app/tabs/attendance/approvals',
        Ref: 10,
        Members: [
          ApplicationFeatures.HRAttendance,
          ApplicationFeatures.LeaveApproval,
          ApplicationFeatures.SalarySlipApproval,
          ApplicationFeatures.EmployeeOvertime,
        ],
      },
      {
        icon: 'assets/icons/holiday_mobile_app.png',
        label: 'Holidays',
        routerPath: '/mobile-app/tabs/attendance/holidays',
        Ref: 20,
        Members: [ApplicationFeatures.CompanyHolidays],
      },
    ];

    if (!this.isAdmin) {
      this.gridItems.push(
        {
          icon: 'assets/icons/salary_slip_request_mobile_app.png',
          label: 'Salary Slip',
          routerPath: '/mobile-app/tabs/attendance/salary-slip-request',
          Ref: 30,
          Members: [ApplicationFeatures.EmployeeSalarySlipRequest],
        },
        {
          icon: 'assets/icons/leave_requests_mobile_app.png',
          label: 'Leave',
          routerPath: '/mobile-app/tabs/attendance/leave-request',
          Ref: 40,
          Members: [ApplicationFeatures.EmployeeLeaveRequest],
        },
        {
          icon: 'assets/icons/attendance _mobile_app.png',
          label: 'Attendance',
          routerPath: '/mobile-app/tabs/attendance/all-attendance',
          Ref: 50,
          Members: [ApplicationFeatures.EmployeeAttendance],
        }
      );
    }
    // else {
    //   // Admin specific grid items
    //   this.gridItems.push(
    //     {
    //       icon: 'assets/icons/attendance_reports_mobile_app.png',
    //       label: 'Reports',
    //       routerPath: '/mobile-app/tabs/attendance/reports', // new route for reports
    //     },
    //     {
    //       icon: 'assets/icons/leave_requests_mobile_app.png',
    //       label: 'All Leaves',
    //       routerPath: '/mobile-app/tabs/attendance/all-leaves', // new route for all leaves
    //     }
    //   );
    // }
  }

  private async loadAttendanceIfEmployeeExists() {
    try {
      await this.loadingService.show();
      this.isAdmin =
        (await this.appStateManage.localStorage.getItem('IsDefaultUser')) ===
        '1';
      this.companyRef = Number(
        this.appStateManage.localStorage.getItem('SelectedCompanyRef')
      );

      if (!this.isAdmin) {
        this.employeeRef = Number(
          this.appStateManage.localStorage.getItem('LoginEmployeeRef')
        );
        this.disableTopCard = this.employeeRef === 0;
        await this.getCheckInData();
      } else {
        await this.getEmployeeListByCompanyRef();
        this.disableTopCard = false; // Admins won't use this card, so it can be enabled for a user to select an employee
      }

      this.buildGridItems();
      await this.getAttendanceLogByAttendanceType();

      try {
        const strCurrentDateTime =
          await CurrentDateTimeRequest.GetCurrentDateTime();
        this.currentDateTime = strCurrentDateTime;
      } catch (error) {
        this.toastService.present(
          'Error obtaining current date/time',
          1000,
          'danger'
        );
        await this.haptic.warning();
      }
    } catch (error) {
      this.toastService.present(
        'Unexpected error while loading attendance.',
        1000,
        'danger'
      );
    } finally {
      await this.loadingService.hide();
    }
  }

  handleRefresh = async (event: CustomEvent) => {
    try {
      if (!this.isAdmin) {
        await this.getCheckInData();
      }
      await this.getAttendanceLogByAttendanceType();
    } finally {
      (event.target as HTMLIonRefresherElement).complete();
    }
  };

  onAttendanceLogTypeChange = async () => {
    await this.getAttendanceLogByAttendanceType();
  };

  async fetchAttendanceByMonth(value: SegmentValue | undefined): Promise<void> {
    const SelectedMonth = Number(value);
    if (isNaN(SelectedMonth)) return;
    this.selectedMonth = SelectedMonth;
    await this.getAttendanceLogByAttendanceType();
  }

  onEmployeeSearch(event: any) {
    this.employeeSearchTerm$.next(event.detail.value);
  }

  onEmployeeSelect(employee: Employee) {
    this.selectedEmployeeRef = employee.p.Ref;
    this.employeeSearchTerm$.next(''); // Clear the search term
    this.employeeRef = this.selectedEmployeeRef;
    this.loadAttendanceIfEmployeeExists();
  }

  private filterEmployees(searchTerm: string) {
    if (!searchTerm) {
      this.filteredEmployeeList = [];
    } else {
      this.filteredEmployeeList = this.employeeList.filter((employee) =>
        employee.p.Name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  getEmployeeListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    this.employeeList = await Employee.FetchEntireListByCompanyRef(
      this.companyRef,
      async (errMsg) => await this.toastService.present('Error ' + errMsg)
    );
  };

  getCheckInData = async () => {
    try {
      // If employeeRef is not set, disable attendance and return.
      if (this.employeeRef === 0) {
        this.attendanceStatus = 'disabled';
        return;
      }

      this.attendanceLog = AttendanceLog.CreateNewInstance();
      this.checkInTime = '';
      this.checkOutTime = '';

      const strCurrentDateTime =
        await CurrentDateTimeRequest.GetCurrentDateTime();
      const tranDate = this.dtu.ConvertStringDateToFullFormat(
        strCurrentDateTime.substring(0, 10)
      );

      const lst = await AttendanceLog.FetchEntireListByCompanyRef(
        this.employeeRef,
        this.companyRef,
        tranDate,
        async (errMsg) => {
          this.toastService.present('Error ' + errMsg, 1000, 'danger');
          await this.haptic.error();
        }
      );

      // Guard clause for empty list
      if (!lst || lst.length === 0) {
        this.attendanceStatus = 'notCheckedIn';
        return;
      }

      const attendanceData = lst[0].p;

      // First, check for 'onLeave' status as a priority.
      if (attendanceData.IsLeave === 1) {
        this.attendanceStatus = 'onLeave';
        return;
      }

      // A more reliable way to determine status based on CheckInTime and CheckOutTime
      if (attendanceData.CheckInTime && attendanceData.CheckOutTime) {
        // Completed check-in/check-out cycle
        this.attendanceStatus = 'checkedOut';
        this.checkInTime = attendanceData.CheckInTime;
        this.checkOutTime = attendanceData.CheckOutTime;
      } else if (attendanceData.CheckInTime && !attendanceData.CheckOutTime) {
        // User has checked in but not checked out yet
        this.attendanceStatus = 'checkedIn';
        this.checkInTime = attendanceData.CheckInTime;
      } else {
        // No check-in has been performed
        this.attendanceStatus = 'notCheckedIn';
      }
    } catch (error) {
      this.toastService.present(
        'Unexpected error while fetching attendance.',
        1000,
        'danger'
      );
      await this.haptic.error();
    }
  };

  //  getCheckInData = async () => {
  //   try {
  //     if (this.employeeRef == 0) {
  //       await this.toastService.present('Employee is not');
  //       await this.haptic.warning();
  //       return;
  //     }
  //     this.attendanceLog = AttendanceLog.CreateNewInstance();
  //     this.checkInTime = '';
  //     this.checkOutTime = '';
  //     this.isOnLeave = false;

  //     const tranDate = this.dtu.ConvertStringDateToFullFormat(this.DateValue);
  //     const lst = await AttendanceLog.FetchEntireListByCompanyRef(
  //       this.employeeRef,
  //       this.companyRef,
  //       tranDate,
  //       async (errMsg) => {
  //         this.toastService.present('Error ' + errMsg, 1000, 'danger');
  //         await this.haptic.error();
  //       }
  //     );

  //     if (!lst || lst.length === 0) {
  //       this.isCheckInEnabled = true;
  //       this.bothButtonsEnabled = true;
  //       return;
  //     }

  //     const checkInData: AttendanceLogProps[] = lst.map((log) => log.p);
  //     const pendingCheckIn = checkInData.find((e) => !e.CheckOutTime);
  //     const completedCheckIn = checkInData.find((e) => e.CheckOutTime);

  //     // Assign latest attendance data to attendanceLog
  //     Object.assign(
  //       this.attendanceLog.p,
  //       pendingCheckIn || completedCheckIn || {}
  //     );

  //     // Update state from assigned log data
  //     const { FirstCheckInTime, CheckInTime, CheckOutTime } =
  //       this.attendanceLog.p;

  //     if (!FirstCheckInTime && !CheckInTime && !CheckOutTime) {
  //       this.isCheckInEnabled = true;
  //       this.bothButtonsEnabled = true;
  //     } else if (CheckInTime && !CheckOutTime) {
  //       this.isCheckInEnabled = false;
  //       this.bothButtonsEnabled = true;
  //     } else if (CheckInTime && CheckOutTime) {
  //       this.isCheckInEnabled = true;
  //       this.bothButtonsEnabled = true;
  //     } else {
  //       this.isCheckInEnabled = false;
  //       this.bothButtonsEnabled = false;
  //     }

  //     // Optionally use `AttendanceLogCheckInOut` if it contains relevant runtime data
  //     this.checkInTime = this.attendanceLog.p.CheckInTime || '';
  //     this.checkOutTime = this.attendanceLog.p.CheckOutTime || '';
  //     this.isOnLeave = Boolean(this.attendanceLog.p.IsLeave);
  //   } catch (error) {
  //     this.toastService.present(
  //       'Unexpected error while fetching attendance.',
  //       1000,
  //       'danger'
  //     );
  //     await this.haptic.error();
  //   }
  // };

  formatDate(date: string | Date): string {
    return this.dateConversionService.formatDate(date);
  }

  convertTo12HourFormat = (time: string): string => {
    const [hourStr, minuteStr] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour === 0 ? 12 : hour;

    return `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

  openPunchModal = async () => {
    this.punchModalOpen = true;
    try {
      this.siteList = await Site.FetchEntireListByCompanyRef(
        this.companyRef,
        async (errMsg) => {
          this.toastService.present('Error ' + errMsg, 1000, 'danger');
          await this.haptic.error();
        }
      );
      await this.locationMobileAppService.getCurrentCoordinates();
    } catch (error) {}
  };

  takePhoto = async (type: 'before' | 'after') => {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });
      const uri = image.webPath;

      if (type === 'before') {
        this.rawCapturedSelfPhoto = uri || null;
        this.capturedSelfPhoto = uri || null;
      } else {
        this.rawCapturedWorkLocationPhoto = uri || null;
        this.capturedWorkLocationPhoto = uri || null;
      }
    } catch (error) {
      this.toastService.present(
        `Error capturing ${type} photo`,
        1000,
        'danger'
      );
      await this.haptic.error();
    }
  };

  uriToFile = async (
    uri: string,
    fileName: string,
    mimeType = 'image/jpeg'
  ) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new File([blob], fileName, { type: mimeType });
  };

  submitPunchIn = async () => {
    try {
      await this.loadingService.show();
      this.isSubmitting = true;
      if (
        !this.employeeRef ||
        !this.companyRef ||
        this.selectedAttendanceLocationType.length === 0
      ) {
        this.toastService.present(
          'Missing required information',
          1000,
          'warning'
        );
        await this.haptic.warning();
        return;
      }

      const request = new AttendanceLogCheckInCustomProcess();
      Object.assign(request, {
        IsCheckIn: true,
        CompanyRef: this.companyRef,
        EmployeeRef: this.employeeRef,
        SiteRef: this.selectedSite[0]?.p?.Ref || 0,
        AttendanceLocationType:
          Number(this.selectedAttendanceLocationType[0].p.Ref) || 0,
      });

      const filesToUpload: FileTransferObject[] = [];
      if (this.rawCapturedSelfPhoto) {
        const file = await this.uriToFile(
          this.rawCapturedSelfPhoto,
          'PunchIn_Self_Photo.jpg'
        );
        filesToUpload.push(
          FileTransferObject.FromFile(
            'AttendanceLogFile1',
            file,
            'PunchIn_Self_Photo.jpg'
          )
        );
      }
      if (this.rawCapturedWorkLocationPhoto) {
        const file = await this.uriToFile(
          this.rawCapturedWorkLocationPhoto,
          'PunchIn_Work_location.jpg'
        );
        filesToUpload.push(
          FileTransferObject.FromFile(
            'AttendanceLogFile2',
            file,
            'PunchIn_Work_location.jpg'
          )
        );
      }

      const pkt = this.payloadPacketFacade.CreateNewPayloadPacket2(
        request.FormulateTransportData()
      );
      const tr = await this.serverCommunicator.sendHttpRequest(
        pkt,
        'acceptrequest',
        filesToUpload
      );

      if (!tr.Successful) {
        this.toastService.present(`Error: ${tr.Message}`, 1000, 'danger');
        await this.haptic.error();
        return;
      }

      this.toastService.present('Punch in successfully', 1000, 'success');
      await this.haptic.success();
    } catch (error) {
    } finally {
      this.punchModalOpen = false;
      this.resetPunchState();
      this.isSubmitting = false;
      await Promise.all([
        this.getCheckInData(),
        this.getAttendanceLogByAttendanceType(),
      ]);
      await this.loadingService.hide();
    }
  };

  submitPunchOut = async () => {
    try {
      await this.loadingService.show();
      this.isSubmitting = true;

      const request = new AttendanceLogCheckOutCustomProcess();
      Object.assign(request, {
        IsCheckIn: false,
        CompanyRef: this.companyRef,
        EmployeeRef: this.employeeRef,
      });

      const pkt = this.payloadPacketFacade.CreateNewPayloadPacket2(
        request.FormulateTransportData()
      );
      const tr = await this.serverCommunicator.sendHttpRequest(pkt);

      if (!tr.Successful) {
        this.toastService.present(`Error: ${tr.Message}`, 1000, 'danger');
        await this.haptic.error();
        return;
      }

      this.toastService.present('Punch out successfully', 1000, 'success');
      await this.haptic.success();
    } catch (error) {
    } finally {
      await Promise.all([
        this.getCheckInData(),
        this.getAttendanceLogByAttendanceType(),
      ]);
      this.resetPunchState();
      this.isSubmitting = false;
      await this.loadingService.hide();
    }
  };

  getAttendanceLogByAttendanceType = async () => {
    try {
      let logs: any[] = [];
      const targetEmployeeRef = this.isAdmin
        ? this.selectedEmployeeRef
        : this.employeeRef;
      if (!targetEmployeeRef) {
        this.filteredWeeklyAttendanceLogs = [];
        return;
      }

      const strCurrentDateTime =
        await CurrentDateTimeRequest.GetCurrentDateTime();
      const today = strCurrentDateTime.substring(0, 10);

      if (
        this.selectedAttendanceLogType === AttendanceLogType.TodaysAttendanceLog
      ) {
        const allLogs =
          await AttendanceLogs.FetchEntireListByCompanyRefAndAttendanceLogTypeAndEmployee(
            this.companyRef,
            AttendanceLogType.WeeklyAttendanceLog,
            targetEmployeeRef,
            async (errMsg) =>
              this.toastService.present(`Error ${errMsg}`, 1000, 'danger')
          );
        logs = allLogs.filter(
          (log) => log.p.TransDateTime?.substring(0, 10) === today
        );
      } else if (
        this.selectedAttendanceLogType === AttendanceLogType.WeeklyAttendanceLog
      ) {
        logs =
          await AttendanceLogs.FetchEntireListByCompanyRefAndAttendanceLogTypeAndEmployee(
            this.companyRef,
            this.selectedAttendanceLogType,
            targetEmployeeRef,
            async (errMsg) =>
              this.toastService.present(`Error ${errMsg}`, 1000, 'danger')
          );
      } else if (
        this.selectedAttendanceLogType ===
        AttendanceLogType.MonthlyAttendanceLog
      ) {
        logs =
          await AttendanceLogs.FetchEntireListByCompanyRefAndAttendanceLogTypeAndMonth(
            this.companyRef,
            this.selectedAttendanceLogType,
            this.selectedMonth + 1,
            targetEmployeeRef,
            async (errMsg) =>
              this.toastService.present(`Error ${errMsg}`, 1000, 'danger')
          );
      }

      this.weeklyAttendanceLogs = logs;
      this.filteredWeeklyAttendanceLogs = logs;
    } catch (error) {}
  };

  private resetPunchState = () => {
    this.AttendanceLocationTypeName = '';
    this.selectedAttendanceLocationType = [];
    this.AttendanceLocationTypeRef = 0;
    this.SiteName = '';
    this.selectedSite = [];
    this.capturedSelfPhoto = null;
    this.rawCapturedSelfPhoto = null;
    this.capturedWorkLocationPhoto = null;
    this.rawCapturedWorkLocationPhoto = null;
  };

  selectAttendanceLocationBottomsheet = async () => {
    const options = this.attendanceLocationTypeList.map((item) => ({
      p: item,
    }));
    const selected = await this.bottomsheetMobileAppService.openSelectModal(
      options,
      this.selectedAttendanceLocationType,
      false,
      'Select Location Type',
      1
    );
    if (selected) {
      this.selectedAttendanceLocationType = selected;
      this.AttendanceLocationTypeName = selected[0].p.Name;
      this.AttendanceLocationTypeRef = selected[0].p.Ref;
    }
  };

  selectSiteBottomsheet = async () => {
    const selected = await this.bottomsheetMobileAppService.openSelectModal(
      this.siteList,
      this.selectedSite,
      false,
      'Select Site',
      1
    );
    if (selected) {
      this.selectedSite = selected;
      this.SiteName = selected[0].p.Name;
    }
  };
}
