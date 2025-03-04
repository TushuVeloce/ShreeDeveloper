import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { City } from 'src/app/classes/domain/entities/website/masters/city/city';
import { Company } from 'src/app/classes/domain/entities/website/masters/company/company';
import { Country } from 'src/app/classes/domain/entities/website/masters/country/country';
import { Material } from 'src/app/classes/domain/entities/website/masters/material/material';
import { State } from 'src/app/classes/domain/entities/website/masters/state/state';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { VendorServices } from 'src/app/classes/domain/entities/website/masters/vendorservices/vendorservices';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';


@Component({
  selector: 'app-vendor-master-details',
  standalone: false,
  templateUrl: './vendor-master-details.component.html',
  styleUrls: ['./vendor-master-details.component.scss'],
})
export class VendorMasterDetailsComponent implements OnInit {

  isSaveDisabled: boolean = false;
  private IsNewEntity: boolean = true;
  Entity: Vendor = Vendor.CreateNewInstance();
  DetailsFormTitle: 'New Vendor' | 'Edit Vendor' = 'New Vendor';
  InitialEntity: Vendor = null as any;
  CompanyList: Company[] = [];
  companyName = this.companystatemanagement.SelectedCompanyName;
  CompanyTypeList = DomainEnums.CompanyTypeList(true, '--Select Company Type--');
  MaterialList: Material[] = [];
  ServiceList: VendorServices[] = [];

  CountryList: Country[] = [];
  StateList: State[] = [];
  CityList: City[] = [];
  // VendorServicesOptions: { label: string, value: number }[] = [];

  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils, private companystatemanagement: CompanyStateManagement) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.MaterialList = await Material.FetchEntireList();
    console.log(this.MaterialList);

    // if (this.VendorServicesList.length > 0) {
    //   this.VendorServicesOptions = this.VendorServicesList.map(item => ({
    //     label: item.p.Name, // Text displayed
    //     value: item.p.Ref   // Value stored
    //   }));
    // }

    await this.FormulateCountryList();

    // Load State based on Default Country Ref
    if (this.Entity.p.CountryRef) {
      await this.getStateListByCountryRef(this.Entity.p.CountryRef);
    }

    // Load Cities based on Default State Ref
    if (this.Entity.p.StateRef) {
      await this.getCityListByStateRef(this.Entity.p.StateRef);
    }

    this.CompanyList = await Company.FetchEntireList();
    console.log(this.CompanyList);

    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Vendor' : 'Edit Vendor';
      this.Entity = Vendor.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable')

    } else {
      this.Entity = Vendor.CreateNewInstance();
      Vendor.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(Vendor.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)) as Vendor;
  }

  async FormulateCountryList() {
    this.CountryList = await Country.FetchEntireList(
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );

    // Set default country if exists
    if (this.CountryList.length) {
      const defaultCountry = this.CountryList.find(c => c.p.Ref === this.Entity.p.CountryRef);
      this.Entity.p.CountryRef = defaultCountry ? defaultCountry.p.Ref : this.CountryList[0].p.Ref;

      // Fetch the corresponding states
      await this.getStateListByCountryRef(this.Entity.p.CountryRef);
    }
  }

  async getCityListByStateRef(StateRef: number) {
    this.CityList = await City.FetchEntireListByStateRef(
      StateRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );

    // Set default city if exists
    if (this.CityList.length) {
      const defaultCity = this.CityList.find(c => c.p.Ref === this.Entity.p.CityRef);
      this.Entity.p.CityRef = defaultCity ? defaultCity.p.Ref : this.CityList[0].p.Ref;
    }
  }

  async getStateListByCountryRef(CountryRef: number) {
    this.StateList = await State.FetchEntireListByCountryRef(
      CountryRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );

    // Set default state if exists
    if (this.StateList.length) {
      const defaultState = this.StateList.find(s => s.p.Ref === this.Entity.p.StateRef);
      this.Entity.p.StateRef = defaultState ? defaultState.p.Ref : this.StateList[0].p.Ref;

      // Fetch the corresponding cities
      await this.getCityListByStateRef(this.Entity.p.StateRef);
    }
  }
  onVendorServicesChange(selectedvalue: any) {
    this.Entity.p.MaterialListSuppliedByVendor = selectedvalue;
    console.log(this.Entity.p.MaterialListSuppliedByVendor);
  }

  SaveVendorMaster = async () => {

    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
    let entityToSave = this.Entity.GetEditableVersion();

    let entitiesToSave = [entityToSave]
    console.log(entitiesToSave);

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
        await this.uiUtils.showSuccessToster('Vendor saved successfully!');
        this.Entity = Vendor.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster('Vendor Updated successfully!');
      }
    }
  }

  BackVendor() {
    this.router.navigate(['/homepage/Website/Vendor_Master']);
  }


}
