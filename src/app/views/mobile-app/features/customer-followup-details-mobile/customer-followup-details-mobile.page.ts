import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingRemark, CustomerStatus, DomainEnums, MarketingModes } from 'src/app/classes/domain/domainenums/domainenums';
import { CustomerEnquiry } from 'src/app/classes/domain/entities/website/customer_management/customerenquiry/customerenquiry';
import { CustomerFollowUp } from 'src/app/classes/domain/entities/website/customer_management/customerfollowup/customerfollowup';
import { CustomerFollowUpPlotDetails, CustomerFollowUpPlotDetailsProps } from 'src/app/classes/domain/entities/website/customer_management/customerfollowupplotdetails/CustomerFollowUpPlotDetails';
import { City } from 'src/app/classes/domain/entities/website/masters/city/city';
import { Country } from 'src/app/classes/domain/entities/website/masters/country/country';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { Plot } from 'src/app/classes/domain/entities/website/masters/plot/plot';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { State } from 'src/app/classes/domain/entities/website/masters/state/state';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BottomsheetMobileAppService } from 'src/app/services/bottomsheet-mobile-app.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-customer-followup-details-mobile',
  templateUrl: './customer-followup-details-mobile.page.html',
  styleUrls: ['./customer-followup-details-mobile.page.scss'],
  standalone:false
})
export class CustomerFollowupDetailsMobilePage implements OnInit {

  Entity: CustomerFollowUp = CustomerFollowUp.CreateNewInstance();
  CustomerEnquiryEntity: CustomerEnquiry = CustomerEnquiry.CreateNewInstance();
  obj = CustomerFollowUpPlotDetails.CreateNewInstance();
  private IsNewEntity: boolean = true;
  DisplayMasterList: Plot[] = [];
  InitialEntity: CustomerFollowUp = null as any;
  todayDate: string = '';
  showAgentBrokerInput: boolean = false;
  isSaveDisabled: boolean = false;
  IsDropdownDisabled: boolean = false;
  isLoading: boolean = false;
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
  localReminderDate: string | null = null;
  localOfficeVisitDate: string | null = null;
  localSiteVisitDate: string | null = null;
  InterestedPlotRef: number = 0;
  public InterestedPlotNo: string | null = null;
  SiteManagementRef: number = 0;
  SiteManagementName: string | null = null;
  today: string = new Date().toISOString().split('T')[0];
  DetailsFormTitle: 'Customer FollowUp' = 'Customer FollowUp';
  public monthList = DomainEnums.MonthList();
  public SelectedMonth: any[] = [];
  public contactModeName: string | null = null;
  public contactModeNameInAgentBroker: string | null = null;
  public LeadHandleByName: string | null = null;
  public LeadSourceName: string | null = null;
  public CityName: string | null = null;
  public StateName: string | null = null;
  public CountryName: string | null = null;
  CustomerStatuscode = CustomerStatus

