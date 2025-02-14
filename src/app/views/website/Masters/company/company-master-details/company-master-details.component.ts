import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { City } from 'src/app/classes/domain/entities/website/masters/city/city';
import { Company } from 'src/app/classes/domain/entities/website/masters/company/company';
import { Country } from 'src/app/classes/domain/entities/website/masters/country/country';
import { State } from 'src/app/classes/domain/entities/website/masters/state/state';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';


@Component({
  selector: 'app-company-master-details',
  standalone: false,
  templateUrl: './company-master-details.component.html',
  styleUrls: ['./company-master-details.component.scss'],
})
export class CompanyMasterDetailsComponent implements OnInit {
  Entity: Company = Company.CreateNewInstance();
  CountryList: Country[] = [];
  StateList: State[] = [];
  CityList: City[] = [];
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Company' | 'Edit Company' = 'New Company';
  IsDropdownDisabled: boolean = false
  InitialEntity: Company = null as any;

  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils) { }

async ngOnInit() { 
    await this.FormulateCountryList();
     if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
       this.IsNewEntity = false;
       
       this.DetailsFormTitle = this.IsNewEntity ? 'New Company' : 'Edit Company';
       this.Entity = Company.GetCurrentInstance();
       this.appStateManage.StorageKey.removeItem('Editable')
 
     } else {
       this.Entity = Company.CreateNewInstance();
       Company.SetCurrentInstance(this.Entity);
      
     }
     this.InitialEntity = Object.assign(Company.CreateNewInstance(),
     this.utils.DeepCopy(this.Entity)) as Company;
     // this.focusInput();
   }

   private FormulateCountryList = async () => {
    this.CountryList = [];
    let lst = await Country.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.CountryList = lst;
  }

  getStateListByCountryRef = async (CountryRef: number) => {
    this.StateList = [];
    let lst = await State.FetchEntireListByCountryRef(CountryRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.StateList = lst;
  }

   getCityListByStateRef = async (StateRef: number) => {
    this.CityList = [];
    let lst = await City.FetchEntireListByStateRef(StateRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.CityList = lst;
      }

  SaveCompanyMaster = async () => {
    let entityToSave = this.Entity.GetEditableVersion();

    let entitiesToSave = [entityToSave]
    // await this.Entity.EnsurePrimaryKeysWithValidValues()
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);

    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorToster(tr.Message);
      return
    }
    else {
      this.isSaveDisabled = false;
      // this.onEntitySaved.emit(entityToSave);
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Company saved successfully!');
        this.Entity = Company.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster('Company Updated successfully!');
      }
    }
  }


  BackCompany() {
    this.router.navigate(['/homepage/Website/Company_Master']);
  }

}
