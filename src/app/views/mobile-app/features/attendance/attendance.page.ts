import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AttendanceLocationType, AttendanceLogType, DomainEnums, LeaveRequestType } from 'src/app/classes/domain/domainenums/domainenums';
import { AttendanceLog, AttendanceLogProps } from 'src/app/classes/domain/entities/mobile-app/attendance-management/attendancelog';
import { AttendanceLogs } from 'src/app/classes/domain/entities/website/HR_and_Payroll/attendancelogs/attendancelogs';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { FileTransferObject } from 'src/app/classes/infrastructure/filetransferobject';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BottomsheetMobileAppService } from 'src/app/services/bottomsheet-mobile-app.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { Utils } from 'src/app/services/utils.service';
import { ToastService } from '../../core/toast.service';
import { HapticService } from '../../core/haptic.service';
import { AlertService } from '../../core/alert.service';
import { LoadingService } from '../../core/loading.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
  standalone: false
})
export class AttendancePage implements OnInit {

  // State and UI flags
  punchModalOpen = false;
  // isLoading = false;
  isSubmitting = false;

  // Data fields
  currentDateTime: string = "";
  checkInTime: string = "";
  checkOutTime: string = "";
  DateValue: string = "";
  // capturedBeforePhoto: string | null = null;
  // capturedAfterPhoto: string | null = null;
  capturedSelfPhoto: string | null | undefined = null;
  rawCapturedSelfPhoto: string | null | undefined = null;
  capturedWorkLocationPhoto: string | null | undefined = null;
  rawCapturedWorkLocationPhoto: string | null | undefined = null;
  isOnLeave: boolean = false;
  isCheckInEnabled: boolean = false;
  bothButtonsEnabled: boolean = true;

  // Attendance and site data
  attendanceLog: AttendanceLog = AttendanceLog.CreateNewInstance();
  siteList: Site[] = [];
  selectedSite: Site[] = [];
  selectedAttendanceLocationType: any[] = [];
  SiteName: string = "";
  filteredWeeklyAttendanceLogs: AttendanceLogs[] = [];
  weeklyAttendanceLogs: AttendanceLogs[] = [];


  // Enums and Lists
  AttendanceLocationTypes = AttendanceLocationType;
  attendanceLocationTypeList = DomainEnums.AttendanceLocationTypeList();
  AttendanceLocationTypeName: string = '';
  readonly LeaveRequestTypeEnum = LeaveRequestType;
  gridItems = [
    { label: 'Salary Slip', icon: 'layers-outline', gridFunction: 100 },
    { label: 'Leave', icon: 'grid-outline', gridFunction: 200 },
    { label: 'Attendance', icon: 'bar-chart-outline', gridFunction: 300 },
  ];

