import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { CustomerEnquiry } from 'src/app/classes/domain/entities/website/customer_management/customerenquiry/customerenquiry';
import { CustomerFollowUp } from 'src/app/classes/domain/entities/website/customer_management/customerfollowup/customerfollowup';
import { City } from 'src/app/classes/domain/entities/website/masters/city/city';
import { Country } from 'src/app/classes/domain/entities/website/masters/country/country';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { Plot } from 'src/app/classes/domain/entities/website/masters/plot/plot';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { State } from 'src/app/classes/domain/entities/website/masters/state/state';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-customer-followup-details',
  templateUrl: './customer-followup-details.component.html',
  styleUrls: ['./customer-followup-details.component.scss'],
  standalone: false,
})
export class CustomerFollowupDetailsComponent  implements OnInit {
  Entity: CustomerFollowUp = CustomerFollowUp.CreateNewInstance();
  CustomerEnquiryEntity: CustomerEnquiry = CustomerEnquiry.CreateNewInstance();
  Plotheaders: string[] = ['Sr.No.', 'Plot No', 'Area in sqm', 'Area in Sqft', 'Customer Status', 'Remark'];
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DisplayMasterList: Plot[] = [];
    IsDropdownDisabled: boolean = false;
    InitialEntity: CustomerFollowUp = null as any;
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
    EmployeeList: Employee[] = [];
    ContactModesList = DomainEnums.ContactModeList(true, '--Select Contact Mode --');
    LeadSourceList = DomainEnums.MarketingModesList(true, '--Select Lead Source --');
    CustomerStatusList = DomainEnums.CustomerStatusList(true, '--Select Customer Status --');
    companyRef = this.companystatemanagement.SelectedCompanyRef;
    showAgentBrokerInput: boolean = false;

    onLeadSourceChange(selectedValue: number) {
      // Check if the selected value is AgentBroker (50)
      if (selectedValue === 50) {
        this.showAgentBrokerInput = true;
      } else {
        this.showAgentBrokerInput = false;
      }
    }
  
    constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils, private companystatemanagement: CompanyStateManagement) { }
  
    async ngOnInit() {
      this.appStateManage.setDropdownDisabled(true);
      this.CountryList = await Country.FetchEntireList();
      this.EmployeeList = await Employee.FetchEntireList();
      // this.getSiteListByCompanyRef()
      // Check if CountryRef is already set (e.g., India is preselected)
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
         this.IsNewEntity = false;
         this.Entity = CustomerFollowUp.GetCurrentInstance();
         this.CustomerEnquiryEntity = CustomerEnquiry.GetCurrentInstance();
         console.log('Entity :', this.Entity);
         console.log('CustomerEnquiryEntity :', this.CustomerEnquiryEntity);
         this.appStateManage.StorageKey.removeItem('Editable');
        } else {
          this.Entity = CustomerFollowUp.CreateNewInstance();
          CustomerFollowUp.SetCurrentInstance(this.Entity);
        }
        this.InitialEntity = Object.assign(
          CustomerFollowUp.CreateNewInstance(),
          this.utils.DeepCopy(this.Entity)
        ) as CustomerFollowUp;
        // this.focusInput();
    }
  
    // For country, state, city dropdowns
    getStateListByCountryRef = async (CountryRef: number) => {
      this.StateList = [];
      this.CityList = [];
  
      if (CountryRef) {
        // Reset StateRef and CityRef immediately when CountryRef changes
        this.CustomerEnquiryEntity.p.StateRef = 0;
        this.CustomerEnquiryEntity.p.CityRef = 0;
  
        let lst = await State.FetchEntireListByCountryRef(
          CountryRef,
          async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg)
        );
  
        this.StateList = lst;
  
        // Update CountryRef AFTER fetching data
        this.CustomerEnquiryEntity.p.CountryRef = CountryRef;
      } else {
        // Clear selections if country is cleared
        this.CustomerEnquiryEntity.p.StateRef = 0;
        this.CustomerEnquiryEntity.p.CityRef = 0;
      }
    }
  
    getCityListByStateRef = async (StateRef: number) => {
      this.CityList = [];
  
      if (StateRef) {
        // Reset CityRef immediately when StateRef changes
        this.CustomerEnquiryEntity.p.CityRef = 0;
  
        let lst = await City.FetchEntireListByStateRef(
          StateRef,
          async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg)
        );
  
        this.CityList = lst;
  
        // Update StateRef AFTER fetching data
        this.CustomerEnquiryEntity.p.StateRef = StateRef;
      } else {
        // Clear selection if state is cleared
        this.CustomerEnquiryEntity.p.CityRef = 0;
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
    }
  
    onPlotSelected(selectedvalue: any) {
      this.Entity.p.CustomerFollowUpPlotDetails = selectedvalue;
    }
  
    SaveCustomerFollowUp = async () => {
      let entityToSave = this.Entity.GetEditableVersion();
      let entitiesToSave = [entityToSave];
      this.Entity.p.ContactMode = this.CustomerEnquiryEntity.p.CustomerFollowUps[0].ContactMode;
      console.log('entitiesToSave:', entitiesToSave);
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
          this.Entity = CustomerFollowUp.CreateNewInstance();
        } else {
          await this.uiUtils.showSuccessToster('Customer Enquiry Updated successfully!');
        }
      }
    };
  
  
  
    BackCustomerFollowUp() {
      this.router.navigate(['/homepage/Website/Customer_FollowUp']);
    }
  
  }
  