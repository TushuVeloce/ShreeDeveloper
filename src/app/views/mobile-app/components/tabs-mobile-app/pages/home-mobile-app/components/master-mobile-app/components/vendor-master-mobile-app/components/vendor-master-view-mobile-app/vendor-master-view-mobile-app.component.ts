import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Material } from 'src/app/classes/domain/entities/website/masters/material/material';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { VendorService } from 'src/app/classes/domain/entities/website/masters/vendorservices/vendorservices';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { FilterItem } from 'src/app/views/mobile-app/components/shared/chip-filter-mobile-app/chip-filter-mobile-app.component';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-vendor-master-view-mobile-app',
  templateUrl: './vendor-master-view-mobile-app.component.html',
  styleUrls: ['./vendor-master-view-mobile-app.component.scss'],
  standalone: false,
})
export class VendorMasterViewMobileAppComponent {
  // Removed OnInit since ionViewWillEnter is used for primary loading
  // --- Data Properties ---
  MasterList: Vendor[] = []; // Full list of vendors (local cache)
  DisplayMasterList: Vendor[] = []; // List shown to the user (paginated/filtered) // --- END Data Properties ---
  SearchString: string = '';
  ModalOpen: boolean = false;
  selectedStatus: number = 0;
  companyRef: number = 0;

  selectedVendor: Vendor = Vendor.CreateNewInstance();

  filters: FilterItem[] = [];
  selectedFilterValues: Record<string, any> = {};
  MaterialList: Material[] = [];
  ServiceList: VendorService[] = []; // For Infinite Scroll/Mobile Pagination

  private readonly pageSize = 20;
  private currentPage = 1;
  canLoadMore = false; // Initial state is false until data is loaded

  constructor(
    private router: Router,
    private appStateManagement: AppStateManageService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    public loadingService: LoadingService,
    private dateConversionService: DateconversionService // Renamed to follow convention
  ) {} // 🔑 Primary loading logic for the view

  ionViewWillEnter = async () => {
    // Reset page and load data on entering the view
    this.currentPage = 1;
    this.MasterList = [];
    this.DisplayMasterList = [];
    await this.loadAllMasterData();
    this.loadFilters(); // Reload/initialize filters
    this.filterVendorList(); // Load the first page
  }; // 🔑 Data Fetching Logic (Consolidated)

  private loadAllMasterData = async (): Promise<void> => {
    this.companyRef = Number(
      this.appStateManagement.localStorage.getItem('SelectedCompanyRef')
    );

    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }

