import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { CustomerEnquiry } from 'src/app/classes/domain/entities/website/customer_management/customerenquiry/customerenquiry';
import { CustomerFollowUp } from 'src/app/classes/domain/entities/website/customer_management/customerfollowup/customerfollowup';
import {
  CustomerFollowUpPlotDetails,
  CustomerFollowUpPlotDetailsProps,
} from 'src/app/classes/domain/entities/website/customer_management/customerfollowupplotdetails/CustomerFollowUpPlotDetails';
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
  selector: 'app-customer-enquiry-details',
  templateUrl: './customer-enquiry-details.component.html',
  styleUrls: ['./customer-enquiry-details.component.scss'],
  standalone: false,
})
export class CustomerEnquiryDetailsComponent implements OnInit {
  Entity: CustomerEnquiry = CustomerEnquiry.CreateNewInstance();
  // CustomerPlotDetails: CustomerFollowUpPlotDetails = CustomerFollowUpPlotDetails.CreateNewInstance();
  // CustomerFollowUpEntity: CustomerFollowUp = CustomerFollowUp.CreateNewInstance();
  public IsNewEntity: boolean = true;
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
  EmployeeList: Employee[] = [];
  IsPlotDetails: boolean = false;
  InterestedPlotRef: number = 0;
  SiteManagementRef: number = 0;
  DetailsFormTitle: 'New Customer' | 'Edit Customer' = 'New Customer';

  MarketingModesList = DomainEnums.MarketingModesList(
    true,
    '--Select Modes Type--'
  );
  ContactModeList = DomainEnums.ContactModeList(
    true,
    '--Select Contact Type--'
  );
  CustomerStatusList = DomainEnums.CustomerStatusList(
    true,
    '--Select Customer Status--'
  );


