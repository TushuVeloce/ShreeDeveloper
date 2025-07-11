import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns, AttendanceHandleByRefs } from 'src/app/classes/domain/constants';
import { AttendanceLocationType, DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { WebAttendaneLog } from 'src/app/classes/domain/entities/website/HR_and_Payroll/web_attendance_log/web_attendance_log/webattendancelog';
import { WebAttendaneLogDetailsLog, WebAttendaneLogDetailsLogProps } from 'src/app/classes/domain/entities/website/HR_and_Payroll/web_attendance_log/web_attendance_log_details/webattendancelogdetails';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-attendance-details',
  templateUrl: './attendance-details.component.html',
  styleUrls: ['./attendance-details.component.scss'],
  standalone: false,
})
export class AttendanceDetailsComponent implements OnInit {
  Entity: WebAttendaneLog = WebAttendaneLog.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Attendance' | 'Edit Attendance' = 'New Attendance';
  IsDropdownDisabled: boolean = false
  InitialEntity: WebAttendaneLog = null as any;
  EmployeeList: Employee[] = [];
  FromTime: string = '';
  SiteList: Site[] = [];
  TotalWorkingHrs: number = 0;
  editingIndex: null | undefined | number
  ModalEditable: boolean = false;
  isModalOpen: boolean = false;
  newAttendance: WebAttendaneLogDetailsLogProps = WebAttendaneLogDetailsLogProps.Blank();
  AttendanceLocationTypeList = DomainEnums.AttendanceLocationTypeList();
  AttendanceLocationType = AttendanceLocationType;
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  strCDT: string = ''
  Date: string = ''

  baseHeaders: string[] = ['Sr. No', 'Site Name', 'Check In Time', 'Check Out Time', 'Working Hours', 'Action'];

  NameWithoutNos: string = ValidationPatterns.NameWithoutNos

  NameWithoutNosMsg: string = ValidationMessages.NameWithoutNosMsg
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg

  @ViewChild('FromDateCtrl') FromDateInputControl!: NgModel;

