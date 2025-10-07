import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { FilterItem } from 'src/app/views/mobile-app/components/shared/chip-filter-mobile-app/chip-filter-mobile-app.component';

@Component({
  selector: 'app-vendor-service-master-details-mobile-app',
  templateUrl: './vendor-service-master-details-mobile-app.component.html',
  styleUrls: ['./vendor-service-master-details-mobile-app.component.scss'],
  standalone:false
})
export class VendorServiceMasterDetailsMobileAppComponent  implements OnInit {

ngOnInit() {}
  SearchString: string = '';
  ModalOpen: boolean = false;
  selectedStatus: number = 0;
  companyRef: number = 0;
  selectedFilters: any[] = [];

  filters: FilterItem[] = [];
  selectedFilterValues: Record<string, any> = {};

  constructor(
    private router: Router,
    private appStateManagement: AppStateManageService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    public loadingService: LoadingService,
    private DateconversionService: DateconversionService
  ) {}

  ionViewWillEnter = async () => {
    await this.loadVendorMasterIfCompanyExists();
    this.loadFilters();
  };

  handleRefresh = async (event: CustomEvent): Promise<void> => {
    await this.loadVendorMasterIfCompanyExists();
    this.loadFilters();
    (event.target as HTMLIonRefresherElement).complete();
  };

  loadFilters = () => {
    this.filters = [
      {
        key: 'status',
        label: 'Status',
        multi: false,
        options: [],
        selected:
          this.selectedFilterValues['status'] > 0
            ? this.selectedFilterValues['status']
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
        case 'status':
          this.selectedStatus = selectedValue ?? 0;
          break;
      }
    }
    // this.filterCustomerList();
    this.loadFilters(); // Reload filters with updated options & preserve selections
  };
  private loadVendorMasterIfCompanyExists = async (): Promise<void> => {
    this.companyRef = Number(
      this.appStateManagement.localStorage.getItem('SelectedCompanyRef')
    );
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
  };

}
