import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AttendenceLocationType, DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { AttendanceLog, AttendanceLogProps } from 'src/app/classes/domain/entities/mobile-app/attendance-management/attendancelog';
import { AttendanceLogCheckInCustomRequest } from 'src/app/classes/domain/entities/mobile-app/attendance-management/attendancelogcheckincustomrequest';
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
  standalone: false
})
export class AttendanceManagementPage implements OnInit {
  punchModalOpen = false;
  currentPunchType: string = 'in';
  isPunchInEnabled: boolean = false;
  isPunchOutEnabled: boolean = true;
  isCurrentTimeDate: string = "";
  isCheckInTime: string = "";
  isCheckOutTime: string = "";
  selectedLocation: string = '';
  totalHalfDays: number = 2;
  totalOvertime: string = '16';
  siteList: Site[] = [];
  selectedSite: Site[] = [];

  isCheckInEnabled: boolean = false;
  isSubmitting = false;

  capturedBeforePhoto: string | null = null;
  capturedAfterPhoto: string | null = null;
  isSaveDisabled: boolean = false;
  private IsCheckIn: boolean = false;
  isChecked: boolean = false;
  Date: string = "";
  DateWithTime: string | null = null;
  Entity: AttendanceLog = AttendanceLog.CreateNewInstance();
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  employeeRef = 0;
  AttendanceLocationTypes = AttendenceLocationType;
  
  AttendanceLocationTypeList = DomainEnums.AttendenceLocationTypeList(true, '--Select--');

  gridItems = [
    { label: 'Salary Slip', icon: 'layers-outline', gridFunction: 100 },
    { label: 'Leave', icon: 'grid-outline', gridFunction: 200 },
    { label: 'View All', icon: 'bar-chart-outline', gridFunction: 300 },
  ];

  recentAttendance = [
    { date: '30', day: 'TUE', clockIn: '09:00am', clockOut: '06:00pm', hours: '09hr 00min', isHalfDay: false },
    { date: '29', day: 'MON', clockIn: '09:10am', clockOut: '01:00pm', hours: '03hr 50min', isHalfDay: true },
    { date: '28', day: 'SUN', isWeekend: true, isHalfDay: false },
    { date: '27', day: 'SAT', isWeekend: true, isHalfDay: false },
    { date: '26', day: 'FRI', clockIn: '09:15am', clockOut: '06:20pm', hours: '09hr 05min', isHalfDay: false },
    { date: '25', day: 'THU', leave: 'Casual Leave', isHalfDay: false },
    { date: '24', day: 'WED', clockIn: '09:05am', clockOut: '06:00pm', hours: '08hr 55min', isHalfDay: false },
    { date: '23', day: 'TUE', clockIn: '09:30am', clockOut: '12:30pm', hours: '03hr 00min', isHalfDay: true },
    { date: '22', day: 'MON', clockIn: '09:10am', clockOut: '06:10pm', hours: '09hr 00min', isHalfDay: false },
    { date: '21', day: 'SUN', isWeekend: true, isHalfDay: false }
  ];

  constructor(
    private router: Router,
    private companystatemanagement: CompanyStateManagement,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private dtu: DTU,
    private payloadPacketFacade: PayloadPacketFacade,
    private serverCommunicator: ServerCommunicatorService,
    private dateconversionService: DateconversionService
  ) { }

  async ngOnInit() {
    this.employeeRef = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'));
    let strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
    this.Date = strCDT.substring(0, 10);
    this.isCurrentTimeDate = strCDT;
    await this.getCheckInData();
  }

  formatDate(date: string | Date): string {
    return this.dateconversionService.formatDate(date);
  }

  gridItemsFunction(id: number) {
    switch (id) {
      case 100: this.getSalarySlip(); break;
      case 200: this.requestLeave(); break;
      case 300: this.viewAllAttendance(); break;
    }
  }