  // Company and employee references
  employeeRef: number = 0;
  companyRef: number = 0;

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
    private loadingService: LoadingService
  ) { }

  async ngOnInit() {
    await this.loadAttendanceIfEmployeeExists();
  }
  ionViewWillEnter = async () => {
    await this.loadAttendanceIfEmployeeExists();
  }
  ngOnDestroy = () => {
    // cleanup logic if needed later
  }

  private loadAttendanceIfEmployeeExists = async () => {
    try {
      await this.loadingService.show();
      this.companyRef = Number(this.appStateManage.localStorage.getItem('SelectedCompanyRef'));
      this.employeeRef = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'));
      if (this.employeeRef > 0) {
        // Retrieve employee reference from storage (ensure proper type conversion)
        this.employeeRef = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'));

        // Get current date time and set state
        try {
          const strCurrentDateTime = await CurrentDateTimeRequest.GetCurrentDateTime();
          this.DateValue = strCurrentDateTime.substring(0, 10);
          this.currentDateTime = strCurrentDateTime;
        } catch (error) {
          this.toastService.present('Error obtaining current date/time', 1000, 'danger');
          await this.haptic.warning();
          // console.error('Error obtaining current date/time:', error);
        }

        // Load check-in data and weekly attendance logs
        await Promise.all([
          this.getCheckInData(),
          this.getWeekWiseAttendanceLogByAttendanceListType()
        ]);
      } else {
        this.toastService.present('Employee not selected', 1000, 'danger');
        await this.haptic.warning();
        // await this.uiUtils.showErrorToster('Employee not selected');
      }
    } catch (error) {

    } finally {
      await this.loadingService.hide();
    }
  }

  handleRefresh = async (event: CustomEvent) => {
    try {
      await this.loadingService.show();
      await this.getCheckInData(),
        await this.getWeekWiseAttendanceLogByAttendanceListType(),
        (event.target as HTMLIonRefresherElement).complete();
    } catch (error) {

    } finally {
      await this.loadingService.hide();
    }
  }

  getCheckInData = async () => {
    try {
      // await this.loadingService.show();
      this.isOnLeave = false;
      this.checkInTime = '';
      this.checkOutTime = '';
      this.attendanceLog = AttendanceLog.CreateNewInstance();

      const tranDate = this.dtu.ConvertStringDateToFullFormat(this.DateValue);
      // const companyRef = this.companyState.getCurrentCompanyRef(); 
      // console.log('employeeRef, companyRef, tranDate :', this.employeeRef, companyRef, tranDate);

      const lst = await AttendanceLog.FetchEntireListByCompanyRef(
        this.employeeRef,
        this.companyRef,
        tranDate,
        async errMsg => {
          this.toastService.present('Error ' + errMsg, 1000, 'danger'),
            await this.haptic.error()
        }
      );
      console.log('lst :', lst, this.employeeRef,
        this.companyRef,
        tranDate,);

      if (!lst || lst.length === 0) {
        // this.bothButtonsEnabled = false;
        this.isCheckInEnabled = true;
        this.bothButtonsEnabled = true;
        // this.toastService.present('Error Unable to get attendance data', 1000, 'danger');
        // await this.haptic.warning();
        return;
      }

      // const checkInData = lst as AttendanceLogProps[];
      const checkInData: AttendanceLogProps[] = lst.map(log => log.p);
      console.log('lst :', lst);
      console.log('checkInData :', checkInData);
      const pendingCheckIn = checkInData.find(e => !e.CheckOutTime);
      const completedCheckIn = checkInData.find(e => e.CheckOutTime);

      if (pendingCheckIn) {
        Object.assign(this.attendanceLog.p, pendingCheckIn);
      } else if (completedCheckIn) {
        Object.assign(this.attendanceLog.p, completedCheckIn);
      }

      this.isOnLeave = Boolean(this.attendanceLog.p.IsLeave);
      this.checkInTime = this.attendanceLog.p.CheckInTime || '';
      this.checkOutTime = this.attendanceLog.p.CheckOutTime || '';

      // Set button statuses based on attendanceLog properties
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
    } catch (error) {
      this.toastService.present('Error Unexpected error while fetching attendance.', 1000, 'danger');
      await this.haptic.error();
    } finally {
      // await this.loadingService.hide();
    }
  }


  formatDate(date: string | Date): string {
    return this.dateConversionService.formatDate(date);
  }

  gridItemsFunction = (id: number) => {
    switch (id) {
      case 100:
        this.getSalarySlip();
        break;
      case 200:
        this.requestLeave();
        break;
      case 300:
        this.viewAllAttendance();
        break;
      default:
        break;
    }
  }

  public selectAttendanceLocationBottomsheet = async () => {
    try {
      const options = this.attendanceLocationTypeList.map((item) => ({ p: item }));

      this.openSelectModal(options, this.selectedAttendanceLocationType, false, 'Select Location Type', 1, (selected) => {
        this.selectedAttendanceLocationType = selected;
        this.attendanceLog.p.AttendanceLocationType = selected[0].p.Ref;
        this.AttendanceLocationTypeName = selected[0].p.Name;
      });
    } catch (error) {

    }
  }

  public selectSiteBottomsheet = async () => {
    try {
      const options = this.siteList;
      // const options = this.attendanceLocationTypeList.map((item) => ({ p: item }));

      this.openSelectModal(options, this.selectedSite, false, 'Select Site', 1, (selected) => {
        this.selectedSite = selected;

        this.selectedSite = selected;
        this.SiteName = selected[0].p.Name;
      });
    } catch (error) {

    }
  }

  private openSelectModal = async (
    dataList: any[],
    selectedItems: any[],
    multiSelect: boolean,
    title: string,
    MaxSelection: number,
    updateCallback: (selected: any[]) => void
  ) => {
    const selected = await this.bottomsheetMobileAppService.openSelectModal(dataList, selectedItems, multiSelect, title, MaxSelection);
    if (selected) updateCallback(selected);
  }

  openPunchModal = async () => {
    if (this.isCheckInEnabled) {
      this.punchModalOpen = true;
    }
    try {
      this.siteList = await Site.FetchEntireListByCompanyRef(
        this.companyState.getCurrentCompanyRef(),
        async (errMsg: string) => {
          this.toastService.present('Error' + errMsg, 1000, 'danger');
          await this.haptic.error();
        }
      );
    } catch (error) {
      this.toastService.present('Error fetching site list:' + error, 1000, 'danger');
      await this.haptic.error();
    }
  }

  takePhoto = async (type: 'before' | 'after') => {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });

      const fileUri = image.path ?? image.webPath;

      if (type === 'before') {
        this.rawCapturedSelfPhoto = fileUri ?? null;
        this.capturedSelfPhoto = image.webPath ?? null;
      } else {
        this.rawCapturedWorkLocationPhoto = fileUri ?? null;
        this.capturedWorkLocationPhoto = image.webPath ?? null;
      }
    } catch (error) {
      this.toastService.present(`Error capturing ${type} photo:` + error, 1000, 'danger');
      await this.haptic.error();
      // console.error(`Error capturing ${type} photo:`, error);
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

      this.attendanceLog.p.IsCheckIn = true;
      this.attendanceLog.p.CompanyRef = this.companyState.getCurrentCompanyRef();
      this.attendanceLog.p.EmployeeRef = this.employeeRef;
      this.attendanceLog.p.HandleBy = 100;

      if (this.selectedSite.length > 0) {
        this.attendanceLog.p.SiteRef = this.selectedSite[0].p.Ref;
      }

      this.attendanceLog.p.TransDateTime = this.dtu.ConvertStringDateToFullFormat(this.DateValue);
      const entityToSave = this.attendanceLog.GetEditableVersion();
      const entitiesToSave = [entityToSave];

      // const filesToUpload: FileTransferObject[] = [];

      // if (this.rawCapturedSelfPhoto) {
      //   const file = await this.uriToFile(this.rawCapturedSelfPhoto, "PunchIn_Self_Photo.jpg");
      //   filesToUpload.push(FileTransferObject.FromFile("AttendanceLogFile1", file, "PunchIn_Self_Photo"));
      // }

      // if (this.rawCapturedWorkLocationPhoto) {
      //   const file = await this.uriToFile(this.rawCapturedWorkLocationPhoto, "PunchIn_Work_location.jpg");
      //   filesToUpload.push(FileTransferObject.FromFile("AttendanceLogFile2", file, "PunchIn_Work_location"));
      // }
      const filesToUpload: FileTransferObject[] = [];
      if (this.rawCapturedSelfPhoto) {
        // Convert URI to File with .jpg extension
        const file = await this.uriToFile(this.rawCapturedSelfPhoto, "PunchIn_Self_Photo.jpg");
        // Send file with extension explicitly included
        filesToUpload.push(FileTransferObject.FromFile("AttendanceLogFile1", file, "PunchIn_Self_Photo.jpg"));
      }

      if (this.rawCapturedWorkLocationPhoto) {
        const file = await this.uriToFile(this.rawCapturedWorkLocationPhoto, "PunchIn_Work_location.jpg");
        filesToUpload.push(FileTransferObject.FromFile("AttendanceLogFile2", file, "PunchIn_Work_location.jpg"));
      }

      const tr = await this.utils.SavePersistableEntities(entitiesToSave, filesToUpload);

      if (!tr.Successful) {
        // await this.uiUtils.showErrorMessage('Error', tr.Message);
        this.toastService.present(`Error ${tr.Message}`, 1000, 'danger');
        await this.haptic.error();
        return;
      }

      // await this.uiUtils.showSuccessToster('Punch in successfully!');
      this.toastService.present(`Punch in successfully!`, 1000, 'success');
      await this.haptic.success();

      // Reset state
      this.attendanceLog = AttendanceLog.CreateNewInstance();
      this.capturedSelfPhoto = null;
      this.capturedWorkLocationPhoto = null;

      await Promise.all([
        this.getCheckInData(),
        this.getWeekWiseAttendanceLogByAttendanceListType()
      ]);
    } catch (error) {
      // console.error('Error in submitPunchIn:', error);
      this.toastService.present(`Error ${error}`, 1000, 'danger');
      await this.haptic.error();
    } finally {
      this.isSubmitting = false;
      this.punchModalOpen = false;
      await this.loadingService.hide();
    }
  }

  
  submitPunchOut = async () => {
    try {
      debugger
      await this.loadingService.show();
      this.attendanceLog.p.IsCheckIn = false;
      this.attendanceLog.p.CompanyRef = this.companyRef;
      this.attendanceLog.p.EmployeeRef = this.employeeRef;
      this.attendanceLog.p.HandleBy = 100;
      // Convert date to full format
      this.attendanceLog.p.TransDateTime = this.dtu.ConvertStringDateToFullFormat(this.DateValue);
      const entityToSave = this.attendanceLog.GetEditableVersion();
      const entitiesToSave = [entityToSave];

      const tr = await this.utils.SavePersistableEntities(entitiesToSave);
      if (!tr.Successful) {
        this.toastService.present(`Error ${tr.Message}`, 1000, 'danger');
        console.log('tr.Message :', tr.Message);
        await this.haptic.error();
        return;
      }
      this.toastService.present(`Punch out successfully!`, 1000, 'success');
      await this.haptic.success();
      // Reset and refresh data
      this.attendanceLog = AttendanceLog.CreateNewInstance();
      await Promise.all([
        this.getCheckInData(),
        this.getWeekWiseAttendanceLogByAttendanceListType()
      ]);
    } catch (error) {
      // console.error('Error in submitPunchOut:', error);
    } finally {
      this.isSubmitting = false;
      await this.loadingService.hide();
    }
  }

  getWeekWiseAttendanceLogByAttendanceListType = async () => {
    try {
      // await this.loadingService.show();
      const logs = await AttendanceLogs.FetchEntireListByCompanyRefAndAttendanceLogTypeAndEmployee(
        this.companyRef,
        AttendanceLogType.WeeklyAttendanceLog, this.employeeRef,
        async (errMsg: string) => {
          this.toastService.present(`Error ${errMsg}`, 1000, 'success');
          await this.haptic.error();
        }
      );
      this.weeklyAttendanceLogs = logs;
      // Optionally, apply further filtering before assigning to filteredWeeklyAttendanceLogs
      this.filteredWeeklyAttendanceLogs = logs;
      console.log('filteredWeeklyAttendanceLogs :', this.filteredWeeklyAttendanceLogs);
    } catch (error) {
      // console.error('Error fetching weekly attendance logs:', error);
    } finally {
      // await this.loadingService.hide();
    }
  }

  getSalarySlip = () => {
    this.router.navigate(['/mobileapp/tabs/attendance/salary-slip']);
  }

  requestLeave = () => {
    this.router.navigate(['/mobileapp/tabs/attendance/leave']);
  }

  // viewAllPresentEmployee(): void {
  //   this.router.navigate(['/app_homepage/tabs/attendance-management/present-employee']);
  // }

  viewAllAttendance = () => {
    this.router.navigate(['/mobileapp/tabs/attendance/attendance-details']);
  }

}
