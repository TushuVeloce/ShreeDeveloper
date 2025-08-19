import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class CustomerFollowupViewMobileAppComponent implements OnInit, OnDestroy {
  Entity: CustomerFollowUp = CustomerFollowUp.CreateNewInstance();
  SiteList: Site[] = [];
  PlotList: Plot[] = [];
  followupList: CustomerFollowUp[] = [];
  FilterFollowupList: CustomerFollowUp[] = [];
  SelectedFollowUp: CustomerFollowUp = CustomerFollowUp.CreateNewInstance();
  SelectedCustomerEnquiry: CustomerEnquiry = CustomerEnquiry.CreateNewInstance();

  CustomerRef = 0;
  InterestedPlotRef = 0;
  SiteManagementRef = 0;
  date = '';
  strCDT = '';
  ModalOpen = false;
  companyRef = 0;

  ContactModeList = DomainEnums.ContactModeList();
  selectedFilters: any[] = [];
  filters: FilterItem[] = [];
  selectedFilterValues: Record<string, any> = {};

  constructor(
    private router: Router,
    private appStateManagement: AppStateManageService,
    private companystatemanagement: CompanyStateManagement,
    private dateconversionService: DateconversionService,
    private filterService: FilterService,
    private dtu: DTU,
    private toastService: ToastService,
    private haptic: HapticService,
    public loadingService: LoadingService
  ) { }

  async ngOnInit(): Promise<void> {
    // Load initial data
    await this.loadAllData();
    this.loadFilters();
  }

  ionViewWillEnter = async (): Promise<void> => {
    await this.loadAllData();
    this.loadFilters();
  };

  async handleRefresh(event: CustomEvent): Promise<void> {
    await this.loadAllData();
    this.loadFilters();
    (event.target as HTMLIonRefresherElement).complete();
  }

  ngOnDestroy(): void {
    // Clean up if necessary
  }

  private loadFilters(): void {
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

  async onFiltersChanged(updatedFilters: any[]): Promise<void> {
    for (const filter of updatedFilters) {
      const selectedValue = filter.selected ?? null;
      this.selectedFilterValues[filter.key] = selectedValue;

      if (filter.key === 'mode') {
        this.Entity.p.ContactMode = selectedValue ?? 0;
      }
    }

    await this.getCustomerFollowUpListByDateCompanyAndContactModeRef();
    // Avoid re-calling loadFilters here to prevent flicker, unless filter options depend on response
  }

  private async loadAllData(): Promise<void> {
    this.companyRef = Number(this.appStateManagement.localStorage.getItem('SelectedCompanyRef') ?? 0);
    if (!this.date) {
      await this.initializeDate();
    } else {
      // If date already set, just fetch follow-ups
      await this.fetchFollowUps();
    }
  }

  private async initializeDate(): Promise<void> {
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
      console.error('Failed to initialize date:', error);
    } finally {
      this.loadingService.hide();
    }
  }

  async onDateChange(date: string): Promise<void> {
    if (date) {
      const parts = date.split('-');
      if (parts.length >= 3) {
        this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
        this.date = date;
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

  private async fetchFollowUps(): Promise<void> {
    this.loadingService.show();
    try {
      const followUps = await CustomerFollowUp.FetchEntireListByDateComapanyAndContactModeRef(
        this.companyRef,
        this.strCDT,
        this.Entity.p.ContactMode,
        async (errMsg: string) => {
          await this.toastService.present('Error: ' + errMsg, 1000, 'danger');
          await this.haptic.error();
        }
      );
      this.followupList = followUps;
      this.FilterFollowupList = followUps;
    } catch (error) {
      console.error('Error fetching follow-ups:', error);
    } finally {
      this.loadingService.hide();
    }
  }

  // async onFollowUpClick(followup: CustomerFollowUp): Promise<void> {
  //   this.SelectedFollowUp = followup.GetEditableVersion();
  //   CustomerFollowUp.SetCurrentInstance(this.SelectedFollowUp);
  //   this.appStateManagement.StorageKey.setItem('Editable', 'Edit');
  //   await this.router.navigate(['/mobile-app/tabs/dashboard/customer-relationship-management/customer-followup/edit']);
  // }

  onFollowUpClick = async (followup: CustomerFollowUp) => {
    this.SelectedFollowUp = followup.GetEditableVersion();
    CustomerFollowUp.SetCurrentInstance(this.SelectedFollowUp);
    this.appStateManagement.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/mobile-app/tabs/dashboard/customer-relationship-management/customer-followup/edit'], { replaceUrl: true });
  };

  formatData(list: any[]): { Ref: any; Name: any }[] {
    return list.map(item => ({
      Ref: item.p.Ref,
      Name: item.p.Name
    }));
  }

  async openFilterSheet(): Promise<void> {
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
      ]
    };

    try {
      const res = await this.filterService.openFilter(filterData, this.selectedFilters);
      if (res.selected?.length) {
        this.selectedFilters = res.selected;
        this.Entity.p.ContactMode = this.selectedFilters[0].selectedOptions[0].Ref;
      } else {
        this.Entity.p.ContactMode = 0;
        this.selectedFilters = [];
      }
      await this.getCustomerFollowUpListByDateCompanyAndContactModeRef();
    } catch (error) {
      console.error('Filter sheet open error:', error);
    }
  }

  private async getCustomerFollowUpListByDateCompanyAndContactModeRef(): Promise<void> {
    try {
      this.loadingService.show();
      this.strCDT = this.dtu.ConvertStringDateToFullFormat(this.strCDT);
      const followUps = await CustomerFollowUp.FetchEntireListByDateComapanyAndContactModeRef(
        this.companyRef,
        this.strCDT,
        this.Entity.p.ContactMode,
        async (errMsg: string) => {
          await this.toastService.present('Error: ' + errMsg, 1000, 'danger');
          await this.haptic.error();
        }
      );
      this.FilterFollowupList = followUps;
      this.followupList = followUps;
    } catch (error) {
      console.error('Error loading filtered follow-ups:', error);
    } finally {
      this.loadingService.hide();
    }
  }
}