  companyRef = this.companystatemanagement.SelectedCompanyRef;
  Plotheaders: string[] = [
    'Sr.No.',
    'Plot No',
    'Area in sqm',
    'Area in Sqft',
    'Customer Status',
    'Remark',
  ];

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement
  ) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.CountryList = await Country.FetchEntireList();
    this.StateList = await State.FetchEntireList();

    this.CityList = await City.FetchEntireList();
    this.getSiteListByCompanyRef();
    this.getEmployeeListByCompanyRef();

    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity
        ? 'New Customer'
        : 'Edit Customer';
      this.Entity = CustomerEnquiry.GetCurrentInstance();

      this.appStateManage.StorageKey.removeItem('Editable');
      this.IsPlotDetails = true;
      if (this.Entity.p.CountryRef) {
        this.StateList = this.StateList.filter(e => e.p.CountryRef == this.Entity.p.CountryRef)
        if (this.Entity.p.StateRef) {
          this.CityList = this.CityList.filter(e => e.p.StateRef == this.Entity.p.StateRef)
        }
      }

    } else {
      this.Entity = CustomerEnquiry.CreateNewInstance();
      CustomerEnquiry.SetCurrentInstance(this.Entity);
      // Check if CountryRef is already set (e.g., India is preselected)
      if (this.Entity.p.CountryRef) {
        // Load states for the preselected country
        await this.getStateListByCountryRef(this.Entity.p.CountryRef);
      }
    }
    this.InitialEntity = Object.assign(
      CustomerEnquiry.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as CustomerEnquiry;
    // this.focusInput();


  }

  // For country, state, city dropdowns
  getStateListByCountryRef = async (CountryRef: number) => {
    this.StateList = [];
    this.Entity.p.StateRef = 0;
    this.Entity.p.CityRef = 0;
    if (CountryRef) {
      let lst = await State.FetchEntireListByCountryRef(
        CountryRef,
        async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
      );

      this.StateList = lst;
      // console.log('StateList :', this.StateList);

      // Update CountryRef AFTER fetching data
      this.Entity.p.CountryRef = CountryRef;
    }
  };

  getCityListByStateRef = async (StateRef: number) => {
    this.CityList = [];
    this.Entity.p.CityRef = 0;
    if (StateRef) {
      // Reset CityRef immediately when StateRef changes
      let lst = await City.FetchEntireListByStateRef(
        StateRef,
        async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
      );

      this.CityList = lst;
      // console.log('CityList :', this.CityList);

      // Update StateRef AFTER fetching data
      this.Entity.p.StateRef = StateRef;
    } else {
      // Clear selection if state is cleared
      this.Entity.p.CityRef = 0;
    }
  };

  // for site and plot
  private getSiteListByCompanyRef = async () => {
    let lst = await Site.FetchEntireListByCompanyRef(
      this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.SiteList = lst;
  };
  // get employee list
  private getEmployeeListByCompanyRef = async () => {
    let lst = await Employee.FetchEntireListByCompanyRef(
      this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.EmployeeList = lst;
  };


  getPlotBySiteRefList = async (siteRef: number) => {
    if (siteRef <= 0) {
      await this.uiUtils.showWarningToster(`Please Select Site`);
      return;
    }
    this.InterestedPlotRef = 0;

    let lst = await Plot.FetchEntireListBySiteRef(
      siteRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.PlotList = lst;
    // this.DisplayMasterList = this.PlotList
    this.IsPlotDetails = true;
    // console.log('PlotList :', this.PlotList);
  };

  addDataToTable() {
    if (this.SiteManagementRef <= 0) {
      this.uiUtils.showWarningToster(`Please Select a Site`);
      return;
    }
    if (this.InterestedPlotRef <= 0) {
      this.uiUtils.showWarningToster(`Please Select a Plot`);
      return;
    }

    let selectedPlot = this.PlotList.find(
      (plot) => plot.p.Ref === this.InterestedPlotRef
    );
    let obj = CustomerFollowUpPlotDetails.CreateNewInstance();
    debugger
    if (selectedPlot) {
      obj.EnsurePrimaryKeysWithValidValues();
      obj.p.SiteRef = this.SiteManagementRef;
      obj.p.PlotRef = this.InterestedPlotRef;
      obj.p.PlotAreaInSqft = selectedPlot.p.AreaInSqft;
      obj.p.PlotAreaInSqm = selectedPlot.p.AreaInSqm;
    }

    // Check if the plot is already added
    const isAlreadyAdded = this.Entity.p.CustomerFollowUps[0].CustomerFollowUpPlotDetails.some(
      (plot) => plot.PlotRef === this.InterestedPlotRef);

    if (isAlreadyAdded) {
      this.uiUtils.showWarningToster(
        'This plot is already added to the table.'
      );
      return;
    }

    if (selectedPlot) {
      this.Entity.p.CustomerFollowUps[0].CustomerFollowUpPlotDetails.push(
        obj.p
      );
      this.IsPlotDetails = true;
      // console.log('Updated DisplayMasterList :', this.DisplayMasterList);
      this.SiteManagementRef = 0;
      this.InterestedPlotRef = 0;
    }
  }

  // On lead source broker selected
  showAgentBrokerInput: boolean = false;

  onLeadSourceChange(selectedValue: number) {
    // Check if the selected value is AgentBroker (50)
    if (selectedValue === 50) {
      this.showAgentBrokerInput = true;
    } else {
      this.showAgentBrokerInput = false;
    }
  }

  // onPlotSelected(selectedvalue: any) {
  //   this.Entity.p.CustomerFollowUpPlotDetails = selectedvalue;
  //   // console.log(this.Entity.p.MaterialSuppliedByVendors);
  // }

  SaveCustomerEnquiry = async () => {
    this.Entity.p.CompanyRef =
      this.companystatemanagement.getCurrentCompanyRef();

    this.Entity.p.CustomerFollowUps[0].Ref =
      await CustomerFollowUp.getPrimaryKeysWithValidValues();

    // Now, update the CustomerEnquiryRef in CustomerFollowUps
    this.Entity.p.CustomerFollowUps.forEach((followUp) => {
      followUp.CustomerEnquiryRef = this.Entity.p.Ref;

      // Update CustomerEnquiryFollowUpDetailsRef for each PlotDetail
      followUp.CustomerFollowUpPlotDetails.forEach((plotDetail) => {
        plotDetail.CustomerFollowUpRef = followUp.Ref;
      });
    });

    this.Entity.p.IsNewlyCreated = this.IsNewEntity;
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    // return;
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
        await this.uiUtils.showSuccessToster(
          'Customer Enquiry saved successfully!'
        );
        this.Entity = CustomerEnquiry.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster(
          'Customer Enquiry Updated successfully!'
        );
      }
    }
  };

  BackCustomerEnquiry() {
    this.router.navigate(['/homepage/Website/Customer_Enquiry']);
  }
}
