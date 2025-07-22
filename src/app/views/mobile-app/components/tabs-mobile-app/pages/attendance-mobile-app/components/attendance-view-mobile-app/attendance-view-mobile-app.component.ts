import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SegmentValue } from '@ionic/angular';
import { AttendanceLocationType, AttendanceLogType, DomainEnums, LeaveRequestType } from 'src/app/classes/domain/domainenums/domainenums';
import { AttendanceLog, AttendanceLogProps } from 'src/app/classes/domain/entities/mobile-app/attendance-management/attendancelog';
import { AttendanceLogs } from 'src/app/classes/domain/entities/website/HR_and_Payroll/attendancelogs/attendancelogs';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BottomsheetMobileAppService } from 'src/app/services/bottomsheet-mobile-app.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { Utils } from 'src/app/services/utils.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AttendanceLogCheckInCustomProcess } from 'src/app/classes/domain/entities/mobile-app/attendance-management/attendancelogcheckincustomprocess';
import { FileTransferObject } from 'src/app/classes/infrastructure/filetransferobject';
import { AttendanceLogCheckOutCustomProcess } from 'src/app/classes/domain/entities/mobile-app/attendance-management/attendancelogcheckoutcustomprocess';
import { LocationMobileAppService } from 'src/app/views/mobile-app/components/core/location-mobile-app.service';


@Component({
  selector: 'app-attendance-view-mobile-app',
  templateUrl: './attendance-view-mobile-app.component.html',
  styleUrls: ['./attendance-view-mobile-app.component.scss'],
  standalone:false
})
export class AttendanceViewMobileAppComponent  implements OnInit {
  punchModalOpen = false;
  isSubmitting = false;
  disableTopCard = false;

  currentDateTime = '';
  checkInTime = '';
  checkOutTime = '';
  DateValue = '';

  capturedSelfPhoto: string | null = null;
  rawCapturedSelfPhoto: string | null = null;
  capturedWorkLocationPhoto: string | null = null;
  rawCapturedWorkLocationPhoto: string | null = null;

  isOnLeave = false;
  isCheckInEnabled = false;
  bothButtonsEnabled = true;

  attendanceLog = AttendanceLog.CreateNewInstance();

  siteList: Site[] = [];
  selectedSite: Site[] = [];
  selectedAttendanceLocationType: any[] = [];
  SiteName = '';
  AttendanceLocationTypeName = '';
  AttendanceLocationTypeRef: number = 0;

  weeklyAttendanceLogs: AttendanceLogs[] = [];
  filteredWeeklyAttendanceLogs: AttendanceLogs[] = [];

  AttendanceLocationTypes = AttendanceLocationType;
  attendanceLocationTypeList = DomainEnums.AttendanceLocationTypeList();
  AttendanceLogTypeList = DomainEnums.AttendanceLogTypeMobileAppList();
  readonly LeaveRequestTypeEnum = LeaveRequestType;

  selectedIndex = 0;

  selectItem(index: number) {
    this.selectedIndex = index;
  }

  gridItems = [
    { icon: 'assets/icons/salary_slip_request_mobile_app.png', label: 'Salary Slip', routerPath: '/mobile-app/tabs/attendance/salary-slip-request' },
    { icon: 'assets/icons/leave_requests_mobile_app.png', label: 'Leave', routerPath: '/mobile-app/tabs/attendance/leave-request' },
    { icon: 'assets/icons/attendance _mobile_app.png', label: 'Attendance', routerPath: '/mobile-app/tabs/attendance/all-attendance' }
  ];

  selectedAttendanceLogType: number = AttendanceLogType.TodaysAttendanceLog;
  employeeRef: number = 0;
  companyRef: number = 0;
  selectedMonth: number = 0;
  months: any[] = [];

  constructor(
    private router: Router,
    private companyState: CompanyStateManagement,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private dtu: DTU,
    private payloadPacketFacade: PayloadPacketFacade,
    private serverCommunicator: ServerCommunicatorService,
    private dateConversionService: DateconversionService,
    private bottomsheetMobileAppService: BottomsheetMobileAppService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    public loadingService: LoadingService,
    public locationMobileAppService:LocationMobileAppService,
  ) { }

  ngOnInit = async () => {
    // await this.loadAttendanceIfEmployeeExists();
  }

  ionViewWillEnter = async () => {
    await this.loadAttendanceIfEmployeeExists();
  };