  Date: string | null = null;
  DateWithTime: string | null = null;
  LeadSourceList = DomainEnums.MarketingModesList();
  ContactModesList = DomainEnums.ContactModeList();
  CustomerStatusList = DomainEnums.CustomerStatusList();
  companyRef: number = 0
  selectedContactMode: any[] = [];
  selectedLeadSource: any[] = [];
  selectedLeadHandleBy: any[] = [];
  selectedCustomerStatus: any[] = [];


  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private dtu: DTU,
    private datePipe: DatePipe,
    private companystatemanagement: CompanyStateManagement,
    private bottomsheetMobileAppService: BottomsheetMobileAppService,
  ) { }
  async ngOnInit(): Promise<void> {
    await this.loadCustomerFollowUpIfEmployeeExists();
  }

  // ionViewWillEnter = async () => {
  //   await this.loadSalarySlipRequestsIfEmployeeExists();
  // };

  ngOnDestroy(): void {
    // cleanup logic if needed later
  }

  // private async loadCustomerFollowUpIfEmployeeExists(): Promise<void> {
  //   try {
  //     this.isLoading = true;
  //     this.appStateManage.setDropdownDisabled(true);
  //        this.CountryList = await Country.FetchEntireList();
  //        this.EmployeeList = await Employee.FetchEntireList();

  //          await this.getSiteListByCompanyRef();
  //        // Check if CountryRef is already set (e.g., India is preselected)
  //        if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
  //          this.IsNewEntity = false;
  //          this.Entity = CustomerFollowUp.GetCurrentInstance();
  //          // Reset Required Entities
  //          this.Entity.p.ReminderDate = '';
  //          this.Entity.p.Reason = '';
  //          this.Entity.p.CustomerStatus = 0;
  //          this.Entity.p.ContactMode = 0;
  //          this.Entity.p.CustomerRequirement = '';

  //          //  this.CustomerEnquiryEntity = CustomerEnquiry.GetCurrentInstance();

  //          // While Edit Converting date String into Date Format //
  //          if (this.Entity.p.ReminderDate) {
  //            this.localReminderDate = this.dtu.ConvertStringDateToShortFormat(
  //              this.Entity.p.ReminderDate
  //            );
  //            // this.localReminderDate = this.datePipe.transform(
  //            //   this.dtu.FromString(this.Entity.p.ReminderDate),
  //            //   'yyyy-MM-dd'
  //            // );
  //          }

  //          if (this.Entity.p.SiteVisitDate != '') {
  //            // While Edit Converting date String into Date Format //
  //            // convert  2025-02-23-00-00-00-000 to 2025-02-23
  //            this.localSiteVisitDate = this.dtu.ConvertStringDateToShortFormat(
  //              this.Entity.p.SiteVisitDate
  //            );
  //          }
  //          //else this.localSiteVisitDate = this.dtu.ConvertStringDateToShortFormat(this.localSiteVisitDate)

  //          if (this.Entity.p.OfficeVisitDate) {
  //            // While Edit Converting date String into Date Format //
  //            this.localOfficeVisitDate = this.dtu.ConvertStringDateToShortFormat(
  //              this.Entity.p.OfficeVisitDate
  //            );
  //            // this.localOfficeVisitDate = this.datePipe.transform(
  //            //   this.dtu.FromString(this.Entity.p.OfficeVisitDate),
  //            //   'yyyy-MM-dd'
  //            // );
  //          }
  //          let plotDetailsArray: CustomerFollowUpPlotDetailsProps[] = [];
  //          plotDetailsArray = [...this.Entity.p.CustomerFollowUpPlotDetails];
  //          plotDetailsArray.forEach((e) => (e.Ref = 0));
  //          this.Entity.p.CustomerFollowUpPlotDetails = [];
  //          this.Entity.p.CustomerFollowUpPlotDetails = plotDetailsArray;
  //          this.appStateManage.StorageKey.removeItem('Editable');
  //        } else {
  //          this.Entity = CustomerFollowUp.CreateNewInstance();
  //          CustomerFollowUp.SetCurrentInstance(this.Entity);
  //        }
  //        this.InitialEntity = Object.assign(
  //          CustomerFollowUp.CreateNewInstance(),
  //          this.utils.DeepCopy(this.Entity)
  //        ) as CustomerFollowUp;
  //        // this.focusInput();

  //        if (this.Entity.p.TransDateTime.trim().length <= 0) {
  //          let strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();

  //          // this.BillDate = this.datePipe.transform(this.dtu.FromString(strCDT), 'yyyy-MM-dd');
  //          this.Date = strCDT.substring(0, 10);
  //          this.DateWithTime = strCDT;
  //        } else {
  //          this.Date = this.datePipe.transform(
  //            this.dtu.FromString(this.Entity.p.TransDateTime),
  //            'yyyy-MM-dd'
  //          );
  //          this.Date = this.Entity.p.TransDateTime.substring(
  //            0,
  //            10
  //          );
  //          this.DateWithTime = this.Entity.p.TransDateTime;
  //     }
  //   } catch (error) {


  //   } finally {
  //     this.isLoading = false;
  //   }
  // }

  private async loadCustomerFollowUpIfEmployeeExists(): Promise<void> {
    try {
      this.isLoading = true;
      this.appStateManage.setDropdownDisabled(true);
      this.companyRef = Number(this.appStateManage.StorageKey.getItem('SelectedCompanyRef'));
      this.getEmployeeListByCompanyRef()
      this.getSiteListByCompanyRef();
      // Check if CountryRef is already set (e.g., India is preselected)
      if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
        this.IsNewEntity = false;
        this.Entity = CustomerFollowUp.GetCurrentInstance();
        console.log('this.Entity :', this.Entity);
        // Reset Required Entities
        this.Entity.p.ReminderDate = '';
        this.Entity.p.Reason = '';
        this.Entity.p.CustomerStatus = 0;
        this.Entity.p.ContactMode = 0;
        this.Entity.p.CustomerRequirement = '';

        // While Edit Converting date String into Date Format //
        if (this.Entity.p.ReminderDate) {
          this.localReminderDate = this.dtu.ConvertStringDateToShortFormat(
            this.Entity.p.ReminderDate
          );
        }

        if (this.Entity.p.SiteVisitDate != '') {
          // While Edit Converting date String into Date Format //
          // convert  2025-02-23-00-00-00-000 to 2025-02-23
          this.localSiteVisitDate = this.dtu.ConvertStringDateToShortFormat(
            this.Entity.p.SiteVisitDate
          );
        }
        if (this.Entity.p.OfficeVisitDate) {
          // While Edit Converting date String into Date Format //
          this.localOfficeVisitDate = this.dtu.ConvertStringDateToShortFormat(
            this.Entity.p.OfficeVisitDate
          );
        }
        this.selectedContactMode = [{ p: { Ref: this.Entity.p.ContactMode, Name: this.Entity.p.ContactMode } }];
        this.selectedLeadSource = [{ p: { Ref: this.Entity.p.LeadSource, Name: this.Entity.p.LeadSource } }];
        this.selectedCustomerStatus = [{ p: { Ref: this.Entity.p.CustomerStatus, Name: this.Entity.p.CustomerStatusName } }];
        this.selectedLeadHandleBy = [{ p: { Ref: this.Entity.p.LeadHandleBy, Name: this.Entity.p.LeadHandleBy } }];

        let plotDetailsArray: CustomerFollowUpPlotDetailsProps[] = [];
        plotDetailsArray = [...this.Entity.p.CustomerFollowUpPlotDetails];
        plotDetailsArray.forEach((e) => (e.Ref = 0));
        this.Entity.p.CustomerFollowUpPlotDetails = [];
        this.Entity.p.CustomerFollowUpPlotDetails = plotDetailsArray;
        this.appStateManage.StorageKey.removeItem('Editable');
      } else {
        this.Entity = CustomerFollowUp.CreateNewInstance();
        CustomerFollowUp.SetCurrentInstance(this.Entity);
      }
      this.InitialEntity = Object.assign(
        CustomerFollowUp.CreateNewInstance(),
        this.utils.DeepCopy(this.Entity)
      ) as CustomerFollowUp;

      if (this.Entity.p.TransDateTime.trim().length <= 0) {
        let strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
        this.Date = strCDT.substring(0, 10);
        this.DateWithTime = strCDT;
      } else {
        this.Date = this.datePipe.transform(
          this.dtu.FromString(this.Entity.p.TransDateTime),
          'yyyy-MM-dd'
        );
        this.Date = this.Entity.p.TransDateTime.substring(
          0,
          10
        );
        this.DateWithTime = this.Entity.p.TransDateTime;
      }
    } catch (error) {

    } finally {
      this.isLoading = false;
    }
  }
  getEmployeeListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Employee.FetchEntireListByCompanyRef(this.companyRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.EmployeeList = lst;
  }

  public async selectContactModeBottomsheet(): Promise<void> {
    try {
      const options = this.ContactModesList.map((item) => ({ p: item }));

      // let selectData: any[] = [];

      this.openSelectModal(options, this.selectedContactMode, false, 'Select Contact Mode', 1, (selected) => {
        this.selectedContactMode = selected;

        this.Entity.p.ContactMode = selected[0].p.Ref;
        this.contactModeName = selected[0].p.Name;
      });
    } catch (error) {

    }
  }

  public async selectInterestedSiteBottomsheet(): Promise<void> {
    try {
      const options = this.SiteList;

      let selectData: any[] = [];

      this.openSelectModal(options, selectData, false, 'Select Interested Site', 1, (selected) => {
        selectData = selected;

        this.SiteManagementRef = selected[0].p.Ref;
        this.SiteManagementName = selected[0].p.Name;
        this.getPlotBySiteRefList(selected[0].p.Ref)
      });
    } catch (error) {

    }
  }
  public async selectInterestedPlotsBottomsheet(): Promise<void> {
    try {
      const options = this.PlotList;

      let selectData: any[] = [];

      this.openSelectModal(options, selectData, false, 'Select Interested Plots', 1, (selected) => {
        selectData = selected;

        this.InterestedPlotRef = selected[0].p.Ref;
        this.InterestedPlotNo = selected[0].p.Name;
      });
    } catch (error) {

    }
  }
  public async selectLeadSourceBottomsheet(): Promise<void> {
    try {
      const options = this.LeadSourceList.map((item) => ({ p: item }));
      // let selectData: any[] = [];
      this.openSelectModal(options, this.selectedLeadSource, false, 'Select Lead Source', 1, (selected) => {
        this.selectedLeadSource = selected;

        this.Entity.p.LeadSource = selected[0].p.Ref;
        this.LeadSourceName = selected[0].p.Name;
        this.onLeadSourceChange(selected[0].p.Ref)
      });
    } catch (error) {

    }
  }
  public async selectLeadHandleByBottomsheet(): Promise<void> {
    try {
      const options = this.EmployeeList;
      // let selectData: any[] = [];
      this.openSelectModal(options, this.selectedLeadHandleBy, false, 'Select Contact Mode', 1, (selected) => {
        this.selectedLeadHandleBy = selected;
        this.Entity.p.LeadHandleBy = selected[0].p.Ref;
        this.LeadHandleByName = selected[0].p.Name;
      });
    } catch (error) {

    }
  }
  public async selectCustomerStatusBottomsheet(): Promise<void> {
    try {
      const options = this.CustomerStatusList.map((item) => ({ p: item }));

      // let selectData: any[] = [];

      this.openSelectModal(options, this.selectedCustomerStatus, false, 'Select Customer Status', 1, (selected) => {
        this.selectedCustomerStatus = selected;

        this.Entity.p.CustomerStatusName = selected[0].p.Name;
        this.Entity.p.CustomerStatus = selected[0].p.Ref;
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
        async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
      );

      this.StateList = lst;

      // Update CountryRef AFTER fetching data
      this.CustomerEnquiryEntity.p.CountryRef = CountryRef;
    } else {
      // Clear selections if country is cleared
      this.CustomerEnquiryEntity.p.StateRef = 0;
      this.CustomerEnquiryEntity.p.CityRef = 0;
    }
  };

  getCityListByStateRef = async (StateRef: number) => {
    this.CityList = [];

    if (StateRef) {
      // Reset CityRef immediately when StateRef changes
      this.CustomerEnquiryEntity.p.CityRef = 0;

      let lst = await City.FetchEntireListByStateRef(
        StateRef,
        async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
      );

      this.CityList = lst;

      // Update StateRef AFTER fetching data
      this.CustomerEnquiryEntity.p.StateRef = StateRef;
    } else {
      // Clear selection if state is cleared
      this.CustomerEnquiryEntity.p.CityRef = 0;
    }
  };

  // for site and plot
  private getSiteListByCompanyRef = async () => {
    let lst = await Site.FetchEntireListByCompanyRef(
      this.companyRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.SiteList = lst;
  };

  getPlotBySiteRefList = async (siteRef: number) => {
    if (siteRef <= 0) {
      await this.uiUtils.showWarningToster(`Please Select Site`);
      return;
    }
    let lst = await Plot.FetchEntireListBySiteRef(
      siteRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.PlotList = lst.filter((plot) => plot.p.CurrentBookingRemark !== BookingRemark.Booked);


    this.DisplayMasterList = this.PlotList;
    this.IsPlotDetails = true;
  };

  addDataToCustomerFollowUpPlotDetail = () => {
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
    let selectedSite = this.SiteList.find(
      (site) => site.p.Ref === this.SiteManagementRef
    );
    let obj = CustomerFollowUpPlotDetails.CreateNewInstance();
    if (selectedPlot) {
      obj.p.SiteRef = this.SiteManagementRef;
      obj.p.PlotRef = this.InterestedPlotRef;
      obj.p.PlotAreaInSqft = selectedPlot.p.AreaInSqft;
      obj.p.PlotAreaInSqm = selectedPlot.p.AreaInSqm;
      obj.p.PlotName = selectedPlot.p.PlotNo;
      if (selectedSite) {
        obj.p.SiteName = selectedSite.p.Name;
      }
    }
    // Check if the plot is already added
    const isAlreadyAdded = this.Entity.p.CustomerFollowUpPlotDetails.some(
      (plot) => plot.PlotRef === this.InterestedPlotRef
    );
    if (isAlreadyAdded) {
      this.uiUtils.showWarningToster(
        'This plot is already added to the table.'
      );
      return;
    }

    if (selectedPlot) {
      this.Entity.p.CustomerFollowUpPlotDetails.push(...[obj.p]);
      this.IsPlotDetails = true;
      this.SiteManagementRef = 0;
      this.InterestedPlotRef = 0;
    }
  };
  GenerateCustomerFollowUpPlotDetailsRef = async () => {
    for (const obj of this.Entity.p.CustomerFollowUpPlotDetails) {
      obj.Ref =
        await CustomerFollowUpPlotDetails.getPrimaryKeysWithValidValues();
    }
  };

  onLeadSourceChange = (selectedValue: number) => {
    // Check if the selected value is AgentBroker (50)
    if (selectedValue === MarketingModes.AgentBoker) {
      this.showAgentBrokerInput = true;
    } else {
      this.showAgentBrokerInput = false;
    }
  };

  SaveCustomerFollowUp = async () => {
    this.Entity.p.LoginEmployeeRef = Number(
      this.appStateManage.StorageKey.getItem('LoginEmployeeRef')
    );
    this.Entity.p.CustomerFollowUpPlotDetails.forEach((plotDetail) => {
      plotDetail.Ref = 0;
    });
    let CurrentDateTime = await CurrentDateTimeRequest.GetCurrentDateTime();
    this.Entity.p.TransDateTime = CurrentDateTime;
    await this.GenerateCustomerFollowUpPlotDetailsRef();
    this.Entity.p.Ref = await CustomerFollowUp.getPrimaryKeysWithValidValues();

    // Update CustomerEnquiryFollowUpDetailsRef for each PlotDetail
    this.Entity.p.CustomerFollowUpPlotDetails.forEach((plotDetail) => {
      plotDetail.CustomerFollowUpRef = this.Entity.p.Ref;
    });
    this.Entity.p.IsNewlyCreated = this.IsNewEntity;
    // convert date 2025-02-23 to 2025-02-23-00-00-00-000
    this.Entity.p.SiteVisitDate = this.dtu.ConvertStringDateToFullFormat(
      this.localSiteVisitDate ? this.localSiteVisitDate : ''
    );
    this.Entity.p.OfficeVisitDate = this.dtu.ConvertStringDateToFullFormat(
      this.localOfficeVisitDate ? this.localOfficeVisitDate : ''
    );
    this.Entity.p.ReminderDate = this.dtu.ConvertStringDateToFullFormat(
      this.localReminderDate ? this.localReminderDate : ''
    );
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    } else {
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster(
          'Customer Enquiry saved successfully!'
        );
        this.Entity = CustomerFollowUp.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster(
          'Customer Enquiry Updated successfully!'
        );
        this.Entity = CustomerFollowUp.CreateNewInstance();
        this.router.navigate(['/homepage/Website/Customer_FollowUp']);
      }
    }
  };

  // public goBack(): void {
  //   this.router.navigate(['/app_homepage/tabs/crm/customer-follow-up'], { replaceUrl: true });
  // }

  isDataFilled(): boolean {
    const emptyEntity = CustomerFollowUp.CreateNewInstance();
    console.log('emptyEntity :', emptyEntity);
    console.log('this Entity :', this.Entity);
    return !this.deepEqualIgnoringKeys(this.Entity, emptyEntity,[]);
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
          this.router.navigate(['/app_homepage/tabs/crm/customer-follow-up'], { replaceUrl: true });
        }
      );
    } else {
      this.router.navigate(['/app_homepage/tabs/crm/customer-follow-up'], { replaceUrl: true });
    }
  }
}
