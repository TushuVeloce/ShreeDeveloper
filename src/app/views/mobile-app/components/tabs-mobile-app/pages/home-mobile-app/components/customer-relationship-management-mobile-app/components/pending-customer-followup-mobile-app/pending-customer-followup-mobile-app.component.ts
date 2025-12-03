import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ApplicationFeatures,
  DomainEnums,
} from 'src/app/classes/domain/domainenums/domainenums';
import { CustomerEnquiry } from 'src/app/classes/domain/entities/website/customer_management/customerenquiry/customerenquiry';
import { CustomerFollowUp } from 'src/app/classes/domain/entities/website/customer_management/customerfollowup/customerfollowup';
import { Plot } from 'src/app/classes/domain/entities/website/masters/plot/plot';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { FeatureAccessMobileAppService } from 'src/app/services/feature-access-mobile-app.service';
import { FilterService } from 'src/app/services/filter.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { FilterItem } from 'src/app/views/mobile-app/components/shared/chip-filter-mobile-app/chip-filter-mobile-app.component';

@Component({
  selector: 'app-pending-customer-followup-mobile-app',
  templateUrl: './pending-customer-followup-mobile-app.component.html',
  styleUrls: ['./pending-customer-followup-mobile-app.component.scss'],
  standalone: false,
})
export class PendingCustomerFollowupMobileAppComponent implements OnInit {
  Entity: CustomerFollowUp = CustomerFollowUp.CreateNewInstance();
  SiteList: Site[] = [];
  PlotList: Plot[] = [];
  followupList: CustomerFollowUp[] = [];
  FilterFollowupList: CustomerFollowUp[] = [];
  SelectedFollowUp: CustomerFollowUp = CustomerFollowUp.CreateNewInstance();
  SelectedCustomerEnquiry: CustomerEnquiry =
    CustomerEnquiry.CreateNewInstance();

  CustomerRef: number = 0;
  InterestedPlotRef: number = 0;
  SiteManagementRef: number = 0;
  date: string = '';
  strCDT: string = '';
  ModalOpen: boolean = false;
  companyRef: number = 0;

  ContactModeList = DomainEnums.ContactModeList();
  selectedFilters: any[] = [];

  filters: FilterItem[] = [];
  // Store current selected values here to preserve selections on filter reload
  selectedFilterValues: Record<string, any> = {};
  featureRef: ApplicationFeatures = ApplicationFeatures.PendingFollowUp;
  showActionColumn = false;

  constructor(
    private router: Router,
    private appStateManagement: AppStateManageService,
    private dateconversionService: DateconversionService,
    private filterService: FilterService,
    private toastService: ToastService,
    private haptic: HapticService,
    public loadingService: LoadingService,
    public access: FeatureAccessMobileAppService
  ) {}

  ngOnInit = async () => {
    // this.LoadAllData()
  };
  ionViewWillEnter = async () => {
    this.access.refresh();
    this.showActionColumn =
      this.access.canAdd(this.featureRef) ||
      this.access.canEdit(this.featureRef) ||
      this.access.canDelete(this.featureRef);
    await this.LoadAllData();
    this.loadFilters();
  };
  handleRefresh = async (event: CustomEvent): Promise<void> => {
    await this.LoadAllData();
    this.loadFilters();
    (event.target as HTMLIonRefresherElement).complete();
  };
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  loadFilters = () => {
    this.filters = [
      {
        key: 'mode',
        label: 'Contact Mode',
        multi: false,
        options: this.ContactModeList.map((item) => ({
          Ref: item.Ref,
          Name: item.Name,
        })),
        selected:
          this.selectedFilterValues['mode'] > 0
            ? this.selectedFilterValues['mode']
            : null,
      },
    ];
  };

  onFiltersChanged = async (updatedFilters: any[]) => {
    for (const filter of updatedFilters) {
      const selected = filter.selected;
      const selectedValue =
        selected === null || selected === undefined ? null : selected;

      // Save selected value to preserve after reload
      this.selectedFilterValues[filter.key] = selectedValue ?? null;

      switch (filter.key) {
        case 'mode':
          this.Entity.p.ContactMode = selectedValue ?? 0;
          break;
      }
    }
    await this.getCustomerFollowUpPendingListByContactModeRef();
    this.loadFilters(); // Reload filters with updated options & preserve selections
  };

  private LoadAllData = async () => {
    this.companyRef = Number(
      this.appStateManagement.localStorage.getItem('SelectedCompanyRef')
    );
    if (!this.date) {
      await this.initializeDate();
    }
  };
  private initializeDate = async () => {
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
    } finally {
      this.loadingService.hide();
    }
  };

  onDateChange = async (date: string) => {
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
  };

  formatDate(date: string | Date): string {
    return this.dateconversionService.formatDate(date);
  }

  private fetchFollowUps = async () => {
    this.loadingService.show();
    try {
      let FollowUp =
        await CustomerFollowUp.FetchEntirePendingListByContactModeRef(
          this.companyRef,
          this.Entity.p.ContactMode,
          async (errMsg) => {
            await this.toastService.present(errMsg, 1000, 'danger');
            await this.haptic.error();
          }
        );
      this.followupList = FollowUp;
      this.FilterFollowupList = FollowUp;
    } catch (error) {
    } finally {
      this.loadingService.hide();
    }
  };

  onFollowUpClick = async (followup: CustomerFollowUp) => {
    this.SelectedFollowUp = followup.GetEditableVersion();
    CustomerFollowUp.SetCurrentInstance(this.SelectedFollowUp);
    this.appStateManagement.StorageKey.setItem('Editable', 'Edit');
    await this.onAddCustomerEnquiry();
  };

  onAddCustomerEnquiry = async () => {
    await this.router.navigate([
      '/mobile-app/tabs/dashboard/customer-relationship-management/customer-followup/edit',
    ]);
  };
  // Add this method to your component class
  public getStatusColor(statusName: string): string {
    switch (statusName.toLowerCase()) {
      case 'new lead':
        return 'primary';
      case 'in progress':
        return 'warning';
      case 'completed':
        return 'success';
      case 'pending':
        return 'danger';
      default:
        return 'medium';
    }
  }

  formatData = (list: any[]) => {
    return list.map((item) => ({
      Ref: item.p.Ref,
      Name: item.p.Name,
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
          options: this.ContactModeList,
        },
      ],
    };
    try {
      const res = await this.filterService.openFilter(
        filterData,
        this.selectedFilters
      );

      if (res.selected && res.selected.length > 0) {
        this.selectedFilters = res.selected;
        for (const filter of this.selectedFilters) {
          switch (filter.category.Ref) {
            case 100:
              this.Entity.p.ContactMode = filter.selectedOptions[0].Ref;
              break;
          }
        }

        this.getCustomerFollowUpPendingListByContactModeRef();
      } else {
        this.Entity.p.ContactMode = 0;
        this.selectedFilters = [];
        this.getCustomerFollowUpPendingListByContactModeRef();
      }
    } catch (error) {}
  };
  getCustomerFollowUpPendingListByContactModeRef = async () => {
    try {
      this.loadingService.show();
      let FollowUp =
        await CustomerFollowUp.FetchEntirePendingListByContactModeRef(
          this.companyRef,
          this.Entity.p.ContactMode,
          async (errMsg) => {
            await this.toastService.present(errMsg, 1000, 'danger');
            await this.haptic.error();
          }
        );
      this.FilterFollowupList = FollowUp;
      this.followupList = FollowUp;
    } catch (error) {
    } finally {
      this.loadingService.hide();
    }
  };
}
