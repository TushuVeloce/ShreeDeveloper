import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingRemark, CustomerStatus, DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { CustomerEnquiry } from 'src/app/classes/domain/entities/website/customer_management/customerenquiry/customerenquiry';
import { CustomerFollowUp } from 'src/app/classes/domain/entities/website/customer_management/customerfollowup/customerfollowup';
import { CustomerFollowUpPlotDetails } from 'src/app/classes/domain/entities/website/customer_management/customerfollowupplotdetails/CustomerFollowUpPlotDetails';
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
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';

@Component({
  selector: 'app-customer-enquiry-details-mobile-app',
  templateUrl: './customer-enquiry-details-mobile-app.component.html',
  styleUrls: ['./customer-enquiry-details-mobile-app.component.scss'],
  standalone: false
})
export class CustomerEnquiryDetailsMobileAppComponent implements OnInit {
  Entity: CustomerEnquiry = CustomerEnquiry.CreateNewInstance();
  public IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  IsDropdownDisabled: boolean = false;
  // isLoading: boolean = false;
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
  localReminderDate: string | null = null;
  localOfficeVisitDate: string | null = null;
  localSiteVisitDate: string | null = null;
  InterestedPlotRef: number = 0;
  public InterestedPlotNo: string | null = null;
  SiteManagementRef: number = 0;
  SiteManagementName: string | null = null;
  today: string = new Date().toISOString().split('T')[0];
  DetailsFormTitle: 'New Customer Enquiry' | 'Edit Customer Enquiry' = 'New Customer Enquiry';
  public monthList = DomainEnums.MonthList();
  public SelectedMonth: any[] = [];
  public contactModeName: string | null = null;
  public contactModeNameInAgentBroker: string | null = null;
  public LeadHandleByName: string | null = null;
  public LeadSourceName: string | null = null;
  public CityName: string | null = null;
  public StateName: string | null = null;
  public CountryName: string | null = null;
  selectedCountry: any[] = [];
  selectedState: any[] = [];
  selectedCity: any[] = [];

  Date: string | null = null;
  DateWithTime: string | null = null;

  MarketingModesList = DomainEnums.MarketingModesList();
  ContactModeList = DomainEnums.ContactModeList();
  CustomerStatusList = DomainEnums.CustomerStatusList();

  companyRef: number = 0;

  constructor(
    private router: Router,
    // private uiUtils: UIUtils,
    private appStateManagement: AppStateManageService,
    private utils: Utils,
    private dtu: DTU,
    private datePipe: DatePipe,
    private companystatemanagement: CompanyStateManagement,
    private bottomsheetMobileAppService: BottomsheetMobileAppService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService
  ) { }
  async ngOnInit(): Promise<void> {
    await this.loadCustomerEnquiryIfEmployeeExists();
  }

  // ionViewWillEnter = async () => {
  //   await this.loadSalarySlipRequestsIfEmployeeExists();
  // };

  ngOnDestroy(): void {
    // cleanup logic if needed later
  }


