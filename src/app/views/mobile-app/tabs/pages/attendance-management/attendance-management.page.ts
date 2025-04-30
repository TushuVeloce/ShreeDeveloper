import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AttendenceLocationType,
  AttendenceLogType,
  DomainEnums,
  LeaveRequestType
} from 'src/app/classes/domain/domainenums/domainenums';
import { AttendanceLog, AttendanceLogProps } from 'src/app/classes/domain/entities/mobile-app/attendance-management/attendancelog';
import { AttendanceLogCheckInCustomRequest } from 'src/app/classes/domain/entities/mobile-app/attendance-management/attendancelogcheckincustomrequest';
import { AttendanceLogs } from 'src/app/classes/domain/entities/website/HR_and_Payroll/attendancelogs/attendancelogs';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-attendance-management',
  templateUrl: './attendance-management.page.html',
  styleUrls: ['./attendance-management.page.scss'],
  standalone:false
})
export class AttendanceManagementPage implements OnInit {
  // State and UI flags
  punchModalOpen = false;
  isLoading = false;
  isSubmitting = false;

  // Data fields
  currentDateTime: string = "";
  checkInTime: string = "";
  checkOutTime: string = "";
  DateValue: string = "";
  capturedBeforePhoto: string | null = null;
  capturedAfterPhoto: string | null = null;
  isOnLeave: boolean = false;
  isCheckInEnabled: boolean = false;
  bothButtonsEnabled: boolean = true;

  // Attendance and site data
  attendanceLog: AttendanceLog = AttendanceLog.CreateNewInstance();
  siteList: Site[] = [];
  selectedSite: Site[] = [];
  filteredWeeklyAttendanceLogs: any[] = [];
  weeklyAttendanceLogs: any[] = [];

  
  // Enums and Lists
  AttendanceLocationTypes = AttendenceLocationType;
  attendanceLocationTypeList = DomainEnums.AttendenceLocationTypeList(true, '--Select--');
  readonly LeaveRequestTypeEnum = LeaveRequestType;
  gridItems = [
    { label: 'Salary Slip', icon: 'layers-outline', gridFunction: 100 },
    { label: 'Leave', icon: 'grid-outline', gridFunction: 200 },
    { label: 'View All', icon: 'bar-chart-outline', gridFunction: 300 },
  ];

  // Company and employee references
  employeeRef: number = 0;

  constructor(
    private router: Router,
    private companyState: CompanyStateManagement,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private dtu: DTU,
    private payloadPacketFacade: PayloadPacketFacade,
    private serverCommunicator: ServerCommunicatorService,
    private dateConversionService: DateconversionService
  ) { }

  async ngOnInit() {
    // Retrieve employee reference from storage (ensure proper type conversion)
    this.employeeRef = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'));

    // Get current date time and set state
    try {
      const strCurrentDateTime = await CurrentDateTimeRequest.GetCurrentDateTime();
      this.DateValue = strCurrentDateTime.substring(0, 10);
      this.currentDateTime = strCurrentDateTime;
    } catch (error) {
      console.error('Error obtaining current date/time:', error);
    }

    // Load check-in data and weekly attendance logs
    await Promise.all([
      this.getCheckInData(),
      this.getWeekWiseAttendanceLogByAttendanceListType()
    ]);
  }

  formatDate(date: string | Date): string {
    return this.dateConversionService.formatDate(date);
  }

  gridItemsFunction(id: number): void {
    switch (id) {
      case 100: 
        this.getSalarySlip();
        break;
      case 200:
        this.requestLeave();
        break;
      case 300:
        this.viewAllPresentEmployee();
        break;
      default:
        break;
    }
  }