  getCheckInData = async () => {
    let tranDate = this.dtu.ConvertStringDateToFullFormat(this.Date!);
    let req = new AttendanceLogCheckInCustomRequest();
    req.TransDateTime = tranDate;
    req.CompanyRef = this.companyRef();
    req.EmployeeRef = this.employeeRef;

    let td = req.FormulateTransportData();
    let pkt = this.payloadPacketFacade.CreateNewPayloadPacket2(td);
    let tr = await this.serverCommunicator.sendHttpRequest(pkt);

    if (!tr.Successful) {
      await this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    }

    let tdResult = JSON.parse(tr.Tag) as TransportData;
    let res = AttendanceLogCheckInCustomRequest.FromTransportData(tdResult);
    if (res.Data.length > 0) {
      let checkInData: AttendanceLogProps[] = res.Data as AttendanceLogProps[];
      let lastCheckInData = checkInData.find(e => e.CheckOutTime == '');
      if (lastCheckInData) Object.assign(this.Entity.p, lastCheckInData);
      else {
        let secondLast = checkInData.find(e => e.CheckOutTime != '');
        if (secondLast) Object.assign(this.Entity.p, secondLast);
      }
    }

    if (this.Entity.p.FirstCheckInTime == '' && this.Entity.p.CheckInTime == '' && this.Entity.p.CheckOutTime == '') {
      this.isCheckInEnabled = true;
    } else if (this.Entity.p.CheckInTime && !this.Entity.p.CheckOutTime) {
      this.isCheckInEnabled = false;
    } else {
      this.isCheckInEnabled = true;
    }
  }

