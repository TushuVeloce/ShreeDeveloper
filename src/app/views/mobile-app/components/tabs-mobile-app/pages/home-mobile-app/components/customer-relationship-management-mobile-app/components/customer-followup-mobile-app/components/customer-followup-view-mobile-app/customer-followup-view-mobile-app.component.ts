import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { CustomerEnquiry } from 'src/app/classes/domain/entities/website/customer_management/customerenquiry/customerenquiry';
import { CustomerFollowUp } from 'src/app/classes/domain/entities/website/customer_management/customerfollowup/customerfollowup';
import { Plot } from 'src/app/classes/domain/entities/website/masters/plot/plot';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { FilterService } from 'src/app/services/filter.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { FilterItem } from 'src/app/views/mobile-app/components/shared/chip-filter-mobile-app/chip-filter-mobile-app.component';

@Component({
  selector: 'app-customer-followup-view-mobile-app',
  templateUrl: './customer-followup-view-mobile-app.component.html',
  styleUrls: ['./customer-followup-view-mobile-app.component.scss'],
  standalone: false
})
export class CustomerFollowupViewMobileAppComponent implements OnInit {
  Entity: CustomerFollowUp = CustomerFollowUp.CreateNewInstance();
  SiteList: Site[] = [];
  PlotList: Plot[] = [];
  followupList: CustomerFollowUp[] = [];
  FilterFollowupList: CustomerFollowUp[] = [];
  SelectedFollowUp: CustomerFollowUp = CustomerFollowUp.CreateNewInstance();
  SelectedCustomerEnquiry: CustomerEnquiry = CustomerEnquiry.CreateNewInstance();

  CustomerRef: number = 0;
  InterestedPlotRef: number = 0;
  SiteManagementRef: number = 0;
  date: string = '';
  strCDT: string = '';
  ModalOpen: boolean = false;
  // isLoading: boolean = false;
  companyRef: number = 0

  ContactModeList = DomainEnums.ContactModeList();
  selectedFilters: any[] = [];
  filters: FilterItem[] = [];
  // Store current selected values here to preserve selections on filter reload
  selectedFilterValues: Record<string, any> = {};

  constructor(
    // private uiUtils: UIUtils,
    private router: Router,
    private appStateManagement: AppStateManageService,
    private companystatemanagement: CompanyStateManagement,
    private dateconversionService: DateconversionService,
    private filterService: FilterService,
    private dtu: DTU,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService
  ) { }

  async ngOnInit() {
    // this.LoadAllData()
  }
  ionViewWillEnter = async () => {
    await this.LoadAllData();
    await this.loadFilters();
  };
  async handleRefresh(event: CustomEvent): Promise<void> {
    await this.LoadAllData();
    await this.loadFilters();
    (event.target as HTMLIonRefresherElement).complete();
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

  }
  loadFilters() {
    this.filters = [
      {
        key: 'mode',
        label: 'Contact Mode',
        multi: false,
        options: this.ContactModeList.map(item => ({
          Ref: item.Ref,
          Name: item.Name,
        })),
        selected: this.selectedFilterValues['mode'] > 0 ? this.selectedFilterValues['mode'] : null,
      }
    ];
  }

  async onFiltersChanged(updatedFilters: any[]) {
    // debugger
    console.log('Updated Filters:', updatedFilters);

    for (const filter of updatedFilters) {
      const selected = filter.selected;
      const selectedValue = (selected === null || selected === undefined) ? null : selected;

      // Save selected value to preserve after reload
      this.selectedFilterValues[filter.key] = selectedValue ?? null;

      switch (filter.key) {
        case 'mode':
          this.Entity.p.ContactMode = selectedValue ?? 0;
          break;
      }
    }
    await this.getCustomerFollowUpListByDateCompanyAndContactModeRef();
    this.loadFilters(); // Reload filters with updated options & preserve selections
  }

  private async LoadAllData() {
    this.companyRef = Number(this.appStateManagement.localStorage.getItem('SelectedCompanyRef'));
    if (!this.date) {
      await this.initializeDate();
    }
  }
  private async initializeDate() {
    // this.isLoading = true;
    this.loadingService.show();
    try {
      this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
      const parts = this.strCDT.substring(0, 16).split('-');

      if (parts.length >= 3) {
        this.date = `${parts[0]}-${parts[1]}-${parts[2]}`;
        this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
        await this.fetchFollowUps();
      }
    } catch (error) {
      // await this.uiUtils.showErrorMessage('Error', 'Failed to initialize date');
    } finally {
      // this.isLoading = false;
      this.loadingService.hide();
    }
  }


