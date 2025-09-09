import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { NgModel } from '@angular/forms';
import { SalarySlipRequest } from 'src/app/classes/domain/entities/website/request/salarysliprequest/salarysliprequest';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { DTU } from 'src/app/services/dtu.service';
import { FinancialYear } from 'src/app/classes/domain/entities/website/masters/financialyear/financialyear';


@Component({
  selector: 'app-salarysliprequest-master-details',
  standalone: false,
  templateUrl: './salary-slip-request-details.component.html',
  styleUrls: ['./salary-slip-request-details.component.scss'],
})

export class SalarySlipRequestDetailsComponent implements OnInit {
  Entity: SalarySlipRequest = SalarySlipRequest.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Salary Slip Request' | 'Edit Salary Slip Request' = 'New Salary Slip Request';
  IsDropdownDisabled: boolean = false;
  InitialEntity: SalarySlipRequest = null as any;
  MonthList = DomainEnums.MonthList(true, '--Select Month Type--');
  EmployeeList: Employee[] = [];
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  FinancialYearList: any = [];
  FromDates: string[] = [];
  ToDates: string[] = [];
  EmployeeRef: number = 0;

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
        ? 'New Salary Slip Request'
        : 'Edit Salary Slip Request';
      this.Entity = SalarySlipRequest.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    } else {
      this.EmployeeRef = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.Entity = SalarySlipRequest.CreateNewInstance();
      SalarySlipRequest.SetCurrentInstance(this.Entity);
      this.getSingleEmployeeDetails();
    }

    this.getFinancialYearListByCompanyRef();
  }

  getFinancialYearListByCompanyRef = async () => {
    this.FinancialYearList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await FinancialYear.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));

    const updatedArray = lst.map(item => ({
      ...item,
      FromDate: item.p.FromDate.substring(0, 4),
      ToDate: item.p.ToDate.substring(0, 4)
    }));

    const years: string[] = [];

    updatedArray.forEach(item => {
      years.push(item.FromDate);
      years.push(item.ToDate);
    });

    // Step 2: Sort and remove duplicates
    const uniqueYears = Array.from(new Set(years)).sort();

    this.FinancialYearList = uniqueYears;
  }

  getSingleEmployeeDetails = async () => {
    let data = await Employee.FetchInstance(this.EmployeeRef, this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.Entity.p.EmployeeRef = data.p.Ref;
    this.Entity.p.EmployeeName = data.p.Name;

    this.InitialEntity = Object.assign(
      SalarySlipRequest.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as SalarySlipRequest;
  }

  onSelectedMonthsChange = (Selectedservice: any) => {
    this.Entity.p.SelectedMonths = Selectedservice;
  }

  SaveSalarySlipRequest = async () => {
    this.isSaveDisabled = true;
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();

    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
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
        await this.uiUtils.showSuccessToster('SalarySlipRequest Master saved successfully');
        this.Entity = SalarySlipRequest.CreateNewInstance();
        await this.router.navigate(['/homepage/Website/Salary_Slip_Request']);
        this.resetAllControls();
      }
    }
  };

  // for value 0 selected while click on Input //
  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  BackSalarySlipRequest = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Salary Slip Request Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Salary_Slip_Request']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Salary_Slip_Request']);
    }
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