  private loadAttendanceIfEmployeeExists = async () => {
    try {
      await this.loadingService.show();
      this.disableTopCard = (await this.appStateManage.localStorage.getItem('IsDefaultUser')) === '1';
      this.companyRef = Number(this.appStateManage.localStorage.getItem('SelectedCompanyRef'));
      this.employeeRef = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'));
      await this.fetchAttendanceByMonth(new Date().getMonth());

      if (this.AttendanceLogTypeList?.length > 0) {
        this.selectedAttendanceLogType = this.AttendanceLogTypeList[0].Ref;
        this.onAttendanceLogTypeChange();
      }

      if (!this.employeeRef) {
        this.toastService.present('Employee not selected', 1000, 'danger');
        await this.haptic.warning();
        return;
      }

      try {
        const strCurrentDateTime = await CurrentDateTimeRequest.GetCurrentDateTime();
        this.DateValue = strCurrentDateTime.substring(0, 10);
        this.currentDateTime = strCurrentDateTime;
      } catch (error) {
        this.toastService.present('Error obtaining current date/time', 1000, 'danger');
        await this.haptic.warning();
      }

      await Promise.all([
        this.getCheckInData(),
        this.getAttendanceLogByAttendanceType()
      ]);
    } catch (error) {
      this.toastService.present('Unexpected error while loading attendance.', 1000, 'danger');
    } finally {
      await this.loadingService.hide();
    }
  }

  handleRefresh = async (event: CustomEvent) => {
    try {
      await this.getCheckInData();
      await this.getAttendanceLogByAttendanceType();
    } finally {
      (event.target as HTMLIonRefresherElement).complete();
    }
  };

  onAttendanceLogTypeChange = async () => {
    console.log('this.selectedAttendanceLogType :', this.selectedAttendanceLogType, this.AttendanceLogTypeList);
    const selected = this.AttendanceLogTypeList.find(w => w.Ref === this.selectedAttendanceLogType);
    console.log('Selected onAttendanceLogTypeChange:', selected?.Name);
    await this.getAttendanceLogByAttendanceType();
  }

  async fetchAttendanceByMonth(value: SegmentValue | undefined): Promise<void> {
    try {
      const SelectedMonth = Number(value);
      if (isNaN(SelectedMonth)) return;
      this.selectedMonth = SelectedMonth;
      console.log('selectedMonth :', SelectedMonth);
      // await this.fetchMonthlyLogs();
    } catch (error) {
      // this.handleError(error, 'Fetching attendance for selected month');
    }
  }

  getCheckInData = async () => {
    try {
      this.attendanceLog = AttendanceLog.CreateNewInstance();
      this.checkInTime = '';
      this.checkOutTime = '';
      this.isOnLeave = false;

      const tranDate = this.dtu.ConvertStringDateToFullFormat(this.DateValue);
      const lst = await AttendanceLog.FetchEntireListByCompanyRef(
        this.employeeRef,
        this.companyRef,
        tranDate,
        async errMsg => {
          this.toastService.present('Error ' + errMsg, 1000, 'danger');
          await this.haptic.error();
        }
      );

      console.log('Attendance List:', lst);

      if (!lst || lst.length === 0) {
        this.isCheckInEnabled = true;
        this.bothButtonsEnabled = true;
        return;
      }

      const checkInData: AttendanceLogProps[] = lst.map(log => log.p);
      const pendingCheckIn = checkInData.find(e => !e.CheckOutTime);
      const completedCheckIn = checkInData.find(e => e.CheckOutTime);

      // Assign latest attendance data to attendanceLog
      Object.assign(this.attendanceLog.p, pendingCheckIn || completedCheckIn || {});

      // Update state from assigned log data
      const { FirstCheckInTime, CheckInTime, CheckOutTime } = this.attendanceLog.p;

      if (!FirstCheckInTime && !CheckInTime && !CheckOutTime) {
        this.isCheckInEnabled = true;
        this.bothButtonsEnabled = true;
      } else if (CheckInTime && !CheckOutTime) {
        this.isCheckInEnabled = false;
        this.bothButtonsEnabled = true;
      } else if (CheckInTime && CheckOutTime) {
        this.isCheckInEnabled = true;
        this.bothButtonsEnabled = true;
      } else {
        this.isCheckInEnabled = false;
        this.bothButtonsEnabled = false;
      }

      // Optionally use `AttendanceLogCheckInOut` if it contains relevant runtime data
      this.checkInTime = this.attendanceLog.p.CheckInTime || '';
      this.checkOutTime = this.attendanceLog.p.CheckOutTime || '';
      this.isOnLeave = Boolean(this.attendanceLog.p.IsLeave);
    } catch (error) {
      this.toastService.present('Unexpected error while fetching attendance.', 1000, 'danger');
      await this.haptic.error();
    }
  };



  formatDate(date: string | Date): string {
    return this.dateConversionService.formatDate(date);
  }

