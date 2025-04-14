import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { AttendanceLog } from 'src/app/classes/domain/entities/mobile-app/attendance-management/attendancelog';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
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
  isCurrentTime: string = "";
  isPunchInTime: string = "";
  isPunchOutTime: string = "";
  selectedLocation: string = '';
  totalHalfDays: number = 2;
  totalOvertime: string = '16';
  siteList: Site[] = [];
  selectedSite: Site[] = [];

  isSubmitting = false;

  capturedBeforePhoto: string | null = null;
  capturedAfterPhoto: string | null = null;
  isSaveDisabled: boolean = false;
  private IsCheckIn: boolean = false;
  isChecked: boolean = false; // Default value
  Date: string = "";
  DateWithTime: string | null = null;
  Entity: AttendanceLog = AttendanceLog.CreateNewInstance();
  companyRef = this.companystatemanagement.SelectedCompanyRef;
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
  constructor(private router: Router, private companystatemanagement: CompanyStateManagement, private uiUtils: UIUtils,
    private appStateManage: AppStateManageService, private utils: Utils, private dtu: DTU
  ) { }

  async ngOnInit() {
    let strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
    this.Date = strCDT.substring(0, 10);
    this.isCurrentTime = strCDT;
    this.isPunchInTime = strCDT;
    this.isPunchOutTime = strCDT;
    this.isPunchInEnabled = true;
    this.isPunchOutEnabled = false;
  }
  gridItemsFunction(id: number) {
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
  punchCards = [
    {
      type: 'check-in',
      icon: 'arrow-down-circle-outline',
      label: 'Check In',
      currentTime: 'It is now ' + this.isPunchInTime,
      schedule: 'Check In Schedule',
      time: '08:00',
      punchType: 'in',
    },
    {
      type: 'check-out',
      icon: 'arrow-up-circle-outline',
      label: 'Check Out',
      currentTime: 'Not Yet',
      schedule: 'Check Out Schedule',
      time: '17:00',
      punchType: 'out',
    }
  ];

  openPunchModal = async (type: 'in' | 'out') => {
    this.currentPunchType = type;
    this.punchModalOpen = true;

    // this.currentCompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    console.log('CurrentCompanyRef() :', this.companyRef());

    //  this.siteList = await Site.FetchEntireListByCompanyRef(this.companystatemanagement.getCurrentCompanyRef(), async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg))
    this.siteList = await Site.FetchEntireListByCompanyRef(this.companyRef(), async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg))
    console.log('this.siteList :', this.siteList);

  }
  onSelectionChange(selected: Site[]) {
    console.log('Selected option:', selected);
    this.selectedSite= selected;
  }

  takePhoto = async (type: 'before' | 'after') => {
    try {
      // const image = await Camera.getPhoto({
      //   quality: 90,
      //   allowEditing: false,
      //   resultType: CameraResultType.DataUrl,
      //   source: CameraSource.Camera
      // });

      // console.log(`Captured ${type} photo:`, image.dataUrl);
      // Optionally store it for preview or upload
      // this[type + 'Photo'] = image.dataUrl;

    } catch (error) {
      console.error(`Error taking ${type} photo`, error);
    }
  }
  // takePhoto(type: 'before' | 'after') {
  //   // Replace with your camera logic
  //   const dummyPhoto = 'assets/dummy-photo.jpg'; // use real image URI from camera
  //   if (type === 'before') this.capturedBeforePhoto = dummyPhoto;
  //   else this.capturedAfterPhoto = dummyPhoto;
  // }


  // takePhoto(type: 'before' | 'after') {
  //   console.log(`Take photo (${type})`);
  // }

  submitPunchIn = async () => {
    try {
      this.isSubmitting = true;
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
      this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
      // this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
      // this.Entity.p.UpdatedDate= await CurrentDateTimeRequest.GetCurrentDateTime();
      this.Entity.p.EmployeeRef = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.Entity.p.SiteRef = this.selectedSite[0].p.Ref;
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
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.isSubmitting = false;
    }

  }
  // submitPunch() {
  //   this.isSubmitting = true;
  //   setTimeout(() => {
  //     this.isSubmitting = false;
  //     this.punchModalOpen = false;
  //     console.log('Punch Submitted ✅');
  //   }, 2000); // simulate API
  // }
  getSalarySlip() {
    this.router.navigate(['/app_homepage/tabs/attendance-management/salary-slip']);
  }
  requestLeave() {
    this.router.navigate(['/app_homepage/tabs/attendance-management/leave-request']);
  }
  viewAllAttendance() {
    console.log('Viewing full attendance...');
  }
  viewMore() {
    this.router.navigate(['/app_homepage/tabs/attendance-management/attendance-details']);
  }
}
