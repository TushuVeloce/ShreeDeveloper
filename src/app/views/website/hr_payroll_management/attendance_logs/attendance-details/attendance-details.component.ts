import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns, AttendanceHandleByRefs } from 'src/app/classes/domain/constants';
import { AttendanceLocationType, DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { AttendanceLog } from 'src/app/classes/domain/entities/mobile-app/attendance-management/attendancelog';
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
  Entity: AttendanceLog = AttendanceLog.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Attendance' | 'Edit Attendance' = 'New Attendance';
  IsDropdownDisabled: boolean = false
  InitialEntity: AttendanceLog = null as any;
  EmployeeList: Employee[] = [];
  FromTime: string = '';
  SiteList: Site[] = [];
  AttendanceLocationTypeList = DomainEnums.AttendanceLocationTypeList();
  AttendanceLocationType = AttendanceLocationType;
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  NameWithoutNos: string = ValidationPatterns.NameWithoutNos

  NameWithoutNosMsg: string = ValidationMessages.NameWithoutNosMsg
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg

  @ViewChild('FromDateCtrl') FromDateInputControl!: NgModel;

  constructor(private router: Router, private uiUtils: UIUtils, private dtu: DTU, private appStateManage: AppStateManageService, private utils: Utils, private companystatemanagement: CompanyStateManagement) { }

  ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.getEmployeeListByCompanyRef();
    this.getSiteListByCompanyRef();
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;

      this.DetailsFormTitle = this.IsNewEntity ? 'New Attendance' : 'Edit Attendance';
      this.Entity = AttendanceLog.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable')

    } else {
      this.Entity = AttendanceLog.CreateNewInstance();
      AttendanceLog.SetCurrentInstance(this.Entity);

    }
    this.InitialEntity = Object.assign(AttendanceLog.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as AttendanceLog;
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

  SaveAttendenceMaster = async () => {
    this.isSaveDisabled = true;
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }

    this.Entity.p.HandleBy = AttendanceHandleByRefs.WebRef;
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
        await this.uiUtils.showSuccessToster('Attendance saved successfully!');
        this.Entity = AttendanceLog.CreateNewInstance();
        this.resetAllControls()
      } else {
        await this.uiUtils.showSuccessToster('Attendance Updated successfully!');
        await this.router.navigate(['/homepage/Website/Attendance_Logs']);
      }
    }
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

