import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { NgModel } from '@angular/forms';
import { LeaveRequest } from 'src/app/classes/domain/entities/website/request/leaverequest/leaverequest';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { DTU } from 'src/app/services/dtu.service';


@Component({
  selector: 'app-leaverequest-master-details',
  standalone: false,
  templateUrl: './leave-request-details.component.html',
  styleUrls: ['./leave-request-details.component.scss'],
})
export class LeaveRequestDetailsComponent implements OnInit {
  Entity: LeaveRequest = LeaveRequest.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Leave Request' | 'Edit Leave Request' = 'New Leave Request';
  IsDropdownDisabled: boolean = false;
  InitialEntity: LeaveRequest = null as any;
  EmployeeList: Employee[] = [];
  LeaveRequestTypeList = DomainEnums.LeaveRequestTypeList(true, '--Select Leave Type--');
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  fromdate: string = '';
  todate: string = '';

  NameWithNos: string = ValidationPatterns.NameWithNos

  NameWithNosMsg: string = ValidationMessages.NameWithNosMsg
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg

  @ViewChild('NameCtrl') NameInputControl!: NgModel;
  @ViewChild('CodeCtrl') CodeInputControl!: NgModel;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private dtu: DTU,
    private companystatemanagement: CompanyStateManagement
  ) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;

      this.DetailsFormTitle = this.IsNewEntity
        ? 'New Leave Request'
        : 'Edit Leave Request';
      this.Entity = LeaveRequest.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    } else {
      this.Entity = LeaveRequest.CreateNewInstance();
      LeaveRequest.SetCurrentInstance(this.Entity);
      this.Entity.p.LeaveRequestType = this.LeaveRequestTypeList[1].Ref
      this.getEmployeeListByCompanyRef();
    }
    this.InitialEntity = Object.assign(
      LeaveRequest.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as LeaveRequest;
    this.focusInput();
  }

  focusInput = () => {
    let txtName = document.getElementById('fromdate')!;
    txtName.focus();
  }

  getEmployeeListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Employee.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.EmployeeList = lst;
    this.Entity.p.EmployeeRef = this.EmployeeList[0].p.Ref
  }

  SaveLeaveRequest = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();

    this.Entity.p.FromDate = this.dtu.ConvertStringDateToFullFormat(this.fromdate);
    this.Entity.p.ToDate = this.dtu.ConvertStringDateToFullFormat(this.todate);

    if (!this.Entity.p.Days) {
      this.Entity.p.Days = 0;
    }
    if (!this.Entity.p.LeaveHours) {
      this.Entity.p.LeaveHours = 0;
    }
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
    // let entityToSave = this.Entity.GetEditableVersion();
    // let entitiesToSave = [entityToSave];
    // let tr = await this.utils.SavePersistableEntities(entitiesToSave);

    // if (!tr.Successful) {
    //   this.isSaveDisabled = false;
    //   this.uiUtils.showErrorMessage('Error', tr.Message);
    //   return;
    // } else {
    //   this.isSaveDisabled = false;
    //   if (this.IsNewEntity) {
    //     await this.uiUtils.showSuccessToster('LeaveRequest Master saved successfully!');
    //     this.Entity = LeaveRequest.CreateNewInstance();
    //     this.resetAllControls();
    //   } else {
    //     await this.uiUtils.showSuccessToster('LeaveRequest Master Updated successfully!');
    //     await this.router.navigate(['/homepage/Website/Leave_Request']);
    //   }
    // }
  };

  // for value 0 selected while click on Input //
  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  BackLeaveRequest = () => {
    this.router.navigate(['/homepage/Website/Leave_Request']);
  }

  resetAllControls = () => {
    // reset touched
    this.NameInputControl.control.markAsUntouched();
    this.CodeInputControl.control.markAsUntouched();

    // reset dirty
    this.NameInputControl.control.markAsPristine();
    this.CodeInputControl.control.markAsPristine();
  }
}