  async onDateChange(date: string) {
    if (date) {
      const parts = date.split('-');
      if (parts.length >= 3) {
        this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
      }
    } else {
      this.date = '';
      this.strCDT = '';
    }

    await this.fetchFollowUps();
  }

  formatDate(date: string | Date): string {
    return this.dateconversionService.formatDate(date);
  }

  private async fetchFollowUps() {
    // this.isLoading = true;
    this.loadingService.show();
    try {
      // const followUps = await CustomerFollowUp.FetchEntireListByDateandPlotRef(
      //   this.strCDT,
      //   this.InterestedPlotRef,
      //   async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
      // );

      // this.followupList = followUps;
      // this.FilterFollowupList = followUps;
      // this.strCDT = this.dtu.ConvertStringDateToFullFormat(this.ReminderDate);
      let FollowUp = await CustomerFollowUp.FetchEntireListByDateComapanyAndContactModeRef(this.companyRef, this.strCDT, this.Entity.p.ContactMode,
        async (errMsg) => {
          // await this.uiUtils.showErrorMessage('Error', errMsg)
          await this.toastService.present('Error' + errMsg, 1000, 'danger');
          await this.haptic.error();
        });
      console.log('FollowUp :', FollowUp, this.companyRef, this.strCDT, this.Entity.p.ContactMode);
      this.followupList = FollowUp
      this.FilterFollowupList = FollowUp;
    } catch (error) {
      // await this.uiUtils.showErrorMessage('Error', 'Failed to fetch follow-ups');
    } finally {
      // this.isLoading = false;
      this.loadingService.hide();
    }
  }

  async onFollowUpClick(followup: CustomerFollowUp) {
    this.SelectedFollowUp = followup.GetEditableVersion();
    CustomerFollowUp.SetCurrentInstance(this.SelectedFollowUp);
    this.appStateManagement.StorageKey.setItem('Editable', 'Edit');
    this.onAddCustomerEnquiry()
    // await this.router.navigate(['/app_homepage/tabs/crm/customer-follow-up/add']);
  }

  async onAddCustomerEnquiry() {
    await this.router.navigate(['mobile-app/tabs/dashboard/customer-relationship-management/customer-followup/edit']);
  }
  formatData = (list: any[]) => {
    return list.map(item => ({
      Ref: item.p.Ref,
      Name: item.p.Name
    }));
  };
  openFilterSheet = async () => {
    const filterData = {
      categories: [
        {
          Name: 'Contact Mode',
          Ref: 100,
          multi: false,
          date: false,
          dependUponRef: 0,
          options: this.ContactModeList
        }
        // ,{
        //   Name: 'From Date',
        //   Ref: 400,
        //   multi: false,
        //   date: true,
        //   dependUponRef: 0,
        //   options: []
        // }
      ]
    };

    // console.log('Vendor List:', this.VendorList);
    // console.log('Stage List:', this.StageList);

    try {
      const res = await this.filterService.openFilter(filterData, this.selectedFilters);
      console.log('res :', res);

      if (res.selected && res.selected.length > 0) {
        this.selectedFilters = res.selected;
        this.Entity.p.ContactMode = this.selectedFilters[0].selectedOptions[0].Ref;
        this.getCustomerFollowUpListByDateCompanyAndContactModeRef();
      } else {
        this.Entity.p.ContactMode = 0;
        this.selectedFilters = [];
        this.getCustomerFollowUpListByDateCompanyAndContactModeRef();
      }
    } catch (error) {
      console.error('Error in filter selection:', error);
    }
  };
  getCustomerFollowUpListByDateCompanyAndContactModeRef = async () => {
    this.strCDT = this.dtu.ConvertStringDateToFullFormat(this.strCDT);
    let FollowUp = await CustomerFollowUp.FetchEntireListByDateComapanyAndContactModeRef(this.companyRef, this.strCDT, this.Entity.p.ContactMode,
      async (errMsg) => {
        // await this.uiUtils.showErrorMessage('Error', errMsg)
        await this.toastService.present('Error' + errMsg, 1000, 'danger');
        await this.haptic.error();
      });
    console.log('FollowUp :', FollowUp);
    this.FilterFollowupList = FollowUp
    this.followupList = FollowUp;
  };
}
