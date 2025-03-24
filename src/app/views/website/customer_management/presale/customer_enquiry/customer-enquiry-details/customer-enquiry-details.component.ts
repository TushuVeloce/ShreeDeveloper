import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { CustomerEnquiry } from 'src/app/classes/domain/entities/website/customer_management/customerenquiry/customerenquiry';
import { CustomerFollowUp } from 'src/app/classes/domain/entities/website/customer_management/customerfollowup/customerfollowup';
import { CustomerFollowUpPlotDetails } from 'src/app/classes/domain/entities/website/customer_management/customerfollowupplotdetails/CustomerFollowUpPlotDetails';
import { City } from 'src/app/classes/domain/entities/website/masters/city/city';
import { Country } from 'src/app/classes/domain/entities/website/masters/country/country';
import { Plot } from 'src/app/classes/domain/entities/website/masters/plot/plot';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { State } from 'src/app/classes/domain/entities/website/masters/state/state';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-customer-enquiry-details',
  templateUrl: './customer-enquiry-details.component.html',
  styleUrls: ['./customer-enquiry-details.component.scss'],
  standalone: false
})
export class CustomerEnquiryDetailsComponent implements OnInit {
  Entity: CustomerEnquiry = CustomerEnquiry.CreateNewInstance();
  // CustomerPlotDetails: CustomerFollowUpPlotDetails = CustomerFollowUpPlotDetails.CreateNewInstance();
  // CustomerFollowUpEntity: CustomerFollowUp = CustomerFollowUp.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  // DetailsFormTitle: 'New Employee' | 'Edit Employee' = 'New Employee';
  IsDropdownDisabled: boolean = false;
  InitialEntity: CustomerEnquiry = null as any;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  CountryList: Country[] = [];
  StateList: State[] = [];
  CityList: City[] = [];
  SiteList: Site[] = [];
  PlotList: Plot[] = [];
  IsPlotDetails: boolean = false;
  InterestedPlotRef: number = 0;
  SiteManagementRef: number = 0;

  MarketingModesList = DomainEnums.MarketingModesList(true, '--Select Modes Type--');

  DisplayMasterList: Plot[] = [];

  companyRef = this.companystatemanagement.SelectedCompanyRef;
  Plotheaders: string[] = ['Sr.No.', 'Plot No', 'Area in sqm', 'Area in Sqft', 'Customer Status', 'Remark'];


  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils, private companystatemanagement: CompanyStateManagement) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.CountryList = await Country.FetchEntireList();
    this.getSiteListByCompanyRef()
    // Check if CountryRef is already set (e.g., India is preselected)
    if (this.Entity.p.CountryRef) {
      // Load states for the preselected country
      await this.getStateListByCountryRef(this.Entity.p.CountryRef);
    }
  }

  // For country, state, city dropdowns
  getStateListByCountryRef = async (CountryRef: number) => {
    this.StateList = [];
    this.CityList = [];

    if (CountryRef) {
      // Reset StateRef and CityRef immediately when CountryRef changes
      this.Entity.p.StateRef = 0;
      this.Entity.p.CityRef = 0;

      let lst = await State.FetchEntireListByCountryRef(
        CountryRef,
        async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg)
      );

      this.StateList = lst;
      console.log('StateList :', this.StateList);

      // Update CountryRef AFTER fetching data
      this.Entity.p.CountryRef = CountryRef;
    } else {
      // Clear selections if country is cleared
      this.Entity.p.StateRef = 0;
      this.Entity.p.CityRef = 0;
    }
  }

  getCityListByStateRef = async (StateRef: number) => {
    this.CityList = [];

    if (StateRef) {
      // Reset CityRef immediately when StateRef changes
      this.Entity.p.CityRef = 0;

      let lst = await City.FetchEntireListByStateRef(
        StateRef,
        async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg)
      );

      this.CityList = lst;
      console.log('CityList :', this.CityList);

      // Update StateRef AFTER fetching data
      this.Entity.p.StateRef = StateRef;
    } else {
      // Clear selection if state is cleared
      this.Entity.p.CityRef = 0;
    }
  }

  // for site and plot 
  private getSiteListByCompanyRef = async () => {
    this.DisplayMasterList = [];
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
  }

  getPlotBySiteRefList = async (siteRef: number) => {
    if (siteRef <= 0) {
      await this.uiUtils.showWarningToster(`Please Select Site`);
      return
    }
    let lst = await Plot.FetchEntireListBySiteRef(siteRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.PlotList = lst;
    this.DisplayMasterList = this.PlotList
    this.IsPlotDetails = true;
    console.log('PlotList :', this.PlotList);
  }

  // onPlotSelected(selectedvalue: any) {
  //   this.Entity.p.CustomerFollowUpPlotDetails = selectedvalue;
  //   // console.log(this.Entity.p.MaterialSuppliedByVendors);
  // }

  SaveCustomerEnquiry = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    console.log('entitiesToSave :', entitiesToSave);
    // await this.Entity.EnsurePrimaryKeysWithValidValues()
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    } else {
      this.isSaveDisabled = false;
      // this.onEntitySaved.emit(entityToSave);
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Customer Enquiry saved successfully!');
        this.Entity = CustomerEnquiry.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster('Customer Enquiry Updated successfully!');
      }
    }
  };



  BackCustomerEnquiry() {
    this.router.navigate(['/homepage/Website/Customer_Enquiry']);
  }

}
