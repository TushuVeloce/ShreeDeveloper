import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { City } from 'src/app/classes/domain/entities/website/masters/city/city';
import { Country } from 'src/app/classes/domain/entities/website/masters/country/country';
import { Department } from 'src/app/classes/domain/entities/website/masters/department/department';
import { Designation } from 'src/app/classes/domain/entities/website/masters/designation/designation';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { State } from 'src/app/classes/domain/entities/website/masters/state/state';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-employee-master-details',
  standalone: false,
  templateUrl: './employee-master-details.component.html',
  styleUrls: ['./employee-master-details.component.scss'],
})
export class EmployeeMasterDetailsComponent implements OnInit {
  Entity: Employee = Employee.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Employee' | 'Edit Employee' = 'New Employee';
  IsDropdownDisabled: boolean = false;
  InitialEntity: Employee = null as any;
  CountryList: Country[] = [];
  StateList: State[] = [];
  CityList: City[] = [];
  DesignationList: Designation[] = [];
  DepartmentList: Department[] = [];
  GenderList = DomainEnums.GenderTypeList(true, '---Select Gender---');
  MaterialStatusList = DomainEnums.MaritalStatusesList(true, '---Select Material Status ---');
  MarketingModesList = DomainEnums.MarketingModesList();
  companyName = this.companystatemanagement.SelectedCompanyName;


  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,private companystatemanagement: CompanyStateManagement
  ) {}

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.DesignationList = await Designation.FetchEntireList();
    this.CountryList = await Country.FetchEntireList();
    this.DepartmentList = await Department.FetchEntireList();

    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;

      this.DetailsFormTitle = this.IsNewEntity
        ? 'New Employee'
        : 'Edit Employee';
      this.Entity = Employee.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');      
      if (this.Entity.p.CountryRef) {
        this.getStateListByCountryRef(this.Entity.p.CountryRef);
      }
      if (this.Entity.p.StateRef) {
        this.getCityListByStateRef(this.Entity.p.StateRef);
      }
    } else {
      this.Entity = Employee.CreateNewInstance();
      Employee.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(
      Employee.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as Employee;
    // this.focusInput();
  }

  getStateListByCountryRef = async (CountryRef: number) => {
    this.StateList = [];
    this.CityList = [];
  
    if (CountryRef) {
      if(CountryRef == 9163){
        this.Entity.p.StateRef = 10263
        this.Entity.p.CityRef = 10374
        this.getCityListByStateRef(10263)
      }
      let lst = await State.FetchEntireListByCountryRef(CountryRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.StateList = lst;
      if (CountryRef !== this.Entity.p.CountryRef) {
        // Reset StateRef and CityRef when country is changed
        this.Entity.p.StateRef = 0;
        this.Entity.p.CityRef = 0;
      }
    } else {
      // Clear selections if country is cleared
      this.Entity.p.StateRef = 0;
      this.Entity.p.CityRef = 0;
    }
  }
  
  getCityListByStateRef = async (StateRef: number) => {
    this.CityList = [];
  
    if (StateRef) {
      let lst = await City.FetchEntireListByStateRef(StateRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.CityList = lst;
  
      if (StateRef !== this.Entity.p.StateRef) {
        // Reset CityRef when state is changed
        this.Entity.p.CityRef = 0;
      }
    } else {
      // Clear selection if state is cleared
      this.Entity.p.CityRef = 0;
    }
  }

  SaveEmployeeMaster = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    console.log('entitiesToSave :', entitiesToSave);
    // await this.Entity.EnsurePrimaryKeysWithValidValues()
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error',tr.Message);
      return;
    } else {
      this.isSaveDisabled = false;
      // this.onEntitySaved.emit(entityToSave);
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Employee saved successfully!');
        this.Entity = Employee.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster('Employee Updated successfully!');
      }
    }
  };

  BackEmployee() {
    this.router.navigate(['/homepage/Website/Employee_Master']);
  }
}
