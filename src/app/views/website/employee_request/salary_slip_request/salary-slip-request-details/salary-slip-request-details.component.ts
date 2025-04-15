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
  FromMonthList = DomainEnums.MonthList(true, '--Select Month Type--');
  ToMonthList = DomainEnums.MonthList(true, '--Select Month Type--');
  EmployeeList: Employee[] = [];
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  FinancialYearList: FinancialYear[] = [];
  FromDates: string[] = [];
  ToDates: string[] = [];
  frommonth: string = '';
  tomonth: string = '';
  fromyear: string = '';
  toyear: string = '';

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
      this.frommonth = this.dtu.ConvertStringDateToShortFormat(
        this.Entity.p.FromMonth
      );
      this.tomonth = this.dtu.ConvertStringDateToShortFormat(
        this.Entity.p.ToMonth
      );
      this.fromyear = this.dtu.ConvertStringDateToShortFormat(
        this.Entity.p.FromYear
      );
      this.toyear = this.dtu.ConvertStringDateToShortFormat(
        this.Entity.p.ToYear
      );
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    } else {
      this.Entity = SalarySlipRequest.CreateNewInstance();
      SalarySlipRequest.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(
      SalarySlipRequest.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as SalarySlipRequest;
    this.focusInput();
    this.getFinancialYearListByCompanyRef();
  }

  focusInput = () => {
    // let txtName = document.getElementById('fromdate')!;
    // txtName.focus();
  }

  getFinancialYearListByCompanyRef = async () => {
    this.FinancialYearList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await FinancialYear.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.FinancialYearList = lst;
    this.convertdate();
  }

  convertdate = () => {
    this.FinancialYearList.forEach(item => {
      let convertedDate = this.dtu.GetIndianDate(item.p.FromDate,);
      this.FromDates.push(convertedDate);
      item.p.FromDate = convertedDate;
    });
    this.FinancialYearList.forEach(item => {
      let convertedDate = this.dtu.GetIndianDate(item.p.ToDate,);
      this.ToDates.push(convertedDate);
      item.p.ToDate = convertedDate;
    });
  }

  getSingleEmployeeDetails = async () => {
    let data = await Employee.FetchInstance(this.Entity.p.EmployeeRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.Entity.p.EmployeeRef = data.p.Ref;
    this.Entity.p.EmployeeName = data.p.Name;
  }

  SaveSalarySlipRequest = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();

    this.Entity.p.FromMonth = this.dtu.ConvertStringDateToFullFormat(this.frommonth);
    this.Entity.p.ToMonth = this.dtu.ConvertStringDateToFullFormat(this.tomonth);
    this.Entity.p.FromYear = this.dtu.ConvertStringDateToFullFormat(this.fromyear);
    this.Entity.p.ToYear = this.dtu.ConvertStringDateToFullFormat(this.toyear);

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
    //     await this.uiUtils.showSuccessToster('SalarySlipRequest Master saved successfully!');
    //     this.Entity = SalarySlipRequest.CreateNewInstance();
    //     this.resetAllControls();
    //   } else {
    //     await this.uiUtils.showSuccessToster('SalarySlipRequest Master Updated successfully!');
    //     await this.router.navigate(['/homepage/Website/Salary_Slip_Request']);
    //   }
    // }
  };

  // for value 0 selected while click on Input //
  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  BackSalarySlipRequest = () => {
    this.router.navigate(['/homepage/Website/Salary_Slip_Request']);
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
