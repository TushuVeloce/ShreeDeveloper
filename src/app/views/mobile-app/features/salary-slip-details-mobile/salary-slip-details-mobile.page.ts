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
  selector: 'app-salary-slip-details-mobile',
  templateUrl: './salary-slip-details-mobile.page.html',
  styleUrls: ['./salary-slip-details-mobile.page.scss'],
  standalone: false
})
export class SalarySlipDetailsMobilePage implements OnInit {

  public Entity: SalarySlipRequest = SalarySlipRequest.CreateNewInstance();
  public InitialEntity: SalarySlipRequest = null as any;
  public DetailsFormTitle: 'New Salary Slip Request' | 'Edit Salary Slip Request' = 'New Salary Slip Request';

  public isSaveDisabled = false;
  public isLoading = false;
  public EmployeeRef = 0;
  public SelectedMonth: any[] = [];
  public SelectedYear: any[] = [];
  public FinancialYearList: string[] = [];

  public RequiredFieldMsg = ValidationMessages.RequiredFieldMsg;
  public monthList = DomainEnums.MonthList();
  private CompanyRef: number = 0;
  private CompanyName: string = '';

  private IsNewEntity = true;
  public isMonthInvalid = false;
  public isYearInvalid = false;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManagement: AppStateManageService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement,
    private bottomsheetMobileAppService: BottomsheetMobileAppService
  ) { }
  async ngOnInit(): Promise<void> {
    await this.loadSalarySlipRequestsIfEmployeeExists();
  }

  // ionViewWillEnter = async () => {
  //   await this.loadSalarySlipRequestsIfEmployeeExists();
  // };

  ngOnDestroy(): void {
    // cleanup logic if needed later
  }

  private async loadSalarySlipRequestsIfEmployeeExists(): Promise<void> {
    try {
      this.isLoading = true;
      this.CompanyRef = Number(this.appStateManagement.localStorage.getItem('SelectedCompanyRef'));
      this.CompanyName = this.companystatemanagement.getCurrentCompanyName();
      this.Entity.p.EmployeeRef = Number(this.appStateManagement.getEmployeeRef());
      if (this.Entity.p.EmployeeRef > 0) {
        const editMode = this.appStateManagement.localStorage.getItem('Editable') === 'Edit';

        this.IsNewEntity = !editMode;
        this.DetailsFormTitle = editMode ? 'Edit Salary Slip Request' : 'New Salary Slip Request';

        if (editMode) {
          this.Entity = SalarySlipRequest.GetCurrentInstance();
          this.Entity.p.UpdatedBy = Number(this.appStateManagement.localStorage.getItem('LoginEmployeeRef'));
          this.appStateManagement.localStorage.removeItem('Editable');
        } else {
          this.EmployeeRef = Number(this.appStateManagement.localStorage.getItem('LoginEmployeeRef'));
          this.Entity = SalarySlipRequest.CreateNewInstance();
          SalarySlipRequest.SetCurrentInstance(this.Entity);
          await this.getSingleEmployeeDetails();
          await this.getFinancialYearListByCompanyRef();
        }

        this.InitialEntity = Object.assign(
          SalarySlipRequest.CreateNewInstance(),
          this.utils.DeepCopy(this.Entity)
        );
      } else {
        await this.uiUtils.showErrorToster('Employee not selected');
      }
    } catch (error) {


    } finally {
      this.isLoading = false;
    }
  }

  private async getSingleEmployeeDetails(): Promise<void> {
    try {
      if (this.CompanyRef <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }

      const employee = await Employee.FetchInstance(this.EmployeeRef, this.CompanyRef, async (errMsg) =>
        await this.uiUtils.showErrorMessage('Error', errMsg)
      );

      console.log('employee :', employee);
      this.Entity.p.EmployeeRef = employee.p.Ref;
      this.Entity.p.EmployeeName = employee.p.Name;
    } catch (error) {

    }
  }

  public async selectMonthBottomsheet(): Promise<void> {
    try {
      // Filter the list before mapping
      // const filteredList = this.CustomerStatusList.filter(
      //   (item) => item.Ref !== CustomerStatus.ConvertToDeal && item.Ref !== CustomerStatus.LeadClosed
      // );

      const options = this.monthList.map((item) => ({ p: item }));

      // let selectData: any[] = [];

      this.openSelectModal(options, this.SelectedMonth, true, 'Select Leave Type', 3, (selected) => {
        this.SelectedMonth = selected;
        this.Entity.p.SelectedMonths = selected.map(item => item.p.Ref);
        this.Entity.p.SelectedMonthsName = selected.map(item => item.p.Name);
        // After the user selects months, update the invalid flag
        this.isMonthInvalid = this.Entity.p.SelectedMonthsName.length === 0;
      });
    } catch (error) {

    }
  }

  public async selectYearBottomsheet(): Promise<void> {
    try {
      // Filter the list before mapping
      // const filteredList = this.CustomerStatusList.filter(
      //   (item) => item.Ref !== CustomerStatus.ConvertToDeal && item.Ref !== CustomerStatus.LeadClosed
      // );

      const options = this.FinancialYearList.map(year => ({ p: { Ref: year, Name: year } }));
      // const options = this.monthList.map((item) => ({ p: item }));


      let selectData: any[] = [];

      this.openSelectModal(options, selectData, false, 'Select Year', 1, (selected) => {
        this.SelectedYear = selected;
        this.Entity.p.Year = selected[0]?.p?.Ref;
        // After the user selects year, update the invalid flag
        this.isYearInvalid = !this.Entity.p.Year;
      });
    } catch (error) {

    }
  }

  private async openSelectModal(
    dataList: any[],
    selectedItems: any[],
    multiSelect: boolean,
    title: string,
    MaxSelection: number,
    updateCallback: (selected: any[]) => void
  ): Promise<void> {
    const selected = await this.bottomsheetMobileAppService.openSelectModal(dataList, selectedItems, multiSelect, title, MaxSelection);
    if (selected) updateCallback(selected);
  }

  getFinancialYearListByCompanyRef = async () => {
    try {
      this.FinancialYearList = [];
      if (this.CompanyRef <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }
      let lst = await FinancialYear.FetchEntireListByCompanyRef(this.CompanyRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));

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
    } catch (error) {

    }
  }

  public async SaveSalarySlipRequest(): Promise<void> {
    try {
      this.isMonthInvalid = this.Entity.p.SelectedMonthsName.length === 0;
      this.isYearInvalid = !this.Entity.p.Year;

      if (this.isMonthInvalid || this.isYearInvalid) {
        // stop submission if invalid
        return;
      }
      this.isLoading = false;
      this.Entity.p.CompanyRef = this.CompanyRef;
      this.Entity.p.CompanyName = this.CompanyName;

      if (this.Entity.p.CreatedBy == 0) {
        this.Entity.p.CreatedBy = Number(this.appStateManagement.localStorage.getItem('LoginEmployeeRef'))
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
          await this.uiUtils.showSuccessToster('Salary Slip successfully');
          this.Entity = SalarySlipRequest.CreateNewInstance();
          this.resetForm();
          this.router.navigate(['mobileapp/tabs/attendance/salary-slip'], { replaceUrl: true });
        }
      }
    } catch (error) {

    } finally {
      this.isLoading = false;
    }
  }

  private resetForm(): void {
    this.SelectedMonth = [];
    this.SelectedYear = [];
    this.Entity = SalarySlipRequest.CreateNewInstance();
  }

 isDataFilled(): boolean {
      const emptyEntity = SalarySlipRequest.CreateNewInstance();
      console.log('emptyEntity :', emptyEntity);
      console.log('this Entity :', this.Entity);
      return !this.deepEqualIgnoringKeys(this.Entity, emptyEntity, []);
    }

    deepEqualIgnoringKeys(obj1: any, obj2: any, ignorePaths: string[]): boolean {
      const clean = (obj: any, path = ''): any => {
        if (obj === null || typeof obj !== 'object') return obj;

        const result: any = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
          const fullPath = path ? `${path}.${key}` : key;
          if (ignorePaths.includes(fullPath)) continue;
          result[key] = clean(obj[key], fullPath);
        }
        return result;
      };

      const cleanedObj1 = clean(obj1);
      const cleanedObj2 = clean(obj2);

      return JSON.stringify(cleanedObj1) === JSON.stringify(cleanedObj2);
    }

    goBack = async () => {
      // Replace this with your actual condition to check if data is filled
      const isDataFilled = this.isDataFilled(); // Implement this function based on your form

      if (isDataFilled) {
        await this.uiUtils.showConfirmationMessage(
          'Warning',
          `You have unsaved data. Are you sure you want to go back? All data will be lost.`,
          async () => {
            this.router.navigate(['/mobileapp/tabs/attendance/salary-slip'], { replaceUrl: true });
          }
        );
      } else {
        this.router.navigate(['/mobileapp/tabs/attendance/salary-slip'], { replaceUrl: true });
      }
    }

}
