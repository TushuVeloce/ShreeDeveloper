import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages } from 'src/app/classes/domain/constants';
import { EmployeeOvertime } from 'src/app/classes/domain/entities/website/HR_and_Payroll/Employee_Overtime/employeeovertime';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-employee-overtime-details',
  standalone: false,
  templateUrl: './employee-overtime-details.component.html',
  styleUrls: ['./employee-overtime-details.component.scss'],
})
export class EmployeeOvertimeDetailsComponent implements OnInit {
  Entity: EmployeeOvertime = EmployeeOvertime.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Employee Overtime' | 'Edit Employee Overtime' = 'New Employee Overtime';
  IsDropdownDisabled: boolean = false;
  InitialEntity: EmployeeOvertime = null as any;
  EmployeeList: Employee[] = [];
  companyName = this.companystatemanagement.SelectedCompanyName;
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg;

  @ViewChild('OvertimeForm') OvertimeForm!: NgForm;
  @ViewChild('DateCtrl') DateInputControl!: NgModel;
  @ViewChild('OverTimeInHrsCtrl') OverTimeInHrsInputControl!: NgModel;
  @ViewChild('OverTimeInMinCtrl') OverTimeInMinInputControl!: NgModel;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement,
    private dtu: DTU,
  ) { }

  ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.getEmployeeListByCompanyRef()
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity
        ? 'New Employee Overtime'
        : 'New Employee Overtime';
      this.Entity = EmployeeOvertime.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');
      this.Entity.p.UpdatedBy = Number(
        this.appStateManage.StorageKey.getItem('LoginEmployeeRef')
      );
      this.Entity.p.Date = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date)
    } else {
      this.Entity = EmployeeOvertime.CreateNewInstance();
      EmployeeOvertime.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(
      EmployeeOvertime.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as EmployeeOvertime;
    this.focusInput();
  }

  focusInput = () => {
    let txtName = document.getElementById('Date')!;
    txtName.focus();
  };

  // for value 0 selected while click on Input //
  selectAllValue = (event: MouseEvent): void => {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  getEmployeeListByCompanyRef = async () => {
    let lst = await Employee.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.EmployeeList = lst;
  }

  converthrtomin() {
    if (this.Entity.p.OverTimeInHrs) {
      this.Entity.p.OverTimeInMin = parseFloat((this.Entity.p.OverTimeInHrs * 60).toFixed(2));
    } else {
      this.Entity.p.OverTimeInMin = 0;
    }
  }

  convertmintohr() {
    if (this.Entity.p.OverTimeInMin) {
      this.Entity.p.OverTimeInHrs = parseFloat((this.Entity.p.OverTimeInMin / 60).toFixed(2));
    } else {
      this.Entity.p.OverTimeInHrs = 0;
    }
  }

  SaveEmployeeOvertime = async () => {
    this.Entity.p.CompanyRef =
      this.companystatemanagement.getCurrentCompanyRef();
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(
        this.appStateManage.StorageKey.getItem('LoginEmployeeRef')
      );
      this.Entity.p.UpdatedBy = Number(
        this.appStateManage.StorageKey.getItem('LoginEmployeeRef')
      );
    }
    this.Entity.p.Date = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.Date)
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    console.log('entitiesToSave :', entitiesToSave);
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    } else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster(
          'Office Duty and Time saved successfully'
        );
        this.Entity = EmployeeOvertime.CreateNewInstance();
        this.resetAllControls();
      } else {
        await this.uiUtils.showSuccessToster(
          'Office Duty and Time  Updated successfully'
        );
        await this.router.navigate(['/homepage/Website/Employee_Overtime']);
      }
    }
  };

  BackEmployeeOverTime = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Employee Overtime Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Employee_Overtime']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Employee_Overtime']);
    }
  }

  resetAllControls() {
    this.OvertimeForm.resetForm(); // this will reset all form controls to their initial state
  }
}

