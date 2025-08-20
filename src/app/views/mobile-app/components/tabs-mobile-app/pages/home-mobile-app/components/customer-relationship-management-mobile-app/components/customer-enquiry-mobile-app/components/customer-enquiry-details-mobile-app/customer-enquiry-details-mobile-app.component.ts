import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingRemark, BookingRemarks, CustomerStatus, DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
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
import { DTU } from 'src/app/services/dtu.service';
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
  public SelectedCustomerStatus: any[] = [];
  public SelectedContactModeInAgentBroker: any[] = [];
  public SelectedContactMode: any[] = [];
  public SelectedLeadHandleBy: any[] = [];
  public SelectedLeadSource: any[] = [];
  public SelectedInterestedPlots: any[] = [];
  public SelectedInterestedSite: any[] = [];
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
    private appStateManagement: AppStateManageService,
    private utils: Utils,
    private dtu: DTU,
    private datePipe: DatePipe,
    private bottomsheetMobileAppService: BottomsheetMobileAppService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService
  ) { }
  ngOnInit = async () => {
    // await this.loadCustomerEnquiryIfEmployeeExists();
  }

  ionViewWillEnter = async () => {
    await this.loadCustomerEnquiryIfEmployeeExists();
  };

  ngOnDestroy(): void {
    // cleanup logic if needed later
  }


  private loadCustomerEnquiryIfEmployeeExists = async () => {
    try {
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
        }

        // Reminde Date
        if (this.Entity.p.CustomerFollowUps[0].ReminderDate) {
          this.localReminderDate = this.dtu.ConvertStringDateToShortFormat(
            this.Entity.p.CustomerFollowUps[0].ReminderDate
          );
        }
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
        this.appStateManagement.StorageKey.removeItem('Editable');

      } else {
        this.Entity = CustomerEnquiry.CreateNewInstance();
        CustomerEnquiry.SetCurrentInstance(this.Entity);
        // Check if CountryRef is already set (e.g., India is preselected)
        if (this.Entity.p.CountryRef) {
          // Load states for the preselected country
          this.CountryName = this.CountryList.find(item => item.p.Ref == this.Entity.p.CountryRef)?.p.Name ?? '';
          this.selectedCountry = [{ p: { Ref: this.Entity.p.CountryRef, Name: this.CountryName } }];
          await this.getStateListByCountryRef(this.Entity.p.CountryRef);
          this.StateName = this.StateList.find(item => item.p.Ref == this.Entity.p.StateRef)?.p.Name ?? '';
          this.selectedState = [{ p: { Ref: this.Entity.p.StateRef, Name: this.StateName } }];
          await this.getCityListByStateRef(this.Entity.p.StateRef);
          this.CityName = this.CityList.find(item => item.p.Ref == this.Entity.p.CityRef)?.p.Name ?? '';
          this.selectedCity = [{ p: { Ref: this.Entity.p.CityRef, Name: this.CityName } }];
        }
      }
      this.InitialEntity = Object.assign(
        CustomerEnquiry.CreateNewInstance(),
        this.utils.DeepCopy(this.Entity)
      ) as CustomerEnquiry;

      if (this.Entity.p.CustomerFollowUps[0].TransDateTime.trim().length <= 0) {
        let strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
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
      await this.loadingService.hide();
    }
  }
  public selectCountryBottomsheet = async (): Promise<void> => {
    try {
      const options = this.CountryList;
      this.openSelectModal(options, this.selectedCountry, false, 'Select Country', 1, (selected) => {
        this.selectedCountry = selected;
        this.Entity.p.CountryRef = selected[0].p.Ref;
        this.CountryName = selected[0].p.Name;
        this.selectedState = [];
        this.StateList = [];
        this.StateName = '';
        this.Entity.p.StateRef = 0;
        this.selectedCity = [];
        this.CityList = [];
        this.CityName = '';
        this.Entity.p.CityRef = 0;
        if (this.Entity.p.CountryRef > 0) {
          this.getStateListByCountryRef(this.Entity.p.CountryRef);
        }
      });
    } catch (error) {

    }
  }

  public selectStateBottomsheet = async (): Promise<void> => {
    try {
      const options = this.StateList;

      this.openSelectModal(options, this.selectedState, false, 'Select State', 1, (selected) => {
        this.selectedState = selected;
        this.Entity.p.StateRef = selected[0].p.Ref;
        this.StateName = selected[0].p.Name;
        this.selectedCity = [];
        this.CityList = [];
        this.CityName = '';
        this.Entity.p.CityRef = 0;
        if (this.Entity.p.StateRef > 0) {
          this.getCityListByStateRef(this.Entity.p.StateRef);
        }
      });
    } catch (error) {

    }
  }

  public selectCityBottomsheet = async (): Promise<void> => {
    try {
      const options = this.CityList;
      this.openSelectModal(options, this.selectedCity, false, 'Select City', 1, (selected) => {
        this.selectedCity = selected;
        this.Entity.p.CityRef = selected[0].p.Ref;
        this.CityName = selected[0].p.Name;
      });
    } catch (error) {

    }
  }

  public selectInterestedSiteBottomsheet = async (): Promise<void> => {
    try {
      const options = this.SiteList;
      this.openSelectModal(options, this.SelectedInterestedSite, false, 'Select Interested Site', 1, (selected) => {
        this.SelectedInterestedSite = selected;
        this.SiteManagementRef = selected[0].p.Ref;
        this.SiteManagementName = selected[0].p.Name;
        this.InterestedPlotRef = 0;
        this.InterestedPlotNo = null;
        this.SelectedInterestedPlots = [];
        this.PlotList = [];
        if (this.SiteManagementRef > 0) {
          this.getPlotBySiteRefList(this.SiteManagementRef)
        }
      });
    } catch (error) {

    }
  }

  public selectInterestedPlotsBottomsheet = async (): Promise<void> => {
    try {
      if (this.SiteManagementRef <= 0) {
        await this.toastService.present('Please Select a Plot', 1000, 'danger');
        await this.haptic.error();
        return;
      }
      // const options = this.PlotList;
      const options = this.PlotList.filter((plot) => plot.p.CurrentBookingRemark == BookingRemarks.Plot_Of_Owner || plot.p.CurrentBookingRemark == BookingRemarks.Plot_Of_Shree);
      this.openSelectModal(options, this.SelectedInterestedPlots, false, 'Select Interested Plots', 1, (selected) => {
        this.SelectedInterestedPlots = selected;
        this.InterestedPlotRef = selected[0].p.Ref;
        this.InterestedPlotNo = selected[0].p.PlotNo;
      });
    } catch (error) {

    }
  }

  public selectLeadSourceBottomsheet = async (): Promise<void> => {
    try {
      const options = this.MarketingModesList.map((item) => ({ p: item }));
      this.openSelectModal(options, this.SelectedLeadSource, false, 'Select Lead Source', 1, (selected) => {
        this.SelectedLeadSource = selected;
        this.Entity.p.CustomerFollowUps[0].LeadSource = selected[0].p.Ref;
        this.LeadSourceName = selected[0].p.Name;
        this.onLeadSourceChange(selected[0].p.Ref)
      });
    } catch (error) {

    }
  }
  public selectLeadHandleByBottomsheet = async (): Promise<void> => {
    try {
      const options = this.EmployeeList;
      this.openSelectModal(options, this.SelectedLeadHandleBy, false, 'Select Lead Handle By', 1, (selected) => {
        this.SelectedLeadHandleBy = selected;
        this.Entity.p.CustomerFollowUps[0].LeadHandleBy = selected[0].p.Ref;
        this.LeadHandleByName = selected[0].p.Name;
      });
    } catch (error) {

    }
  }

  public selectContactModeBottomsheet = async (): Promise<void> => {
    try {
      const options = this.ContactModeList.map((item) => ({ p: item }));
      this.openSelectModal(options, this.SelectedContactMode, false, 'Select Contact Mode', 1, (selected) => {
        this.SelectedContactMode = selected;
        this.Entity.p.CustomerFollowUps[0].ContactMode = selected[0].p.Ref;
        this.contactModeName = selected[0].p.Name;
      });
    } catch (error) {

    }
  }

  public selectContactModeInAgentBrokerBottomsheet = async (): Promise<void> => {
    try {
      const options = this.ContactModeList.map((item) => ({ p: item }));
      this.openSelectModal(options, this.SelectedContactModeInAgentBroker, false, 'Select Contact Mode', 1, (selected) => {
        this.SelectedContactModeInAgentBroker = selected;
        this.Entity.p.CustomerFollowUps[0].ContactMode = selected[0].p.Ref;
        this.contactModeNameInAgentBroker = selected[0].p.Name;
      });
    } catch (error) {

    }
  }

  public selectCustomerStatusBottomsheet = async (): Promise<void> => {
    try {
      // Filter the list before mapping
      const filteredList = this.CustomerStatusList.filter(
        (item) => item.Ref !== CustomerStatus.ConvertToDeal && item.Ref !== CustomerStatus.LeadClosed
      );
      const options = filteredList.map((item) => ({ p: item }));
      this.openSelectModal(options, this.SelectedCustomerStatus, false, 'Select Customer Status', 1, (selected) => {
        this.SelectedCustomerStatus = selected;
        this.Entity.p.CustomerFollowUps[0].CustomerStatusName = selected[0].p.Name;
        this.Entity.p.CustomerFollowUps[0].CustomerStatus = selected[0].p.Ref;
        if (this.Entity.p.CustomerFollowUps[0].CustomerStatus) {
          this.onStatusChange(this.Entity.p.CustomerFollowUps[0].CustomerStatus);
        }
      });
    } catch (error) { }
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
        await this.toastService.present(errMsg, 1000, 'danger');
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
        await this.toastService.present(errMsg, 1000, 'danger');
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
        await this.toastService.present(errMsg, 1000, 'danger');
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
        await this.toastService.present(errMsg, 1000, 'danger');
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
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.EmployeeList = lst;
  };
  getPlotBySiteRefList = async (siteRef: number) => {
    try {
      await this.loadingService.show();
      if (siteRef <= 0) {
        await this.toastService.present('Please Select a Site', 1000, 'danger');
        await this.haptic.error();
        return;
      }
      this.InterestedPlotRef = 0;

      let lst = await Plot.FetchEntireListBySiteRef(
        siteRef,
        async (errMsg) => {
          await this.toastService.present(errMsg, 1000, 'danger');
          await this.haptic.error();
        }
      );
      this.PlotList = lst.filter(
        (plot) => plot.p.CurrentBookingRemark !== BookingRemark.Booked
      );
    } catch (error) {

    } finally {
      await this.loadingService.hide();
    }
  };

  addDataToTable = () => {
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
      obj.p.PlotName = selectedPlot.p.PlotNo;
      obj.p.PlotAreaInSqft = selectedPlot.p.AreaInSqft;
      obj.p.PlotAreaInSqm = selectedPlot.p.AreaInSqm;
    }

    // Check if the plot is already added
    const isAlreadyAdded =
      this.Entity.p.CustomerFollowUps[0].CustomerFollowUpPlotDetails.some(
        (plot) => plot.PlotRef === this.InterestedPlotRef
      );

    if (isAlreadyAdded) {
      this.toastService.present('This plot is already added to the table', 1000, 'danger');
      this.haptic.error();
      return;
    }

    if (selectedPlot) {
      this.Entity.p.CustomerFollowUps[0].CompanyRef = this.companyRef;

      this.Entity.p.CustomerFollowUps[0].CustomerFollowUpPlotDetails.push(
        obj.p
      );
      this.IsPlotDetails = true;
      this.SiteManagementRef = 0;
      this.InterestedPlotRef = 0;
      this.SiteManagementName = '';
      this.InterestedPlotNo = '';
      this.SelectedInterestedPlots = [];
      this.PlotList = [];
      this.SelectedInterestedSite = [];
    }
  }

  // On lead source broker selected
  showAgentBrokerInput: boolean = false;

  onLeadSourceChange = (selectedValue: number) => {
    // Check if the selected value is AgentBroker (50)
    if (selectedValue === 50) {
      this.showAgentBrokerInput = true;
    } else {
      this.showAgentBrokerInput = false;
    }
  }

  selectedCustomerStatus: number = 0;
  isReminderRequired: boolean = false;
  reminderMessage: string = '';

  onStatusChange = (selectedStatus: number) => {
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

  get filteredCustomerStatusList() {
    return this.CustomerStatusList.filter(status => status.Ref !== 30 && status.Ref !== 40);
  }

  SaveCustomerEnquiry = async () => {
    console.log('this.Entity :', this.Entity);
    this.Entity.p.CompanyRef = this.companyRef;
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

    this.Entity.p.CustomerFollowUps[0].TransDateTime = this.DateWithTime!;
    this.Entity.p.CustomerFollowUps[0].SiteVisitDate =
      this.dtu.ConvertStringDateToFullFormat(this.localSiteVisitDate ? this.localSiteVisitDate : '');
    this.Entity.p.CustomerFollowUps[0].OfficeVisitDate =
      this.dtu.ConvertStringDateToFullFormat(this.localOfficeVisitDate ? this.localOfficeVisitDate : '');
    this.Entity.p.CustomerFollowUps[0].ReminderDate =
      this.dtu.ConvertStringDateToFullFormat(this.localReminderDate ? this.localReminderDate : '');
    this.Entity.p.CustomerFollowUps[0].CompanyRef = this.companyRef;

    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];

    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      await this.toastService.present(tr.Message, 1000, 'danger');
      await this.haptic.error();
      return;
    } else {
      if (this.IsNewEntity) {
        await this.toastService.present('Customer Enquiry saved successfully', 1000, 'success');
        this.router.navigate(['/mobile-app/tabs/dashboard/customer-relationship-management/customer-enquiry'], { replaceUrl: true });
        this.Entity = CustomerEnquiry.CreateNewInstance();
        await this.haptic.success();
      } else {
        await this.toastService.present('Customer Enquiry Updated successfully', 1000, 'success');
        this.router.navigate(['/mobile-app/tabs/dashboard/customer-relationship-management/customer-enquiry'], { replaceUrl: true });
        await this.haptic.success();
      }
    }
  };


  isDataFilled(): boolean {
    const emptyEntity = CustomerEnquiry.CreateNewInstance();
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
            }
          },
          {
            text: 'Yes, Close',
            cssClass: 'custom-confirm',
            handler: async () => {
              try {
                this.router.navigate(['/mobile-app/tabs/dashboard/customer-relationship-management/customer-enquiry'], { replaceUrl: true });
              } catch (err) {
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