  constructor(private router: Router, private uiUtils: UIUtils, private dtu: DTU, private appStateManage: AppStateManageService, private utils: Utils, private companystatemanagement: CompanyStateManagement) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.getEmployeeListByCompanyRef();
    this.getSiteListByCompanyRef();

    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Attendance' : 'Edit Attendance';
      this.Entity = WebAttendaneLog.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable')

    } else {
      this.Entity = WebAttendaneLog.CreateNewInstance();
      WebAttendaneLog.SetCurrentInstance(this.Entity);
    }
    this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
    let parts = this.strCDT.substring(0, 16).split('-');
    // Construct the new date format
    this.Date = `${parts[0]}-${parts[1]}-${parts[2]}`;
    this.InitialEntity = Object.assign(WebAttendaneLog.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as WebAttendaneLog;
  }

  getEmployeeListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Employee.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.EmployeeList = lst;
  }

  private getSiteListByCompanyRef = async () => {
    let lst = await Site.FetchEntireListByCompanyRef(
      this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.SiteList = lst;
  };

  SaveAttendence = async () => {
    this.isSaveDisabled = true;
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }

    // this.Entity.p.HandleBy = AttendanceHandleByRefs.WebRef;
    // Get current date time and set state
    const strCurrentDateTime = await CurrentDateTimeRequest.GetCurrentDateTime();
    const DateValue = strCurrentDateTime.substring(0, 10);
    this.Entity.p.TransDateTime = this.dtu.ConvertStringDateToFullFormat(DateValue);
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave]
    console.log('entitiesToSave :', entitiesToSave);
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return
    }
    else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Attendance saved successfully');
        this.Entity = WebAttendaneLog.CreateNewInstance();
        this.resetAllControls()
      } else {
        await this.uiUtils.showSuccessToster('Attendance Updated successfully');
        await this.router.navigate(['/homepage/Website/Attendance_Logs']);
      }
    }
  }

  openModal() {
    this.isModalOpen = true;
    this.ModalEditable = false;
  }

  closeModal = async () => {
    const keysToCheck = ['CheckInTime', 'CheckOutTime', 'SiteRef', 'WorkingHrs'] as const;

    const hasData = keysToCheck.some(
      key => (this.newAttendance as any)[key]?.toString().trim()
    );

    if (hasData) {
      await this.uiUtils.showConfirmationMessage(
        'Close',
        `This process is <strong>IRREVERSIBLE!</strong><br/>
               Are you sure you want to close this modal?`,
        async () => {
          this.isModalOpen = false;
          this.ModalEditable = false;
          this.newAttendance = WebAttendaneLogDetailsLogProps.Blank();
        }
      );
    } else {
      this.isModalOpen = false;
      this.newAttendance = WebAttendaneLogDetailsLogProps.Blank();
    }
  };

  editAttendane(index: number) {
    this.isModalOpen = true
    this.newAttendance = { ...this.Entity.p.AttendanceLogDetailsArray[index] }
    this.ModalEditable = true;
    this.editingIndex = index;
  }

  async removeAttendane(index: number) {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
       Are you sure that you want to DELETE this Attendane Material?`,
      async () => {
        this.Entity.p.AttendanceLogDetailsArray.splice(index, 1);
      }
    );
  }

  onSiteSelection = () => {
    if (this.newAttendance.SiteRef == 0) {
      this.newAttendance.SiteName = 'Office'
    } else {
      const SingleRecord = this.SiteList.find(data => data.p.Ref == this.newAttendance.SiteRef);
      if (SingleRecord)
        this.newAttendance.SiteName = SingleRecord.p.Name
    }
  }

  calculateWorkingHours = () => {
    if (this.newAttendance.CheckOutTime == '') {
      return
    }

    // Fallback to "00:00" if either is missing or invalid
    if (!this.newAttendance.CheckInTime || !this.newAttendance.CheckInTime.includes(":")) return 0;

    const [inHour, inMin] = this.newAttendance.CheckInTime.split(':').map(Number);
    const [outHour, outMin] = (this.newAttendance.CheckOutTime && this.newAttendance.CheckOutTime.includes(":") ? this.newAttendance.CheckOutTime : "00:00").split(':').map(Number);

    // Check for invalid numbers
    if (isNaN(inHour) || isNaN(inMin) || isNaN(outHour) || isNaN(outMin)) return 0;

    const inDate = new Date();
    inDate.setHours(inHour, inMin, 0, 0);

    const outDate = new Date();
    outDate.setHours(outHour, outMin, 0, 0);

    // Handle overnight shift
    if (outDate <= inDate) {
      outDate.setDate(outDate.getDate() + 1);
    }

    const diffMs = outDate.getTime() - inDate.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    const decimalHours = diffMinutes / 60;

    this.newAttendance.WorkingHrs = parseFloat(decimalHours.toFixed(2));

    // HH:mm format
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    this.newAttendance.DisplayWorkingHrs = `${hours}:${minutes.toString().padStart(2, '0')}`;
    // console.log('`${hours}:${minutes.toString().padStart(2, \'0\')}` :', `${hours}:${minutes.toString().padStart(2, '0')}`);
    return;
  }

  calculateTotalWorkingHours = () => {
    if (this.Entity.p.FirstCheckInTime == '') {
      return
    }

    if (this.Entity.p.LastCheckOutTime == '') {
      return
    }

    // Fallback to "00:00" if either is missing or invalid
    if (!this.Entity.p.FirstCheckInTime || !this.Entity.p.FirstCheckInTime.includes(":")) return 0;

    const [inHour, inMin] = this.Entity.p.FirstCheckInTime.split(':').map(Number);
    const [outHour, outMin] = (this.Entity.p.LastCheckOutTime && this.Entity.p.LastCheckOutTime.includes(":") ? this.Entity.p.LastCheckOutTime : "00:00").split(':').map(Number);

    // Check for invalid numbers
    if (isNaN(inHour) || isNaN(inMin) || isNaN(outHour) || isNaN(outMin)) return 0;

    const inDate = new Date();
    inDate.setHours(inHour, inMin, 0, 0);

    const outDate = new Date();
    outDate.setHours(outHour, outMin, 0, 0);

    // Handle overnight shift
    if (outDate <= inDate) {
      outDate.setDate(outDate.getDate() + 1);
    }

    const diffMs = outDate.getTime() - inDate.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    const decimalHours = diffMinutes / 60;

    // this.Entity.p.TotalWorkingHrs = parseFloat(decimalHours.toFixed(2));

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    this.Entity.p.TotalWorkingHrs = `${hours}:${minutes.toString().padStart(2, '0')}`;
    console.log(' this.Entity.p.TotalWorkingHrs :',  this.Entity.p.TotalWorkingHrs);
    return;
  }

  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }


  getTotalWorkingHrs = () => {
    this.TotalWorkingHrs = this.Entity.p.AttendanceLogDetailsArray.reduce((total: number, item: any) => {
      return total + Number(item.WorkingHrs || 0);
    }, 0);
    return this.TotalWorkingHrs;
  }


  async addAttendance() {
    if (this.newAttendance.CheckInTime == '') {
      return this.uiUtils.showWarningToster('Check In Time cannot be blank.');
    }


    if (this.newAttendance.CheckOutTime) {
      if (this.newAttendance.CheckOutTime < this.newAttendance.CheckInTime) {
        return this.uiUtils.showWarningToster('Check Out time should be after Check In.');
      }
    }

    this.onSiteSelection();

    if (this.editingIndex !== null && this.editingIndex !== undefined && this.editingIndex >= 0) {
      if (this.Entity.p.AttendanceLogDetailsArray.length > 1) {
        if (this.Entity.p.AttendanceLogDetailsArray[this.Entity.p.AttendanceLogDetailsArray.length - 2].CheckOutTime == '') {
          return this.uiUtils.showWarningToster('Next Check In time should be after previous Check Out.');
        }

        if (this.Entity.p.AttendanceLogDetailsArray[this.Entity.p.AttendanceLogDetailsArray.length - 2].CheckOutTime > this.newAttendance.CheckInTime) {
          return this.uiUtils.showWarningToster('Next Check In time should be after previous Check Out.');
        }
      }
      this.Entity.p.AttendanceLogDetailsArray[this.editingIndex] = { ...this.newAttendance };
      await this.uiUtils.showSuccessToster('Attendance updated successfully');
      this.isModalOpen = false;

    } else {
      if (this.Entity.p.AttendanceLogDetailsArray.length > 0) {
        if (this.Entity.p.AttendanceLogDetailsArray[this.Entity.p.AttendanceLogDetailsArray.length - 1].CheckOutTime == '') {
          return this.uiUtils.showWarningToster('Next Check In time should be after previous Check Out.');
        }

        if (this.Entity.p.AttendanceLogDetailsArray[this.Entity.p.AttendanceLogDetailsArray.length - 1].CheckOutTime > this.newAttendance.CheckInTime) {
          return this.uiUtils.showWarningToster('Next Check In time should be after previous Check Out.');
        }
      }
      let AttendaneDetailsLogInstance = new WebAttendaneLogDetailsLog(this.newAttendance, true);
      // let AttendaneLogInstance = new WebAttendaneLog(this.Entity.p, true);
      // await AttendaneDetailsLogInstance.EnsurePrimaryKeysWithValidValues();
      // await AttendaneLogInstance.EnsurePrimaryKeysWithValidValues();

      this.Entity.p.AttendanceLogDetailsArray.push({ ...AttendaneDetailsLogInstance.p });
      await this.uiUtils.showSuccessToster('Attendance added successfully');
    }
    this.newAttendance = WebAttendaneLogDetailsLogProps.Blank();
    this.editingIndex = null;
    this.Entity.p.FirstCheckInTime = this.Entity.p.AttendanceLogDetailsArray[0].CheckInTime;
    this.Entity.p.LastCheckOutTime = this.Entity.p.AttendanceLogDetailsArray[this.Entity.p.AttendanceLogDetailsArray.length - 1].CheckOutTime;
    this.calculateTotalWorkingHours();
  }

  BackAttendence = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Attendance Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Attendance_Logs']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Attendance_Logs']);
    }
  }

  resetAllControls = () => {
    // reset touched
    this.FromDateInputControl.control.markAsUntouched();

    // reset dirty
    this.FromDateInputControl.control.markAsPristine();
  }
}

