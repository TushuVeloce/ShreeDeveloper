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
  TotalWorkingHrs: number = 0;

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
      // convert  2025-02-23-00-00-00-000 to 2025-02-23
      this.fromdate = this.dtu.ConvertStringDateToShortFormat(
        this.Entity.p.FromDate
      );
      this.todate = this.dtu.ConvertStringDateToShortFormat(
        this.Entity.p.ToDate
      );
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    } else {
      this.Entity.p.EmployeeRef = this.appStateManage.getEmployeeRef();
      this.Entity = LeaveRequest.CreateNewInstance();
      LeaveRequest.SetCurrentInstance(this.Entity);
      this.Entity.p.LeaveRequestType = this.LeaveRequestTypeList[1].Ref
      this.getSingleEmployeeDetails();
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

  getSingleEmployeeDetails = async () => {
    let data = await Employee.FetchInstance(this.Entity.p.EmployeeRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.Entity.p.EmployeeRef = data.p.Ref;
    this.Entity.p.EmployeeName = data.p.Name;
    this.TotalWorkingHrs = data.p.TotalWorkingHrs;
  }

  handleLeavehours = () => {
    if (this.Entity.p.Days != 0) {
      this.Entity.p.LeaveHours = this.Entity.p.Days * this.TotalWorkingHrs;
    }
  }

  setDaysandLeaveHours = () => {
    if (this.fromdate && this.todate) {
      const FromDate: any = new Date(this.fromdate);
      const ToDate: any = new Date(this.todate);

      // Calculate the difference in milliseconds
      const diffInMs = Math.abs(ToDate - FromDate + 1);

      // Convert milliseconds to days
      this.Entity.p.Days = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
      this.Entity.p.LeaveHours = this.Entity.p.Days * this.TotalWorkingHrs;
    } else {
      this.Entity.p.Days = 0;
    }
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

    if (this.Entity.p.UpdatedBy == 0) {
      this.Entity.p.UpdatedBy = this.Entity.p.EmployeeRef;
    }

    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);

    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    } else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Leave Request Master saved successfully!');
        this.Entity = LeaveRequest.CreateNewInstance();
        this.resetAllControls();
      } else {
        await this.uiUtils.showSuccessToster('Leave Request Master Updated successfully!');
        await this.router.navigate(['/homepage/Website/Leave_Request']);
      }
    }
  };

  // for value 0 selected while click on Input //
  selectAllValue = (event: MouseEvent): void => {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  BackLeaveRequest = () => {
    this.router.navigate(['/homepage/Website/Leave_Request']);
  }

  resetAllControls = () => {
    // reset touched

    // reset dirty
  }
}
