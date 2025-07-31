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
import { DTU } from 'src/app/services/dtu.service';
import { Utils } from 'src/app/services/utils.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';

@Component({
  selector: 'app-customer-followup-details-mobile-app',
  templateUrl: './customer-followup-details-mobile-app.component.html',
  styleUrls: ['./customer-followup-details-mobile-app.component.scss'],
  standalone: false
})
export class CustomerFollowupDetailsMobileAppComponent implements OnInit {
  Entity: CustomerFollowUp = CustomerFollowUp.CreateNewInstance();
  CustomerEnquiryEntity: CustomerEnquiry = CustomerEnquiry.CreateNewInstance();
  obj = CustomerFollowUpPlotDetails.CreateNewInstance();
  today: string = new Date().toISOString().split('T')[0];
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
  localReminderDate: string | null = null;
  localOfficeVisitDate: string | null = null;
  localSiteVisitDate: string | null = null;
  todayDate: string = '';

  Date: string | null = null;
  DateWithTime: string | null = null;

  ContactModesList = DomainEnums.ContactModeList();
  LeadSourceList = DomainEnums.MarketingModesList();
  LeadSourceEnum = MarketingModes;
  CustomerStatusList = DomainEnums.CustomerStatusList();
  CustomerStatusEnum = CustomerStatus
  companyRef: number = 0;
  showAgentBrokerInput: boolean = false;
  InterestedPlotNo: string = '';
  SiteManagementName: string = '';

  selectedCustomerStatus: any[] = [];
  CustomerStatusName: string = '';

  selectedLeadHandleBy: any[] = [];
  LeadHandleByName: string = '';

  selectedLeadSource: any[] = [];
  LeadSourceName: string = '';

  selectedPlot: any[] = [];
  plotName: string = '';

  selectedSite: any[] = [];
  SiteName: string = '';

  selectedContactMode: any[] = [];
  contactModeName: string = '';

  constructor(
    private router: Router,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private dtu: DTU,
    private datePipe: DatePipe,
    private bottomsheetMobileAppService: BottomsheetMobileAppService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService
  ) { }

  ngOnInit = async (): Promise<void> => {
    // await this.loadCustomerFollowUpIfEmployeeExists();
  }

  ionViewWillEnter = async (): Promise<void> => {
    await this.loadCustomerFollowUpIfEmployeeExists();
  };
  ngOnDestroy(): void {
    // cleanup logic if needed later
  }

  private async loadCustomerFollowUpIfEmployeeExists(): Promise<void> {
    try {
      this.loadingService.show();
      this.companyRef = Number(this.appStateManage.localStorage.getItem('SelectedCompanyRef'));
      await this.getEmployeeListByCompanyRef()
      await this.getSiteListByCompanyRef();
      if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
        this.IsNewEntity = false;
        this.Entity = CustomerFollowUp.GetCurrentInstance();
        // Reset Required Entities
        this.Entity.p.ReminderDate = '';
        this.Entity.p.Reason = '';
        this.Entity.p.CustomerStatus = 0;
        this.Entity.p.ContactMode = 0;

        // While Edit Converting date String into Date Format //
        if (this.Entity.p.ReminderDate) {
          this.localReminderDate = this.dtu.ConvertStringDateToShortFormat(
            this.Entity.p.ReminderDate
          ) ?? null;
        }

        if (this.Entity.p.SiteVisitDate != '') {
          // While Edit Converting date String into Date Format //
          // convert  2025-02-23-00-00-00-000 to 2025-02-23
          this.localSiteVisitDate = this.dtu.ConvertStringDateToShortFormat(
            this.Entity.p.SiteVisitDate
          ) ?? null;
        }
        if (this.Entity.p.OfficeVisitDate) {
          // While Edit Converting date String into Date Format //
          this.localOfficeVisitDate = this.dtu.ConvertStringDateToShortFormat(
            this.Entity.p.OfficeVisitDate
          ) ?? null;
        }      
        this.LeadSourceName = this.LeadSourceList.find(item => item.Ref == this.Entity.p.LeadSource)?.Name ?? '';
        this.selectedLeadSource = [{ p: { Ref: this.Entity.p.LeadSource, Name: this.LeadSourceName } }];

        this.LeadHandleByName = this.EmployeeList.find(item => item.p.Ref == this.Entity.p.LeadHandleBy)?.p.Name ?? '';
        this.selectedLeadHandleBy = [{ p: { Ref: this.Entity.p.LeadHandleBy, Name: this.LeadHandleByName } }];

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
    console.log('error :', error);

    } finally {
      this.loadingService.hide()
    }
  }

  getEmployeeListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    let lst = await Employee.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.EmployeeList = lst;
  }

  onCustomerStatusChange(plot: any): void {
    if (plot.CustomerStatus !== this.CustomerStatusEnum.ConvertToDeal) {
      plot.CustID = '';
    }
  }

  public selectContactModeBottomsheet = async (): Promise<void> =>{
    try {
      const options = this.ContactModesList.map((item) => ({ p: item }));
      this.openSelectModal(options, this.selectedContactMode, false, 'Select Contact Mode', 1, (selected) => {
        this.selectedContactMode = selected;
        this.Entity.p.ContactMode = selected[0].p.Ref;
        this.contactModeName = selected[0].p.Name;
      });
    } catch (error) {

    }
  }

  public selectInterestedSiteBottomsheet = async (): Promise<void> => {
    try {
      const options = this.SiteList;
      this.openSelectModal(options, this.selectedSite, false, 'Select Interested Site', 1, (selected) => {
        this.selectedSite = selected;
        this.SiteManagementRef = selected[0].p.Ref;
        this.SiteManagementName = selected[0].p.Name;
        this.SiteName = selected[0].p.Name;
      });
      if (this.SiteManagementRef > 0) {
        await this.getPlotBySiteRefList(this.SiteManagementRef);
      }
    } catch (error) {

    }
  }
  public selectInterestedPlotsBottomsheet = async (): Promise<void> => {
    try {
      const options = this.PlotList;
      this.openSelectModal(options, this.selectedPlot, false, 'Select Interested Plots', 1, (selected) => {
        this.selectedPlot = selected;
        this.InterestedPlotRef = selected[0].p.Ref;
        this.InterestedPlotNo = selected[0].p.Name;
        this.plotName = selected[0].p.Name;
      });
    } catch (error) {

    }
  }
  public selectLeadSourceBottomsheet = async (): Promise<void> => {
    try {
      const options = this.LeadSourceList.map((item) => ({ p: item }));
      this.openSelectModal(options, this.selectedLeadSource, false, 'Select Lead Source', 1, (selected) => {
        this.selectedLeadSource = selected;
        this.Entity.p.LeadSource = selected[0].p.Ref;
        this.LeadSourceName = selected[0].p.Name;
      });
      if (this.Entity.p.LeadSource) {
        await this.onLeadSourceChange(this.Entity.p.LeadSource)
      }
    } catch (error) {

    }
  }
  public selectLeadHandleByBottomsheet = async (): Promise<void> =>{
    try {
      const options = this.EmployeeList;
      this.openSelectModal(options, this.selectedLeadHandleBy, false, 'Select Lead Handle By', 1, (selected) => {
        this.selectedLeadHandleBy = selected;
        this.Entity.p.LeadHandleBy = selected[0].p.Ref;
        this.LeadHandleByName = selected[0].p.Name;
      });
    } catch (error) {

    }
  }
  public selectCustomerStatusBottomsheet = async (): Promise<void> => {
    try {
      const options = this.CustomerStatusList.map((item) => ({ p: item }));
      this.openSelectModal(options, this.selectedCustomerStatus, false, 'Select Customer Status', 1, (selected) => {
        this.selectedCustomerStatus = selected;
        this.Entity.p.CustomerStatusName = selected[0].p.Name;
        this.Entity.p.CustomerStatus = selected[0].p.Ref;
        this.CustomerStatusName = selected[0].p.Name;
      });
      if (this.Entity.p.CustomerStatus) {
        await this.ConverttoDeal(this.Entity.p.CustomerStatus);
      }
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

  ConverttoDeal = (CustomerStatus: number): boolean => {
    this.localSiteVisitDate= null;
    this.localOfficeVisitDate = null;
    this.localReminderDate = null;
    this.Entity.p.SiteVisitDate = '';
    this.Entity.p.OfficeVisitDate = '';
    this.Entity.p.ReminderDate = '';
    this.Entity.p.CustID = ''
    const hasDealRecord = this.Entity.p.CustomerFollowUpPlotDetails?.some(
      (item: any) => item.CustomerStatus === this.CustomerStatusEnum.ConvertToDeal
    );
    if (CustomerStatus === this.CustomerStatusEnum.ConvertToDeal && !hasDealRecord) {
      this.toastService.present('No record found in the Plots Table as "Convert to Deal"', 2000, 'danger');
      this.haptic.error();
      return false;
    }
    if (hasDealRecord && CustomerStatus !== this.CustomerStatusEnum.ConvertToDeal) {
      this.toastService.present('One or more plots are marked as "Convert to Deal", so the Customer Status must also be "Convert to Deal"', 2000, 'danger');
      this.haptic.error();
      return false;
    }
    return true;
  };


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
        async (errMsg) => {
          await this.toastService.present(errMsg, 1000, 'danger');
          await this.haptic.error();
        }
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
        async (errMsg) => {
          await this.toastService.present( errMsg, 1000, 'danger');
          await this.haptic.error();
        }
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
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.SiteList = lst;
  };

  getPlotBySiteRefList = async (siteRef: number) => {
    if (siteRef <= 0) {
      await this.toastService.present('Please Select a Site', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    let lst = await Plot.FetchEntireListBySiteRef(
      siteRef,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.PlotList = lst.filter((plot) => plot.p.CurrentBookingRemark !== BookingRemark.Booked);


    this.DisplayMasterList = this.PlotList;
    this.IsPlotDetails = true;
  };

  addDataToCustomerFollowUpPlotDetail = () => {
    if (this.SiteManagementRef <= 0) {
      this.toastService.present('Please Select a Site', 1000, 'danger');
      this.haptic.error();
      return;
    }
    if (this.InterestedPlotRef <= 0) {
      this.toastService.present('Please Select a Plot', 1000, 'danger');
      this.haptic.error();
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
      this.toastService.present('This plot is already added to the table.', 1000, 'danger');
      this.haptic.error();
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
      this.appStateManage.localStorage.getItem('LoginEmployeeRef')
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
      await this.toastService.present(tr.Message, 1000, 'danger');
      await this.haptic.error();
      return;
    } else {
      if (this.IsNewEntity) {
        await this.toastService.present('Customer Follow Up saved successfully', 1000, 'success');
        this.Entity = CustomerFollowUp.CreateNewInstance();
        this.router.navigate(['/mobile-app/tabs/dashboard/customer-relationship-management/customer-followup'], { replaceUrl: true });

        await this.haptic.success();
      } else {
        await this.toastService.present('Customer Follow Up saved successfully', 1000, 'success');
        this.Entity = CustomerFollowUp.CreateNewInstance();
        this.router.navigate(['/mobile-app/tabs/dashboard/customer-relationship-management/customer-followup'], { replaceUrl: true });
        await this.haptic.success();

      }
    }
  };

  isDataFilled(): boolean {
    const emptyEntity = CustomerFollowUp.CreateNewInstance();
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
        header: 'Warning',
        subHeader: 'Confirmation needed',
        message: 'You have unsaved data. Are you sure you want to go back? All data will be lost.',
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
              this.router.navigate(['/mobile-app/tabs/dashboard/customer-relationship-management/customer-followup'], { replaceUrl: true });
            }
          }
        ]
      });
    } else {
      this.router.navigate(['/mobile-app/tabs/dashboard/customer-relationship-management/customer-followup'], { replaceUrl: true });
    }
  }
}
