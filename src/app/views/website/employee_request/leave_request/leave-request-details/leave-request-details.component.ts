import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';
import {
  ValidationMessages,
  ValidationPatterns,
} from 'src/app/classes/domain/constants';
import { NgModel } from '@angular/forms';
import { LeaveRequest } from 'src/app/classes/domain/entities/website/request/leaverequest/leaverequest';
import {
  DomainEnums,
  LeaveRequestType,
} from 'src/app/classes/domain/domainenums/domainenums';
import { DTU } from 'src/app/services/dtu.service';
import { entries } from 'lodash';

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
  DetailsFormTitle: 'New Leave Request' | 'Edit Leave Request' =
    'New Leave Request';
  IsDropdownDisabled: boolean = false;
  InitialEntity: LeaveRequest = null as any;
  EmployeeList: Employee[] = [];
  LeaveRequestTypeList = DomainEnums.LeaveRequestTypeList(
    true,
    '--Select Leave Type--'
  );
  LeaveRequestType = LeaveRequestType;
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  fromdate: string = '';
  halfdaydate: string = '';
  todate: string = '';
  EmployeeRef: number = 0;
  TotalWorkingHrs: number = 0;
  isHalfDay: boolean = false;

  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg;

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
      this.Entity.p.UpdatedBy = Number(
        this.appStateManage.StorageKey.getItem('LoginEmployeeRef')
      );
    } else {
      // this.EmployeeRef = this.appStateManage.getEmployeeRef();
      this.EmployeeRef = Number(
        this.appStateManage.StorageKey.getItem('LoginEmployeeRef')
      );
      this.Entity = LeaveRequest.CreateNewInstance();
      LeaveRequest.SetCurrentInstance(this.Entity);
      this.Entity.p.LeaveRequestType = this.LeaveRequestTypeList[1].Ref;
      this.getSingleEmployeeDetails();
    }
    this.InitialEntity = Object.assign(
      LeaveRequest.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as LeaveRequest;
    this.focusInput();
  }

  focusInput = () => {
    // let txtName = document.getElementById('fromdate')!;
    // txtName.focus();
  };

  getSingleEmployeeDetails = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let data = await Employee.FetchInstance(
      this.EmployeeRef, this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.Entity.p.EmployeeRef = data.p.Ref;
    this.Entity.p.EmployeeName = data.p.Name;
    this.TotalWorkingHrs = data.p.TotalWorkingHrs;
  };

  formatDateToYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  };

  onDaysChanged = () => {
    if (this.fromdate && this.Entity.p.Days) {
      const fromDate = new Date(this.fromdate);
      const newToDate = new Date(fromDate);
      newToDate.setDate(fromDate.getDate() + this.Entity.p.Days - 1);

      this.todate = this.formatDateToYYYYMMDD(newToDate); // format needed for input[type="date"]
      this.Entity.p.LeaveHours = this.Entity.p.Days * this.TotalWorkingHrs;
    }
  };

  onDateChangeSetDaysandLeaveHours = () => {
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
  };

  onLeaveRequestTypeChanged = () => {
    if (this.Entity.p.LeaveRequestType == LeaveRequestType.HalfDay) {
      this.isHalfDay = true;
      this.Entity.p.LeaveHours = this.TotalWorkingHrs * 0.5;
      this.Entity.p.FromDate = '';
      this.fromdate = '';
      this.Entity.p.ToDate = ''
      this.todate = '';
      this.Entity.p.Days = 0;
    } else {
      this.isHalfDay = false;
      this.halfdaydate = '';
    }
  };

  SaveLeaveRequest = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();

    if (this.Entity.p.LeaveRequestType == LeaveRequestType.HalfDay) {
      this.Entity.p.HalfDayDate = this.dtu.ConvertStringDateToFullFormat(this.halfdaydate);
    } else {
      this.Entity.p.FromDate = this.dtu.ConvertStringDateToFullFormat(this.fromdate);
      this.Entity.p.ToDate = this.dtu.ConvertStringDateToFullFormat(this.todate);
    }

    if (!this.Entity.p.Days) {
      this.Entity.p.Days = 0;
    }
    if (!this.Entity.p.LeaveHours) {
      this.Entity.p.LeaveHours = 0;
    }

    if (this.Entity.p.UpdatedBy == 0) {
      this.Entity.p.UpdatedBy = this.EmployeeRef;
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
        await this.router.navigate(['/homepage/Website/Leave_Request']);
      }
    }
  };

  // for value 0 selected while click on Input //
  selectAllValue = (event: MouseEvent): void => {
    const input = event.target as HTMLInputElement;
    input.select();
  };

  BackLeaveRequest = () => {
    this.router.navigate(['/homepage/Website/Leave_Request']);
  };

  resetAllControls = () => {
    // reset touched
    // reset dirty
  };
}