  async handleRefresh(event: CustomEvent): Promise<void> {
    setTimeout(async () => {
      await Promise.all([
        this.getCheckInData(),
        this.getWeekWiseAttendanceLogByAttendanceListType()
      ]);
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }

  async getCheckInData(): Promise<void> {
    this.isLoading = true;
    try {
      this.isOnLeave = false;
      this.checkInTime ='';
      this.checkOutTime = '';
      this.attendanceLog = AttendanceLog.CreateNewInstance();
      
      const tranDate = this.dtu.ConvertStringDateToFullFormat(this.DateValue);
      const req = new AttendanceLogCheckInCustomRequest();
      req.TransDateTime = tranDate;
      // Instead of calling companyRef as a function, use the proper method from the service
      req.CompanyRef = this.companyState.getCurrentCompanyRef();
      req.EmployeeRef = this.employeeRef;

      const transportData = req.FormulateTransportData();
      const payload = this.payloadPacketFacade.CreateNewPayloadPacket2(transportData);
      const response = await this.serverCommunicator.sendHttpRequest(payload);

      if (!response.Successful) {
        this.bothButtonsEnabled = false;
        await this.uiUtils.showErrorMessage('Error', response.Message);
        return;
      }

      const tdResult = JSON.parse(response.Tag) as TransportData;
      const res = AttendanceLogCheckInCustomRequest.FromTransportData(tdResult);
      console.log('Check-in response:', res);

      if (res.Data.length > 0) {
        const checkInData: AttendanceLogProps[] = res.Data as AttendanceLogProps[];
        const pendingCheckIn = checkInData.filter(e => e.CheckOutTime === '');
        if (pendingCheckIn.length > 0) {
          Object.assign(this.attendanceLog.p, pendingCheckIn[0]);
        } else {
          const completedCheckIns = checkInData.filter(e => e.CheckOutTime !== '');
          if (completedCheckIns.length > 0) {
            Object.assign(this.attendanceLog.p, completedCheckIns[0]);
          }
        }
        this.isOnLeave = Boolean(this.attendanceLog.p.IsLeave);
        this.checkInTime = this.attendanceLog.p.CheckInTime;
        this.checkOutTime = this.attendanceLog.p.CheckOutTime;
      }
      // Set button statuses based on attendanceLog properties
      if (!this.attendanceLog.p.FirstCheckInTime && !this.attendanceLog.p.CheckInTime && !this.attendanceLog.p.CheckOutTime) {
        this.isCheckInEnabled = true;
        this.bothButtonsEnabled = true;
        console.log("call condition 1");
        
      } else if (this.attendanceLog.p.CheckInTime && !this.attendanceLog.p.CheckOutTime) {
        this.isCheckInEnabled = false;
        this.bothButtonsEnabled = true;
        console.log("call condition 2");

      } else if (this.attendanceLog.p.CheckInTime && this.attendanceLog.p.CheckOutTime) {
        this.isCheckInEnabled = true;
        this.bothButtonsEnabled = true;
        console.log("call condition 3");

      } else {
        this.isCheckInEnabled = false;
        this.bothButtonsEnabled = false;
        console.log("call condition 4");

      }
    } catch (error) {
      console.error('Error in getCheckInData:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async openPunchModal(): Promise<void> {
    if (this.isCheckInEnabled) {
      this.punchModalOpen = true;
    }
    try {
      this.siteList = await Site.FetchEntireListByCompanyRef(
        this.companyState.getCurrentCompanyRef(),
        async (errMsg: string) => await this.uiUtils.showErrorMessage('Error', errMsg)
      );
    } catch (error) {
      console.error('Error fetching site list:', error);
    }
  }

  onSelectionChange(selected: Site[]): void {
    this.selectedSite = selected;
  }

  async submitPunchIn(): Promise<void> {
    this.isSubmitting = true;
    try {
      this.attendanceLog.p.IsCheckIn = true;
      this.attendanceLog.p.CompanyRef = this.companyState.getCurrentCompanyRef();
      this.attendanceLog.p.EmployeeRef = this.employeeRef;
      if (this.selectedSite.length > 0) {
        this.attendanceLog.p.SiteRef = this.selectedSite[0].p.Ref;
      }
      // Convert date to full format
      this.attendanceLog.p.TransDateTime = this.dtu.ConvertStringDateToFullFormat(this.DateValue);
      const entityToSave = this.attendanceLog.GetEditableVersion();
      const entitiesToSave = [entityToSave];
      console.log('entitiesToSave:', entitiesToSave);
      
      const tr = await this.utils.SavePersistableEntities(entitiesToSave);
      if (!tr.Successful) {
        await this.uiUtils.showErrorMessage('Error', tr.Message);
        return;
      }
      await this.uiUtils.showSuccessToster('Punch in successfully!');
      // Reset state and refresh data
      this.attendanceLog = AttendanceLog.CreateNewInstance();
      await Promise.all([
        this.getCheckInData(),
        this.getWeekWiseAttendanceLogByAttendanceListType()
      ]);
    } catch (error) {
      console.error('Error in submitPunchIn:', error);
    } finally {
      this.isSubmitting = false;
      this.punchModalOpen = false;
    }
  }

  async submitPunchOut(): Promise<void> {
    try {
      this.attendanceLog.p.IsCheckIn = false;
      this.attendanceLog.p.CompanyRef = this.companyState.getCurrentCompanyRef();
      this.attendanceLog.p.EmployeeRef = this.employeeRef;
      // Convert date to full format
      this.attendanceLog.p.TransDateTime = this.dtu.ConvertStringDateToFullFormat(this.DateValue);
      const entityToSave = this.attendanceLog.GetEditableVersion();
      const entitiesToSave = [entityToSave];
      console.log('entitiesToSave:', entitiesToSave);

      const tr = await this.utils.SavePersistableEntities(entitiesToSave);
      if (!tr.Successful) {
        await this.uiUtils.showErrorMessage('Error', tr.Message);
        return;
      }
      await this.uiUtils.showSuccessToster('Punch out successfully!');
      // Reset and refresh data
      this.attendanceLog = AttendanceLog.CreateNewInstance();
      await Promise.all([
        this.getCheckInData(),
        this.getWeekWiseAttendanceLogByAttendanceListType()
      ]);
    } catch (error) {
      console.error('Error in submitPunchOut:', error);
    } finally {
      this.isSubmitting = false;
    }
  }

  // Note: Actual photo capture code should be implemented per your requirements.
  async takePhoto(type: 'before' | 'after'): Promise<void> {
    try {
      // Implement camera functionality here.
      // For example, using Capacitor Camera plugin.
      // const image = await Camera.getPhoto({ ... });
      // this.capturedBeforePhoto = type === 'before' ? image.dataUrl : this.capturedBeforePhoto;
      // this.capturedAfterPhoto = type === 'after' ? image.dataUrl : this.capturedAfterPhoto;
    } catch (error) {
      console.error(`Error capturing ${type} photo:`, error);
    }
  }

  async getWeekWiseAttendanceLogByAttendanceListType(): Promise<void> {
    try {
      const logs = await AttendanceLogs.FetchEntireListByCompanyRefAndAttendanceLogType(
        this.companyState.getCurrentCompanyRef(),
        AttendenceLogType.WeeklyAttendanceLog,
        async (errMsg: string) => await this.uiUtils.showErrorMessage('Error', errMsg)
      );
      this.weeklyAttendanceLogs = logs;
      // Optionally, apply further filtering before assigning to filteredWeeklyAttendanceLogs
      this.filteredWeeklyAttendanceLogs = logs;

      console.log('Weekly Attendance Logs:', logs);
    } catch (error) {
      console.error('Error fetching weekly attendance logs:', error);
    }
  }

  getSalarySlip(): void {
    this.router.navigate(['/app_homepage/tabs/attendance-management/salary-slip']);
  }

  requestLeave(): void {
    this.router.navigate(['/app_homepage/tabs/attendance-management/leave-request']);
  }

  viewAllPresentEmployee(): void {
    this.router.navigate(['/app_homepage/tabs/attendance-management/present-employee']);
  }

  viewAllAttendance(): void {
    this.router.navigate(['/app_homepage/tabs/attendance-management/attendance-details']);
  }
}