  private async loadCustomerEnquiryIfEmployeeExists(): Promise<void> {
    try {
      // this.isLoading = true;
      await this.loadingService.show();
      this.companyRef = Number(this.appStateManagement.localStorage.getItem('SelectedCompanyRef'));
      this.appStateManagement.setDropdownDisabled(true);

      await this.FormulateCountryList();
      // Load State based on Default Country Ref
      if (this.Entity.p.CountryRef) {
        await this.getStateListByCountryRef(this.Entity.p.CountryRef);
      }

      // Load Cities based on Default State Ref
      if (this.Entity.p.StateRef) {
        await this.getCityListByStateRef(this.Entity.p.StateRef);
      }
      await this.getSiteListByCompanyRef();
      await this.getEmployeeListByCompanyRef();

      if (this.appStateManagement.StorageKey.getItem('Editable') == 'Edit') {
        this.IsNewEntity = false;
        this.DetailsFormTitle = this.IsNewEntity ? 'New Customer Enquiry' : 'Edit Customer Enquiry';
        this.Entity = CustomerEnquiry.GetCurrentInstance();
        console.log('this.Entity :', this.Entity);
        // Site Visit Date
        if (this.Entity.p.CustomerFollowUps[0].SiteVisitDate != '') {
          // While Edit Converting date String into Date Format //
          // convert  2025-02-23-00-00-00-000 to 2025-02-23
          this.localSiteVisitDate = this.dtu.ConvertStringDateToShortFormat(
            this.Entity.p.CustomerFollowUps[0].SiteVisitDate
          );
        }

        // Office Visit Date
        if (this.Entity.p.CustomerFollowUps[0].OfficeVisitDate) {
          // While Edit Converting date String into Date Format //
          this.localOfficeVisitDate = this.dtu.ConvertStringDateToShortFormat(
            this.Entity.p.CustomerFollowUps[0].OfficeVisitDate
          );
          // this.localOfficeVisitDate = this.datePipe.transform(
          //   this.dtu.FromString(this.Entity.p.OfficeVisitDate),
          //   'yyyy-MM-dd'
          // );
        }

        // Reminde Date
        if (this.Entity.p.CustomerFollowUps[0].ReminderDate) {
          this.localReminderDate = this.dtu.ConvertStringDateToShortFormat(
            this.Entity.p.CustomerFollowUps[0].ReminderDate
          );
          // this.localReminderDate = this.datePipe.transform(
          //   this.dtu.FromString(this.Entity.p.ReminderDate),
          //   'yyyy-MM-dd'
          // );
        }

        this.appStateManagement.StorageKey.removeItem('Editable');
        this.IsPlotDetails = true;
        if (this.Entity.p.CountryRef) {
          this.StateList = this.StateList.filter(
            (e) => e.p.CountryRef == this.Entity.p.CountryRef
          );
          if (this.Entity.p.StateRef) {
            this.CityList = this.CityList.filter(
              (e) => e.p.StateRef == this.Entity.p.StateRef
            );
          }
        }
        this.selectedCountry = [{ p: { Ref: this.Entity.p.CountryRef, Name: this.Entity.p.CountryName } }];
        this.CountryName = this.selectedCountry[0].p.Name;
        this.getStateListByCountryRef(this.Entity.p.CountryRef);
        this.selectedState = [{ p: { Ref: this.Entity.p.StateRef, Name: this.Entity.p.StateName } }];
        this.StateName = this.selectedState[0].p.Name;
        this.getCityListByStateRef(this.Entity.p.StateRef);
        this.selectedCity = [{ p: { Ref: this.Entity.p.CityRef, Name: this.Entity.p.CityName } }];
        this.CityName = this.selectedCity[0].p.Name;
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

      if (this.Entity.p.CustomerFollowUps[0].TransDateTime.trim().length <= 0) {
        let strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();

        // this.BillDate = this.datePipe.transform(this.dtu.FromString(strCDT), 'yyyy-MM-dd');
        this.Date = strCDT.substring(0, 10);
        this.DateWithTime = strCDT;
      } else {
        this.Date = this.datePipe.transform(
          this.dtu.FromString(this.Entity.p.CustomerFollowUps[0].TransDateTime),
          'yyyy-MM-dd'
        );
        this.Date = this.Entity.p.CustomerFollowUps[0].TransDateTime.substring(
          0,
          10
        );
        this.DateWithTime = this.Entity.p.CustomerFollowUps[0].TransDateTime;
      }
    } catch (error) {


    } finally {
      // this.isLoading = false;
      await this.loadingService.hide();
    }
  }
  public async selectCountryBottomsheet(): Promise<void> {
    try {
      const options = this.CountryList;
      this.openSelectModal(options, this.selectedCountry, false, 'Select Country', 1, (selected) => {
        this.selectedCountry = selected;

        this.Entity.p.CountryRef = selected[0].p.Ref;
        this.CountryName = selected[0].p.Name;
        this.getStateListByCountryRef(selected[0].p.Ref)
      });
    } catch (error) {

    }
  }

  public async selectStateBottomsheet(): Promise<void> {
    try {
      // Filter the list before mapping
      // const filteredList = this.CustomerStatusList.filter(
      //   (item) => item.Ref !== CustomerStatus.ConvertToDeal && item.Ref !== CustomerStatus.LeadClosed
      // );

      // const options = this.MarketingModesList.map((item) => ({ p: item }));
      const options = this.StateList;

      // let selectData: any[] = [];

      this.openSelectModal(options, this.selectedState, false, 'Select State', 1, (selected) => {
        this.selectedState = selected;

        this.Entity.p.StateRef = selected[0].p.Ref;
        this.StateName = selected[0].p.Name;
        this.getCityListByStateRef(selected[0].p.Ref)
      });
    } catch (error) {

    }
  }

  public async selectCityBottomsheet(): Promise<void> {
    try {
      // Filter the list before mapping
      // const filteredList = this.CustomerStatusList.filter(
      //   (item) => item.Ref !== CustomerStatus.ConvertToDeal && item.Ref !== CustomerStatus.LeadClosed
      // );

      // const options = this.MarketingModesList.map((item) => ({ p: item }));
      const options = this.CityList;

      // let selectData: any[] = [];

      this.openSelectModal(options, this.selectedCity, false, 'Select City', 1, (selected) => {
        this.selectedCity = selected;

        this.Entity.p.CityRef = selected[0].p.Ref;
        this.CityName = selected[0].p.Name;
      });
    } catch (error) {

    }
  }

  public async selectInterestedSiteBottomsheet(): Promise<void> {
    try {
      // Filter the list before mapping
      // const filteredList = this.CustomerStatusList.filter(
      //   (item) => item.Ref !== CustomerStatus.ConvertToDeal && item.Ref !== CustomerStatus.LeadClosed
      // );

      // const options = this.MarketingModesList.map((item) => ({ p: item }));
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
      if (this.SiteManagementRef <= 0) {
        // this.uiUtils.showWarningToster(`Please Select a Site`);
        await this.toastService.present('Please Select a Site', 1000, 'danger');
        await this.haptic.error();
        return;
      }
      const options = this.PlotList;

      let selectData: any[] = [];

      this.openSelectModal(options, selectData, false, 'Select Interested Plots', 1, (selected) => {
        selectData = selected;

        this.InterestedPlotRef = selected[0].p.Ref;
        this.InterestedPlotNo = selected[0].p.PlotNo;
      });
    } catch (error) {

    }
  }

  public async selectLeadSourceBottomsheet(): Promise<void> {
    try {
      // Filter the list before mapping
      // const filteredList = this.CustomerStatusList.filter(
      //   (item) => item.Ref !== CustomerStatus.ConvertToDeal && item.Ref !== CustomerStatus.LeadClosed
      // );

      const options = this.MarketingModesList.map((item) => ({ p: item }));

      let selectData: any[] = [];

      this.openSelectModal(options, selectData, false, 'Select Lead Source', 1, (selected) => {
        selectData = selected;

        this.Entity.p.CustomerFollowUps[0].LeadSource = selected[0].p.Ref;
        this.LeadSourceName = selected[0].p.Name;
        this.onLeadSourceChange(selected[0].p.Ref)
      });
    } catch (error) {

    }
  }
  public async selectLeadHandleByBottomsheet(): Promise<void> {
    try {
      // Filter the list before mapping
      // const filteredList = this.CustomerStatusList.filter(
      //   (item) => item.Ref !== CustomerStatus.ConvertToDeal && item.Ref !== CustomerStatus.LeadClosed
      // );

      // const options = this.ContactModeList.map((item) => ({ p: item }));
      const options = this.EmployeeList;

      let selectData: any[] = [];

      this.openSelectModal(options, selectData, false, 'Select Lead Handle By', 1, (selected) => {
        selectData = selected;

        this.Entity.p.CustomerFollowUps[0].LeadHandleBy = selected[0].p.Ref;
        this.LeadHandleByName = selected[0].p.Name;
      });
    } catch (error) {

    }
  }

  public async selectContactModeBottomsheet(): Promise<void> {
    try {
      // Filter the list before mapping
      // const filteredList = this.CustomerStatusList.filter(
      //   (item) => item.Ref !== CustomerStatus.ConvertToDeal && item.Ref !== CustomerStatus.LeadClosed
      // );

      const options = this.ContactModeList.map((item) => ({ p: item }));

      let selectData: any[] = [];

      this.openSelectModal(options, selectData, false, 'Select Contact Mode', 1, (selected) => {
        selectData = selected;

        this.Entity.p.CustomerFollowUps[0].ContactMode = selected[0].p.Ref;
        this.contactModeName = selected[0].p.Name;
      });
    } catch (error) {

    }
  }

  public async selectContactModeInAgentBrokerBottomsheet(): Promise<void> {
    try {
      // Filter the list before mapping
      // const filteredList = this.CustomerStatusList.filter(
      //   (item) => item.Ref !== CustomerStatus.ConvertToDeal && item.Ref !== CustomerStatus.LeadClosed
      // );

      const options = this.ContactModeList.map((item) => ({ p: item }));

      let selectData: any[] = [];

      this.openSelectModal(options, selectData, false, 'Select Contact Mode', 1, (selected) => {
        selectData = selected;

        this.Entity.p.CustomerFollowUps[0].ContactMode = selected[0].p.Ref;
        this.contactModeNameInAgentBroker = selected[0].p.Name;
      });
    } catch (error) {

    }
  }

  public async selectCustomerStatusBottomsheet(): Promise<void> {
    try {
      // Filter the list before mapping
      const filteredList = this.CustomerStatusList.filter(
        (item) => item.Ref !== CustomerStatus.ConvertToDeal && item.Ref !== CustomerStatus.LeadClosed
      );

      const options = filteredList.map((item) => ({ p: item }));

      let selectData: any[] = [];

      this.openSelectModal(options, selectData, false, 'Select Customer Status', 1, (selected) => {
        selectData = selected;

        this.Entity.p.CustomerFollowUps[0].CustomerStatusName = selected[0].p.Name;
        this.Entity.p.CustomerFollowUps[0].CustomerStatus = selected[0].p.Ref;
        this.onStatusChange(selected[0]?.p?.Ref);
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
  FormulateCountryList = async () => {
    this.CountryList = await Country.FetchEntireList(
      async (errMsg) => {
        // await this.uiUtils.showErrorMessage('Error', errMsg)
        await this.toastService.present('Error'+errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );

    // Set default country if exists
    if (this.CountryList.length) {
      const defaultCountry = this.CountryList.find(c => c.p.Ref === this.Entity.p.CountryRef);
      this.Entity.p.CountryRef = defaultCountry ? defaultCountry.p.Ref : this.CountryList[0].p.Ref;

      // Fetch the corresponding states
      await this.getStateListByCountryRef(this.Entity.p.CountryRef);
    }
  }

  getStateListByCountryRef = async (CountryRef: number) => {
    this.StateList = await State.FetchEntireListByCountryRef(
      CountryRef,
      async (errMsg) => {
        // await this.uiUtils.showErrorMessage('Error', errMsg)
        await this.toastService.present('Error' + errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );

    // Set default state if exists
    if (this.StateList.length) {
      const defaultState = this.StateList.find(s => s.p.Ref === this.Entity.p.StateRef);
      this.Entity.p.StateRef = defaultState ? defaultState.p.Ref : this.StateList[0].p.Ref;

      // Fetch the corresponding cities
      await this.getCityListByStateRef(this.Entity.p.StateRef);
    }
  }

  getCityListByStateRef = async (StateRef: number) => {
    this.CityList = await City.FetchEntireListByStateRef(
      StateRef,
      async (errMsg) => {
        // await this.uiUtils.showErrorMessage('Error', errMsg)
        await this.toastService.present('Error' + errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );

    // Set default city if exists
    if (this.CityList.length) {
      const defaultCity = this.CityList.find(c => c.p.Ref === this.Entity.p.CityRef);
      this.Entity.p.CityRef = defaultCity ? defaultCity.p.Ref : this.CityList[0].p.Ref;
    }
  }

  // for site and plot
  private getSiteListByCompanyRef = async () => {
    let lst = await Site.FetchEntireListByCompanyRef(
      this.companyRef,
      async (errMsg) => {
        // await this.uiUtils.showErrorMessage('Error', errMsg)
        await this.toastService.present('Error' + errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.SiteList = lst;
  };
  // get employee list
  private getEmployeeListByCompanyRef = async () => {
    let lst = await Employee.FetchEntireListByCompanyRef(
      this.companyRef,
      async (errMsg) => {
        // await this.uiUtils.showErrorMessage('Error', errMsg)
        await this.toastService.present('Error' + errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.EmployeeList = lst;
  };
  getPlotBySiteRefList = async (siteRef: number) => {
    if (siteRef <= 0) {
      // await this.uiUtils.showWarningToster(`Please Select Site`);
      await this.toastService.present('Please Select a Site', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    this.InterestedPlotRef = 0;
    // old code start
    // let bookingref = BookingRemark.Booked;
    // let lst = await Plot.FetchEntireListBySiteandbookingremarkRef(
    //   siteRef,
    //   bookingref,
    //   async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    // );
    // this.PlotList = lst;
    // old code End

    let lst = await Plot.FetchEntireListBySiteRef(
      siteRef,
      async (errMsg) => {
        // await this.uiUtils.showErrorMessage('Error', errMsg)
        await this.toastService.present('Error' + errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.PlotList = lst.filter(
      (plot) => plot.p.CurrentBookingRemark !== BookingRemark.Booked
    );


    // this.DisplayMasterList = this.PlotList
    // this.IsPlotDetails = true;
  };

  addDataToTable() {
    if (this.SiteManagementRef <= 0) {
      // this.uiUtils.showWarningToster(`Please Select a Site`);
      this.toastService.present('Please Select a Site', 1000, 'danger');
      this.haptic.error();
      return;
    }
    if (this.InterestedPlotRef <= 0) {
      // this.uiUtils.showWarningToster(`Please Select a Plot`);
      this.toastService.present('Please Select a Plot', 1000, 'danger');
      this.haptic.error();
      return;
    }

    let selectedPlot = this.PlotList.find(
      (plot) => plot.p.Ref === this.InterestedPlotRef
    );
    let obj = CustomerFollowUpPlotDetails.CreateNewInstance();
    if (selectedPlot) {
      obj.EnsurePrimaryKeysWithValidValues();
      obj.p.SiteRef = this.SiteManagementRef;
      obj.p.SiteName = this.SiteManagementName ?? '';
      obj.p.PlotRef = this.InterestedPlotRef;
      obj.p.PlotAreaInSqft = selectedPlot.p.AreaInSqft;
      obj.p.PlotAreaInSqm = selectedPlot.p.AreaInSqm;
    }

    // Check if the plot is already added
    const isAlreadyAdded =
      this.Entity.p.CustomerFollowUps[0].CustomerFollowUpPlotDetails.some(
        (plot) => plot.PlotRef === this.InterestedPlotRef
      );

    if (isAlreadyAdded) {
      // this.uiUtils.showWarningToster(
      //   'This plot is already added to the table.'
      // );
      this.toastService.present('This plot is already added to the table', 1000, 'danger');
      this.haptic.error();
      return;
    }

    if (selectedPlot) {
      this.Entity.p.CustomerFollowUps[0].CompanyRef =
        this.companystatemanagement.getCurrentCompanyRef();

      this.Entity.p.CustomerFollowUps[0].CustomerFollowUpPlotDetails.push(
        obj.p
      );
      this.IsPlotDetails = true;
      this.SiteManagementRef = 0;
      this.InterestedPlotRef = 0;
      this.SiteManagementName = '';
      this.InterestedPlotNo = '';
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
  // }
  selectedCustomerStatus: number = 0;
  isReminderRequired: boolean = false;
  reminderMessage: string = '';

  onStatusChange(selectedStatus: number) {
    this.selectedCustomerStatus = selectedStatus;

    // Reminder is required unless status is 30 (Lead Closed) or 40 (Convert To Deal)
    this.isReminderRequired = selectedStatus !== 30 && selectedStatus !== 40;

    if (this.isReminderRequired) {
      this.reminderMessage =
        "Reminder Date is required";
    } else {
      this.reminderMessage = ''; // No message needed if not required
    }
  }

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

    // if (this.Entity.p.CustomerFollowUps[0].CustomerStatus == 30 || this.Entity.p.CustomerFollowUps[0].CustomerStatus == 40) {
    //   this.Entity.p.CustomerFollowUps[0].ReminderDate = '';
    // }

    this.Entity.p.CustomerFollowUps[0].TransDateTime = this.DateWithTime!;
    this.Entity.p.CustomerFollowUps[0].SiteVisitDate =
      this.dtu.ConvertStringDateToFullFormat(this.localSiteVisitDate ? this.localSiteVisitDate : '');
    this.Entity.p.CustomerFollowUps[0].OfficeVisitDate =
      this.dtu.ConvertStringDateToFullFormat(this.localOfficeVisitDate ? this.localOfficeVisitDate : '');
    this.Entity.p.CustomerFollowUps[0].ReminderDate =
      this.dtu.ConvertStringDateToFullFormat(this.localReminderDate ? this.localReminderDate : '');

    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];

    // await this.Entity.EnsurePrimaryKeysWithValidValues()
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      // this.uiUtils.showErrorMessage('Error', tr.Message);
      await this.toastService.present('Error'+ tr.Message, 1000, 'danger');
      await this.haptic.error();
      return;
    } else {
      // this.onEntitySaved.emit(entityToSave);
      if (this.IsNewEntity) {
        // await this.uiUtils.showSuccessToster(
        //   'Customer Enquiry saved successfully'
        // );
        await this.toastService.present('Customer Enquiry saved successfully', 1000, 'success');
        await this.haptic.success();
        this.Entity = CustomerEnquiry.CreateNewInstance();
        this.router.navigate(['/mobile-app/tabs/dashboard/customer-relationship-management/customer-enquiry']);
      } else {
        // await this.uiUtils.showSuccessToster(
        //   'Customer Enquiry Updated successfully'
        // );
        await this.toastService.present('Customer Enquiry Updated successfully', 1000, 'success');
        await this.haptic.success();
        this.router.navigate(['/mobile-app/tabs/dashboard/customer-relationship-management/customer-enquiry']);
      }
    }
  };


  isDataFilled(): boolean {
    const emptyEntity = CustomerEnquiry.CreateNewInstance();
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
      // await this.uiUtils.showConfirmationMessage(
      //   'Warning',
      //   `You have unsaved data. Are you sure you want to go back? All data will be lost.`,
      //   async () => {
      //     this.router.navigate(['/mobile-app/tabs/dashboard/customer-relationship-management/customer-enquiry'], { replaceUrl: true });
      //   }
      // );
      this.alertService.presentDynamicAlert({
        header: 'Warnings',
        subHeader: 'Confirmation needed',
        message: 'You have unsaved data. Are you sure you want to go back? All data will be lost',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'custom-cancel',
            handler: () => {
              console.log('Deletion cancelled.');
            }
          },
          {
            text: 'Yes, Close',
            cssClass: 'custom-confirm',
            handler: async () => {
              try {
                  this.router.navigate(['/mobile-app/tabs/dashboard/customer-relationship-management/customer-enquiry'], { replaceUrl: true });
              } catch (err) {
                // console.error('Error deleting Customer Enquiry:', err);
                // await this.toastService.present('Failed to delete Customer Enquiry', 1000, 'danger');
                // await this.haptic.error();
              }
            }
          }
        ]
      });
    } else {
      this.router.navigate(['/mobile-app/tabs/dashboard/customer-relationship-management/customer-enquiry'], { replaceUrl: true });
    }
  }
}