  selectAttendanceLocationBottomsheet = async () => {
    const options = this.attendanceLocationTypeList.map(item => ({ p: item }));
    const selected = await this.bottomsheetMobileAppService.openSelectModal(options, this.selectedAttendanceLocationType, false, 'Select Location Type', 1);
    if (selected) {
      this.selectedAttendanceLocationType = selected;
      this.AttendanceLocationTypeName = selected[0].p.Name;
      this.AttendanceLocationTypeRef = selected[0].p.Ref;
    }
  }

  selectSiteBottomsheet = async () => {
    const selected = await this.bottomsheetMobileAppService.openSelectModal(this.siteList, this.selectedSite, false, 'Select Site', 1);
    if (selected) {
      this.selectedSite = selected;
      this.SiteName = selected[0].p.Name;
    }
  }

  openPunchModal = async () => {
    if (!this.isCheckInEnabled) return;
    this.punchModalOpen = true;

    try {
      this.siteList = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
        this.toastService.present('Error ' + errMsg, 1000, 'danger');
        await this.haptic.error();
      });
      const location = await this.locationMobileAppService.getCurrentCoordinates();
      console.log(location);
    } catch (error) {
      this.toastService.present('Error fetching site list', 1000, 'danger');
      await this.haptic.error();
    }
  }

  takePhoto = async (type: 'before' | 'after') => {
    try {
      const image = await Camera.getPhoto({ quality: 80, allowEditing: false, resultType: CameraResultType.Uri, source: CameraSource.Camera });
      const uri = image.path ?? image.webPath;

      if (type === 'before') {
        this.rawCapturedSelfPhoto = uri ?? null;
        this.capturedSelfPhoto = image.webPath ?? null;
      } else {
        this.rawCapturedWorkLocationPhoto = uri ?? null;
        this.capturedWorkLocationPhoto = image.webPath ?? null;
      }
    } catch (error) {
      this.toastService.present(`Error capturing ${type} photo`, 1000, 'danger');
      await this.haptic.error();
    }
  }

  uriToFile = async (uri: string, fileName: string, mimeType = 'image/jpeg') => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new File([blob], fileName, { type: mimeType });
  }

  submitPunchIn = async () => {
    try {
      await this.loadingService.show();
      this.isSubmitting = true;
      if (!this.employeeRef) {
        this.toastService.present('Employee not selected', 1000, 'warning');
        await this.haptic.warning();
        return;
      }
      if (!this.companyRef) {
        this.toastService.present('Company not selected', 1000, 'warning');
        await this.haptic.warning();
        return;
      }
      if (this.selectedAttendanceLocationType.length === 0) {
        this.toastService.present('Location Type not selected', 1000, 'warning');
        await this.haptic.warning();
        return;
      }

      const selectedTypeRef = this.selectedAttendanceLocationType[0]?.p?.Ref;
      if (selectedTypeRef === this.AttendanceLocationTypes.Site && this.selectedSite.length === 0) {
        this.toastService.present('Site not selected', 1000, 'warning');
        await this.haptic.warning();
        return;
      }
      // if (!this.rawCapturedSelfPhoto) {
      //   this.toastService.present('Self Photo not uploaded', 1000, 'warning');
      //   await this.haptic.warning();
      //   return;
      // }
      // if (!this.rawCapturedWorkLocationPhoto) {
      //   this.toastService.present('Work Location Photo not uploaded', 1000, 'warning');
      //   await this.haptic.warning();
      //   return;
      // }
      const request = new AttendanceLogCheckInCustomProcess();
      Object.assign(request, {
        IsCheckIn: true,
        CompanyRef: this.companyRef,
        EmployeeRef: this.employeeRef,
        SiteRef: this.selectedSite[0]?.p?.Ref
          ? this.selectedSite[0].p.Ref
          : 0,
        AttendanceLocationType: Number(this.selectedAttendanceLocationType[0].p.Ref) || 0
      });

      const filesToUpload: FileTransferObject[] = [];
      if (this.rawCapturedSelfPhoto) {
        const file = await this.uriToFile(this.rawCapturedSelfPhoto, 'PunchIn_Self_Photo.jpg');
        filesToUpload.push(FileTransferObject.FromFile('AttendanceLogFile1', file, 'PunchIn_Self_Photo.jpg'));
      }

      if (this.rawCapturedWorkLocationPhoto) {
        const file = await this.uriToFile(this.rawCapturedWorkLocationPhoto, 'PunchIn_Work_location.jpg');
        filesToUpload.push(FileTransferObject.FromFile('AttendanceLogFile2', file, 'PunchIn_Work_location.jpg'));
      }
      const td = request.FormulateTransportData();
      const pkt = this.payloadPacketFacade.CreateNewPayloadPacket2(td);
      const tr = await this.serverCommunicator.sendHttpRequest(pkt, 'acceptrequest', filesToUpload);

      if (!tr.Successful) {
        this.toastService.present(`Error ${tr.Message}`, 1000, 'danger');
        await this.haptic.error();
        return;
      }

      this.toastService.present('Punch in successfully', 1000, 'success');
      await this.haptic.success();
    } catch (error) {
    // console.log('error :', error);
    //   this.toastService.present('Error during punch in', 1000, 'danger');
    //   await this.haptic.error();
    } finally {
      this.punchModalOpen = false;
      this.resetPunchState();
      this.isSubmitting = false;
      await Promise.all([
        this.getCheckInData(),
        this.getAttendanceLogByAttendanceType()
      ]);
      await this.loadingService.hide();
    }
  }

  submitPunchOut = async () => {
    try {
      await this.loadingService.show();
      this.isSubmitting = true;

      const request = new AttendanceLogCheckOutCustomProcess();
      Object.assign(request, {
        IsCheckIn: false,
        CompanyRef: this.companyRef,
        EmployeeRef: this.employeeRef
      });

      const td = request.FormulateTransportData();
      const pkt = this.payloadPacketFacade.CreateNewPayloadPacket2(td);
      const tr = await this.serverCommunicator.sendHttpRequest(pkt);

      if (!tr.Successful) {
        this.toastService.present(`Error ${tr.Message}`, 1000, 'danger');
        await this.haptic.error();
        return;
      }

      this.toastService.present('Punch out successfully', 1000, 'success');
      await this.haptic.success();

    } catch (error) {
      // this.toastService.present('Error during punch out', 1000, 'danger');
      // await this.haptic.error();
    } finally {
      await Promise.all([
        this.getCheckInData(),
        this.getAttendanceLogByAttendanceType()
      ]);
      this.resetPunchState();
      this.isSubmitting = false;
      await this.loadingService.hide();
    }
  }

  getAttendanceLogByAttendanceType = async () => {
    try {
      let logs: any[] = [];

      if (this.selectedAttendanceLogType === AttendanceLogType.TodaysAttendanceLog) {
        const allLogs = await AttendanceLogs.FetchEntireListByCompanyRefAndAttendanceLogTypeAndEmployee(
          this.companyRef,
          AttendanceLogType.WeeklyAttendanceLog, // using weekly to fetch today from it
          this.employeeRef,
          async errMsg => {
            this.toastService.present(`Error ${errMsg}`, 1000, 'danger');
            await this.haptic.error();
          }
        );

        const strCurrentDateTime = await CurrentDateTimeRequest.GetCurrentDateTime();
        const today = strCurrentDateTime.substring(0, 10); // e.g. '2025-07-09'

        console.log('today :', today);
        console.log('allLogs :', allLogs);

        logs = allLogs.filter(log => {
          const transDate = log.p.TransDateTime?.substring(0, 10);
          console.log('transDate:', transDate);
          return transDate === today;
        });

        console.log('filtered today logs :', logs);
      }

      else if (this.selectedAttendanceLogType === AttendanceLogType.WeeklyAttendanceLog) {
        logs = await AttendanceLogs.FetchEntireListByCompanyRefAndAttendanceLogTypeAndEmployee(
          this.companyRef,
          this.selectedAttendanceLogType,
          this.employeeRef,
          async errMsg => {
            this.toastService.present(`Error ${errMsg}`, 1000, 'danger');
            await this.haptic.error();
          }
        );
      }

      else if (this.selectedAttendanceLogType === AttendanceLogType.MonthlyAttendanceLog) {
        logs = await AttendanceLogs.FetchEntireListByCompanyRefAndAttendanceLogTypeAndMonth(
          this.companyRef,
          this.selectedAttendanceLogType,
          this.selectedMonth + 1, // Month is 0-indexed
          this.employeeRef,
          async errMsg => {
            this.toastService.present(`Error ${errMsg}`, 1000, 'danger');
            await this.haptic.error();
          }
        );
      }

      console.log('Final logs:', logs);

      this.weeklyAttendanceLogs = logs;
      this.filteredWeeklyAttendanceLogs = logs;
    } catch (error) {
      // this.toastService.present('Error fetching attendance logs', 1000, 'danger');
      // await this.haptic.error();
    }
  };


  private resetPunchState = () => {
    this.AttendanceLocationTypeName = '';
    this.selectedAttendanceLocationType = [];
    this.AttendanceLocationTypeRef = 0
    this.SiteName = '';
    this.selectedSite = [];
    this.capturedSelfPhoto = null;
    this.rawCapturedSelfPhoto = null;
    this.capturedWorkLocationPhoto = null;
    this.rawCapturedWorkLocationPhoto = null;
  }
}