    await this.loadingService.show();
    try {
      // Fetch auxiliary lists in parallel
      const [materialLst, serviceLst, vendorLst] = await Promise.all([
        this.getMaterialListByCompanyRef(),
        this.getVendorServiceListByCompanyRef(),
        Vendor.FetchEntireListByCompanyRef(this.companyRef, async (errMsg) => {
          await this.toastService.present('Error ' + errMsg, 1000, 'danger');
        }),
      ]);

      this.MaterialList = materialLst;
      this.ServiceList = serviceLst;
      this.MasterList = vendorLst;

      this.canLoadMore = this.MasterList.length > this.pageSize;
    } catch (error) {
      await this.toastService.present(
        'Failed to load master data.',
        2000,
        'danger'
      );
      await this.haptic.error();
    } finally {
      await this.loadingService.hide();
    }
  }; // 🔑 Refresher Handler

  handleRefresh = async (event: CustomEvent): Promise<void> => {
    this.currentPage = 1;
    this.MasterList = [];
    this.DisplayMasterList = [];
    await this.loadAllMasterData();
    this.loadFilters();
    this.filterVendorList();
    (event.target as HTMLIonRefresherElement).complete();
  }; // 🔑 Filter initialization (Simplified, assuming no status options yet)

  loadFilters = () => {
    this.filters = [
      {
        key: 'status',
        label: 'Status',
        multi: false, // Add actual status options here if required, e.g., [{ value: 1, label: 'Active' }, { value: 2, label: 'Inactive' }]
        options: [],
        selected:
          this.selectedFilterValues['status'] > 0
            ? this.selectedFilterValues['status']
            : null,
      },
    ];
  }; // 🔑 Filter Change Handler

  onFiltersChanged = (updatedFilters: FilterItem[]) => {
    for (const filter of updatedFilters) {
      const selectedValue = filter.selected ?? null;
      this.selectedFilterValues[filter.key] = selectedValue;

      if (filter.key === 'status') {
        this.selectedStatus = selectedValue ?? 0;
      }
    }
    this.currentPage = 1; // Reset to first page
    this.filterVendorList(); // Apply filters
    this.loadFilters(); // Reload filters to update selected chips
  }; // 🔑 Main Filter and Pagination Logic

  filterVendorList = () => {
    let filtered = this.MasterList; // 1. Apply Search String

    if (this.SearchString && this.SearchString.length > 0) {
      const searchLower = this.SearchString.toLowerCase();
      filtered = filtered.filter(
        (vendor) =>
          vendor.p.Name.toLowerCase().includes(searchLower) ||
          vendor.p.MobileNo.includes(searchLower) ||
          vendor.p.CompanyName.toLowerCase().includes(searchLower) ||
          vendor.p.AddressLine1.toLowerCase().includes(searchLower)
      );
    } // 2. Apply Status Filter (if implemented) // Update DisplayMasterList with the first page of results

    //     if (this.selectedStatus > 0) {
    //       filtered = filtered.filter(vendor => vendor.p.Status === this.selectedStatus);
    //     }

    const start = (this.currentPage - 1) * this.pageSize;
    const end = this.currentPage * this.pageSize;

    this.DisplayMasterList = filtered.slice(start, end);
    this.canLoadMore = filtered.length > end;
  }; // 🔑 Search change handler

  onSearchChange = (event: any) => {
    this.SearchString = event.detail.value;
    this.currentPage = 1; // Reset to first page
    this.filterVendorList();
  }; // 🔑 Infinite Scroll Handler

  loadMoreVendors = (event: InfiniteScrollCustomEvent) => {
    if (!this.canLoadMore) {
      event.target.complete();
      return;
    }

    this.currentPage++; // Re-filter the list to get the current list *before* pagination
    let filteredList = this.getFilteredMasterList();

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    const newVendors = filteredList.slice(start, end);
    this.DisplayMasterList.push(...newVendors); // Check if we've loaded all items

    this.canLoadMore = this.DisplayMasterList.length < filteredList.length;

    event.target.complete();
  }; // Helper function to get the current filtered list for infinite scroll

  private getFilteredMasterList = (): Vendor[] => {
    let filtered = this.MasterList; // Apply Search String

    if (this.SearchString && this.SearchString.length > 0) {
      const searchLower = this.SearchString.toLowerCase();
      filtered = filtered.filter(
        (vendor) =>
          vendor.p.Name.toLowerCase().includes(searchLower) ||
          vendor.p.MobileNo.includes(searchLower) ||
          vendor.p.CompanyName.toLowerCase().includes(searchLower) ||
          vendor.p.AddressLine1.toLowerCase().includes(searchLower)
      );
    } // Apply Status Filter

    //     if (this.selectedStatus > 0) {
    //       filtered = filtered.filter(vendor => vendor.p.Status === this.selectedStatus);
    //     }

    return filtered;
  }; // 🔑 Modal Functions

  openModal(vendor: Vendor) {
    this.haptic.lightImpact();
    this.selectedVendor = vendor;
    this.ModalOpen = true;
  }

  closeModal() {
    this.ModalOpen = false;
    this.selectedVendor = Vendor.CreateNewInstance();
  } // 🔑 Navigation and Actions

  AddVendorForm = async () => {
    // Logic for navigating to add form
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    Vendor.SetCurrentInstance(Vendor.CreateNewInstance());
    this.appStateManagement.StorageKey.setItem('Editable', 'Add');
    this.router.navigate([
      'mobile-app/tabs/dashboard/masters/vendor-master/add',
    ]);
  };

  onEditClicked = async (item: Vendor) => {
    this.haptic.lightImpact();
    const SelectedVendor = item.GetEditableVersion();
    Vendor.SetCurrentInstance(SelectedVendor);
    this.appStateManagement.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate([
      'mobile-app/tabs/dashboard/masters/vendor-master/add',
    ]);
  };

  onDeleteClicked = async (item: Vendor) => {
    try {
      this.alertService.presentDynamicAlert({
        header: 'Delete',
        subHeader: 'Confirmation needed',
        message: 'Are you sure you want to delete this Bill?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'custom-cancel',
            handler: () => {},
          },
          {
            text: 'Yes, Delete',
            cssClass: 'custom-confirm',
            handler: async () => {
              try {
                await this.loadingService.show();
                await item.DeleteInstance(async () => {
                  await this.toastService.present(
                    `Vendor ${item.p.Name} has been deleted!`,
                    1000,
                    'success'
                  );
                  await this.haptic.success();
                });
                await this.loadAllMasterData();
                this.filterVendorList();
              } finally {
                await this.loadingService.hide();
              }
            },
          },
        ],
      });
    } catch (error) {
      await this.toastService.present('Something went wrong', 1000, 'danger');
      await this.haptic.error();
    }
  }; 
  private getVendorServiceListByCompanyRef = async (): Promise<
    VendorService[]
  > => {
    if (!this.companyRef) return [];
    return await VendorService.FetchEntireListByCompanyRef(
      this.companyRef,
      async (errMsg) => {
        await this.toastService.present(
          'Failed to load Vendor Service.',
          2000,
          'danger'
        );
        await this.haptic.error();
      }
    );
  };

  private getMaterialListByCompanyRef = async (): Promise<Material[]> => {
    if (!this.companyRef) return [];
    return await Material.FetchEntireListByCompanyRef(
      this.companyRef,
      async (errMsg) => {
        await this.toastService.present(
          'Failed to load Material.',
          2000,
          'danger'
        );
        await this.haptic.error();
      }
    );
  }; // 🔑 Name lookup methods

  findMaterialNameByRef = (ref: any): string => {
    const material = this.MaterialList.find((mat) => mat.p.Ref === ref);
    return material ? material.p.Name : 'Unknown Material';
  };
  findServiceNameByRef = (ref: any): string => {
    const service = this.ServiceList.find((serv) => serv.p.Ref === ref);
    return service ? service.p.Name : 'Unknown Service';
  }; // Utility function (renamed for clarity)
  formatDisplayDate = (date: string | Date): string => {
    return this.dateConversionService.formatDate(date);
  };
}
