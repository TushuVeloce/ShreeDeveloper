import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages } from 'src/app/classes/domain/constants';
import { EmployeeOvertime } from 'src/app/classes/domain/entities/website/HR_and_Payroll/Employee_Overtime/employeeovertime';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
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
  Date: string = '';
  strCDT: string = '';
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

  async ngOnInit() {
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
      this.calculateOvertimeHours()
    } else {
      this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
      let parts = this.strCDT.substring(0, 16).split('-');
      // Construct the new date format
      this.Date = `${parts[0]}-${parts[1]}-${parts[2]}`;
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


  calculateOvertimeHours = () => {
    if (this.Entity.p.ToTime == '') {
      return
    }

    // Fallback to "00:00" if either is missing or invalid
    if (!this.Entity.p.FromTime || !this.Entity.p.FromTime.includes(":")) return 0;

    const [inHour, inMin] = this.Entity.p.FromTime.split(':').map(Number);
    const [outHour, outMin] = (this.Entity.p.ToTime && this.Entity.p.ToTime.includes(":") ? this.Entity.p.ToTime : "00:00").split(':').map(Number);

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

    this.Entity.p.OverTimeInHrs = parseFloat(decimalHours.toFixed(2));

    // HH:mm format
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    this.Entity.p.DisplayOverTime = `${hours}h ${minutes.toString().padStart(2, '0')}m`;
    return;
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
    this.Entity.p.Date = this.dtu.ConvertStringDateToFullFormat(this.Date);

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