  openPunchModal = async (type: 'in' | 'out') => {
    this.currentPunchType = type;
    if (this.isCheckInEnabled) {
      this.punchModalOpen = true;
    }
    this.siteList = await Site.FetchEntireListByCompanyRef(
      this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
  }

  onSelectionChange(selected: Site[]) {
    this.selectedSite = selected;
  }

  // submitPunchIn = async () => {
  //   try {
  //     this.isSubmitting = true;
  //     this.Entity.p.IsCheckIn = this.currentPunchType === 'in';

  //     this.isPunchInEnabled = !this.Entity.p.IsCheckIn;
  //     this.isPunchOutEnabled = this.Entity.p.IsCheckIn;

  //     this.punchModalOpen = false;
  //     this.isSaveDisabled = true;

  //     this.Entity.p.CompanyRef = this.companyRef();
  //     this.Entity.p.EmployeeRef = this.employeeRef;

  //     if (this.selectedSite.length > 0) {
  //       this.Entity.p.SiteRef = this.selectedSite[0].p.Ref;
  //     }

  //     this.Entity.p.TransDateTime = this.dtu.ConvertStringDateToFullFormat(this.Date!);

  //     let entityToSave = this.Entity.GetEditableVersion();
  //     let entitiesToSave = [entityToSave];
  //     let td = TransportData.CreateTransportData(entitiesToSave);
  //     let pkt = this.payloadPacketFacade.CreateNewPayloadPacket2(td);
  //     let tr = await this.serverCommunicator.sendHttpRequest(pkt);

  //     if (!tr.Successful) {
  //       await this.uiUtils.showErrorMessage('Error', tr.Message);
  //       return;
  //     }

  //     await this.uiUtils.showSuccessToster('Check In successfully');
  //     await this.getCheckInData();
  //   } catch (err) {
  //     await this.uiUtils.showErrorMessage('Error', 'An error occurred during punch submission.');
  //   } finally {
  //     this.isSubmitting = false;
  //   }
  // }

   submitPunchIn = async () => {
    try {
      this.isSubmitting = true;
      debugger
      if (this.currentPunchType === 'in') {
        this.Entity.p.IsCheckIn = true;
        this.isPunchInEnabled = false;   // Disable Punch In
        this.isPunchOutEnabled = true;   // Enable Punch Out
      } else {
        this.Entity.p.IsCheckIn = false;
        this.isPunchInEnabled = true;    // E nable Punch In
        this.isPunchOutEnabled = false;  // Disable Punch Out
      }
      this.punchModalOpen = false;
      this.isSaveDisabled = true;
      this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
      this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
      // this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
      // this.Entity.p.UpdatedDate= await CurrentDateTimeRequest.GetCurrentDateTime();
      this.Entity.p.EmployeeRef = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      if (this.selectedSite.length > 0) {
        this.Entity.p.SiteRef = this.selectedSite[0].p.Ref;
      }
      // convert date 2025-02-23 to 2025-02-23-00-00-00-000
      this.Entity.p.TransDateTime = this.dtu.ConvertStringDateToFullFormat(this.Date!)
      // this.Entity.p.SaleDeedDate = this.dtu.ConvertStringDateToFullFormat(this.localsaledeeddate)
      // this.Entity.p.TalathiDate = this.dtu.ConvertStringDateToFullFormat(this.localtalathidate)
      let entityToSave = this.Entity.GetEditableVersion();
      let entitiesToSave = [entityToSave]
      console.log('entitiesToSave :', entitiesToSave);
      // await this.Entity.EnsurePrimaryKeysWithValidValues()
      let tr = await this.utils.SavePersistableEntities(entitiesToSave);
      if (!tr.Successful) {
        this.isSaveDisabled = false;
        this.uiUtils.showErrorMessage('Error', tr.Message);
        return
      }
      else {
        this.isSaveDisabled = false;
        // this.onEntitySaved.emit(entityToSave);
        if (this.IsCheckIn) {
          await this.uiUtils.showSuccessToster('Punch in successfully!');
          this.Entity = AttendanceLog.CreateNewInstance();
        } else {
          // await this.router.navigate(['/homepage/Website/Registrar_Office'])
          await this.uiUtils.showSuccessToster('Punch out successfully!');
        }
        await this.getCheckInData()
        this.isCheckInTime = this.Entity.p.CheckInTime;
        this.isCheckOutTime = this.Entity.p.CheckOutTime;
      }

    } catch (error) {
      console.log(error);
    } finally {
      this.isSubmitting = false;
    }

  }
  submitPunchOut = async () => {
    try {
      if (this.currentPunchType === 'in') {
        this.Entity.p.IsCheckIn = true;
        this.isPunchInEnabled = false;   // Disable Punch In
        this.isPunchOutEnabled = true;   // Enable Punch Out
      } else {
        this.Entity.p.IsCheckIn = false;
        this.isPunchInEnabled = true;    // Enable Punch In
        this.isPunchOutEnabled = false;  // Disable Punch Out
      }

      this.punchModalOpen = false;

      this.isSaveDisabled = true;
      this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
      // this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
      // this.Entity.p.UpdatedDate= await CurrentDateTimeRequest.GetCurrentDateTime();
      this.Entity.p.EmployeeRef = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))


      // convert date 2025-02-23 to 2025-02-23-00-00-00-000
      this.Entity.p.TransDateTime = this.dtu.ConvertStringDateToFullFormat(this.Date!)
      // this.Entity.p.SaleDeedDate = this.dtu.ConvertStringDateToFullFormat(this.localsaledeeddate)
      // this.Entity.p.TalathiDate = this.dtu.ConvertStringDateToFullFormat(this.localtalathidate)

      let entityToSave = this.Entity.GetEditableVersion();
      let entitiesToSave = [entityToSave]
      console.log('entitiesToSave :', entitiesToSave);

      // await this.Entity.EnsurePrimaryKeysWithValidValues()
      let tr = await this.utils.SavePersistableEntities(entitiesToSave);
      if (!tr.Successful) {
        this.isSaveDisabled = false;
        this.uiUtils.showErrorMessage('Error', tr.Message);
        return
      }
      else {
        this.isSaveDisabled = false;
        // this.onEntitySaved.emit(entityToSave);
        this.Entity = AttendanceLog.CreateNewInstance();

        await this.uiUtils.showSuccessToster('Punch out successfully!');
        await this.getCheckInData();
        this.isCheckInTime = this.Entity.p.CheckInTime;
        this.isCheckOutTime = this.Entity.p.CheckOutTime;
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.isSubmitting = false;
    }

  }

  takePhoto = async (type: 'before' | 'after') => {
    try {
      // const image = await Camera.getPhoto({
      //   quality: 90,
      //   allowEditing: false,
      //   resultType: CameraResultType.DataUrl,
      //   source: CameraSource.Camera
      // });

      // console.log(Captured ${type} photo:, image.dataUrl);
      // Optionally store it for preview or upload
      // this[type + 'Photo'] = image.dataUrl;

    } catch (error) {
      // console.error(\);
    }
  }
  getSalarySlip() {
    this.router.navigate(['/app_homepage/tabs/attendance-management/salary-slip']);
  }

  requestLeave() {
    this.router.navigate(['/app_homepage/tabs/attendance-management/leave-request']);
  }

  viewAllAttendance() {
    this.router.navigate(['/app_homepage/tabs/attendance-management/attendance-details']);
  }
}
