import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ValidationMessages } from 'src/app/classes/domain/constants';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { FinancialYear } from 'src/app/classes/domain/entities/website/masters/financialyear/financialyear';
import { SalarySlipRequest } from 'src/app/classes/domain/entities/website/request/salarysliprequest/salarysliprequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BottomsheetMobileAppService } from 'src/app/services/bottomsheet-mobile-app.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-salary-slip-mobile-app',
  templateUrl: './add-salary-slip-mobile-app.component.html',
  styleUrls: ['./add-salary-slip-mobile-app.component.scss'],
  standalone:false
})
export class AddSalarySlipMobileAppComponent implements OnInit {
  public Entity: SalarySlipRequest = SalarySlipRequest.CreateNewInstance();
  public InitialEntity: SalarySlipRequest = null as any;
  public DetailsFormTitle: 'New Salary Slip Request' | 'Edit Salary Slip Request' = 'New Salary Slip Request';

  public isSaveDisabled = false;
  public EmployeeRef = 0;
  public SelectedMonth: any[] = [];
  public SelectedYear: any[] = [];
  public FinancialYearList: string[] = [];

  public RequiredFieldMsg = ValidationMessages.RequiredFieldMsg;
  public monthList = DomainEnums.MonthList();

  private IsNewEntity = true;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement,
    private bottomsheetMobileAppService: BottomsheetMobileAppService
  ) { }

  async ngOnInit(): Promise<void> {
    const editMode = this.appStateManage.StorageKey.getItem('Editable') === 'Edit';

    this.IsNewEntity = !editMode;
    this.DetailsFormTitle = editMode ? 'Edit Salary Slip Request' : 'New Salary Slip Request';

    if (editMode) {
      this.Entity = SalarySlipRequest.GetCurrentInstance();
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'));
      this.appStateManage.StorageKey.removeItem('Editable');
    } else {
      this.EmployeeRef = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'));
      this.Entity = SalarySlipRequest.CreateNewInstance();
      SalarySlipRequest.SetCurrentInstance(this.Entity);
      await this.getSingleEmployeeDetails();
      await this.getFinancialYearListByCompanyRef();
    }

    this.InitialEntity = Object.assign(
      SalarySlipRequest.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    );
  }

  private async getSingleEmployeeDetails(): Promise<void> {
    const companyRef = await this.companystatemanagement.SelectedCompanyRef();
    if (companyRef <= 0) {
      // await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }

    const employee = await Employee.FetchInstance(this.EmployeeRef, async (errMsg) =>
      await this.uiUtils.showErrorMessage('Error', errMsg)
    );

    this.Entity.p.EmployeeRef = employee.p.Ref;
    this.Entity.p.EmployeeName = employee.p.Name;
  }

  public async selectMonthBottomsheet(): Promise<void> {
    const options = this.monthList.map((item) => ({ p: item }));
    this.openSelectModal(options, this.SelectedMonth, true, 'Select Month', 3, (selected) => {
      this.SelectedMonth = selected;
      // console.log('selected :', selected.map(item => item.p.Ref));      
      this.Entity.p.SelectedMonths = selected.map(item => item.p.Ref);
      this.Entity.p.SelectedMonthsName = selected.map(item => item.p.Name);
    });
  }

  public async selectYearBottomsheet(): Promise<void> {
    const options = this.FinancialYearList.map(year => ({ p: { Ref: year, Name: year } }));
    this.openSelectModal(options, this.SelectedYear,false, 'Select Year',1, (selected) => {
      this.SelectedYear = selected;
      this.Entity.p.Year = selected[0]?.p?.Ref;
    });
  }

  // private async getFinancialYearListByCompanyRef(): Promise<void> {
  //   const companyRef = this.companystatemanagement.SelectedCompanyRef();
  //   if (companyRef <= 0) {
  //     await this.uiUtils.showErrorToster('Company not Selected');
  //     return;
  //   }

  //   const lst = await FinancialYear.FetchEntireListByCompanyRef(companyRef, async errMsg =>
  //     await this.uiUtils.showErrorMessage('Error', errMsg)
  //   );

  //   const years = lst.flatMap(item => [
  //     item.p.FromDate.substring(0, 4),
  //     item.p.ToDate.substring(0, 4)
  //   ]);

  //   this.FinancialYearList = Array.from(new Set(years)).sort();
  // }

    getFinancialYearListByCompanyRef = async () => {
      const companyRef = this.companystatemanagement.SelectedCompanyRef();
      this.FinancialYearList = [];
      if (companyRef <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }
      let lst = await FinancialYear.FetchEntireListByCompanyRef(companyRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
  
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

  private async openSelectModal(
    dataList: any[],
    selectedItems: any[],
    multiSelect: boolean,
    title: string,
    MaxSelection:number,
    updateCallback: (selected: any[]) => void
  ): Promise<void> {
    const selected = await this.bottomsheetMobileAppService.openSelectModal(dataList, selectedItems, multiSelect, title, MaxSelection);
    if (selected) updateCallback(selected);
  }

  public async SaveSalarySlipRequest(): Promise<void> {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();

    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
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
        await this.uiUtils.showSuccessToster('SalarySlipRequest Master saved successfully!');
        this.Entity = SalarySlipRequest.CreateNewInstance();
        this.resetForm();
        this.router.navigate(['/app_homepage/tabs/crm/attendance-management/leave-request']);
      }
    }
  }

  private resetForm(): void {
    this.SelectedMonth = [];
    this.SelectedYear = [];
    this.Entity = SalarySlipRequest.CreateNewInstance();
  }

  public goBack(): void {
    this.router.navigate(['app_homepage/tabs/attendance-management/salary-slip']);
  }
}
