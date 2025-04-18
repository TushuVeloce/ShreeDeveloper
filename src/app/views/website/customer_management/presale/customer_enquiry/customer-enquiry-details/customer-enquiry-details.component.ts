import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ValidationMessages,
  ValidationPatterns,
} from 'src/app/classes/domain/constants';
import {
  BookingRemark,
  DomainEnums,
} from 'src/app/classes/domain/domainenums/domainenums';
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
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
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
  localReminderDate: string = '';
  localOfficeVisitDate: string = '';
  localSiteVisitDate: string = '';
  InterestedPlotRef: number = 0;
  SiteManagementRef: number = 0;
  today: string = new Date().toISOString().split('T')[0];
  DetailsFormTitle: 'New Customer' | 'Edit Customer' = 'New Customer';

  Date: string | null = null;
  DateWithTime: string | null = null;

  NameWithNosAndSpace: string = ValidationPatterns.NameWithNosAndSpace;
  NameWithoutNosMsg: string = ValidationMessages.NameWithNosAndSpaceAnd_Msg;
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg;

  PinCode : string = ValidationPatterns.PinCode;
  PinCodeWithoutMsg : string = ValidationMessages.PinCodeMsg;

  @ViewChild('NameCtrl') CustomerEnquiryNameInputControl!: NgModel;
  @ViewChild('PinCodeCtrl') PinCodeNoInputControl!: NgModel;
  // @ViewChild('ContactNos') phoneNosInput!: NgModel;

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
    private dtu: DTU,
    private datePipe: DatePipe,
    private companystatemanagement: CompanyStateManagement
  ) {}

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    console.log(this.CustomerStatusList);

    this.CountryList = await Country.FetchEntireList();
    this.StateList = await State.FetchEntireList();

    this.CityList = await City.FetchEntireList();
    await this.getSiteListByCompanyRef();
    await this.getEmployeeListByCompanyRef();

    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity
        ? 'New Customer'
        : 'Edit Customer';
      this.Entity = CustomerEnquiry.GetCurrentInstance();
      console.log('Entity :', this.Entity);
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

      this.appStateManage.StorageKey.removeItem('Editable');
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
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.PlotList = lst.filter(
      (plot) => plot.p.CurrentBookingRemark !== BookingRemark.Booked
    );

    console.log(this.PlotList);

    // this.DisplayMasterList = this.PlotList
    // this.IsPlotDetails = true;
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
    if (selectedPlot) {
      obj.EnsurePrimaryKeysWithValidValues();
      obj.p.SiteRef = this.SiteManagementRef;
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
      this.uiUtils.showWarningToster(
        'This plot is already added to the table.'
      );
      return;
    }

    if (selectedPlot) {
      this.Entity.p.CustomerFollowUps[0].CompanyRef =
        this.companystatemanagement.getCurrentCompanyRef();

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

  markTouched(control: any) {
    control.control.markAsTouched();
  }

  // isSIteVisitSelected(): boolean {
  // const visitRefs = [30, 40, 50]; // these are the "visit" type Ref values
  // return visitRefs.includes(this.Entity.p.CustomerFollowUps[0].ContactMode);
  // }

  resetAllControls = () => {
    // reset touched
    this.CustomerEnquiryNameInputControl.control.markAsUntouched();
    this.PinCodeNoInputControl.control.markAsUntouched();

    // reset dirty
    this.CustomerEnquiryNameInputControl.control.markAsPristine();
    this.PinCodeNoInputControl.control.markAsPristine();
  };

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
      this.dtu.ConvertStringDateToFullFormat(this.localSiteVisitDate);
    this.Entity.p.CustomerFollowUps[0].OfficeVisitDate =
      this.dtu.ConvertStringDateToFullFormat(this.localOfficeVisitDate);
    this.Entity.p.CustomerFollowUps[0].ReminderDate =
      this.dtu.ConvertStringDateToFullFormat(this.localReminderDate);

    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    console.log('entitiesToSave :', entitiesToSave);

    // await this.Entity.EnsurePrimaryKeysWithValidValues()
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    } else {
      // this.onEntitySaved.emit(entityToSave);
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster(
          'Customer Enquiry saved successfully!'
        );
        this.Entity = CustomerEnquiry.CreateNewInstance();
        this.router.navigate(['/homepage/Website/Customer_Enquiry']);
        this.resetAllControls();
      } else {
        await this.uiUtils.showSuccessToster(
          'Customer Enquiry Updated successfully!'
        );
        this.router.navigate(['/homepage/Website/Customer_Enquiry']);
      }
    }
  };

  BackCustomerEnquiry() {
    this.router.navigate(['/homepage/Website/Customer_Enquiry']);
  }

  // function for preselected values in field
  selectAll(event: any) {
    event.target.select();
  }
}
