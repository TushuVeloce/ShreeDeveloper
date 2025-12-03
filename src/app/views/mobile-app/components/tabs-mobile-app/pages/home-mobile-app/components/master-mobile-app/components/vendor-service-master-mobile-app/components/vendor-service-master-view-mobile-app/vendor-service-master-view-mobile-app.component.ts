import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationFeatures } from 'src/app/classes/domain/domainenums/domainenums';
import { VendorService } from 'src/app/classes/domain/entities/website/masters/vendorservices/vendorservices';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { FeatureAccessMobileAppService } from 'src/app/services/feature-access-mobile-app.service';
import { Utils } from 'src/app/services/utils.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
// import { FilterItem } from 'src/app/views/mobile-app/components/shared/chip-filter-mobile-app/chip-filter-mobile-app.component'; // Removed as filter feature is currently commented out

@Component({
  selector: 'app-vendor-service-master-view-mobile-app',
  templateUrl: './vendor-service-master-view-mobile-app.component.html',
  styleUrls: ['./vendor-service-master-view-mobile-app.component.scss'],
  standalone: false,
})
export class VendorServiceMasterViewMobileAppComponent implements OnInit {
  // Master Data & Display List
  MasterList: VendorService[] = [];
  DisplayMasterList: VendorService[] = [];
  SelectedVendorService: VendorService = VendorService.CreateNewInstance();

  // Form Management
  FormEntity: VendorService = VendorService.CreateNewInstance();
  DetailsFormTitle: 'New Vendor Service' | 'Edit Vendor Service' =
    'New Vendor Service';
  ModalOpen: boolean = false;
  isEditMode: boolean = false; // True if editing an existing service

  // Pagination & Company State
  pageSize = 10; // Default size for mobile list view
  currentPage = 1;
  total = 0;
  companyRef: number = 0;
    featureRef: ApplicationFeatures = ApplicationFeatures.VendorServicesMaster;
    showActionColumn = false;

  constructor(
    private router: Router,
    private appStateManagement: AppStateManageService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    public loadingService: LoadingService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement,
     public access: FeatureAccessMobileAppService
  ) {}

  ngOnInit() {}

  ionViewWillEnter = async () => {
        this.access.refresh();
    this.showActionColumn =
      this.access.canPrint(this.featureRef) ||
      this.access.canEdit(this.featureRef) ||
      this.access.canDelete(this.featureRef);
    await this.loadVendorMasterIfCompanyExists();
  };

  handleRefresh = async (event: CustomEvent): Promise<void> => {
    await this.loadVendorMasterIfCompanyExists();
    (event.target as HTMLIonRefresherElement).complete();
  };

  private loadVendorMasterIfCompanyExists = async (): Promise<void> => {
    this.companyRef = Number(
      this.appStateManagement.localStorage.getItem('SelectedCompanyRef')
    );
    if (this.companyRef <= 0) {
      await this.toastService.present(
        'Company not selected. Please select a company.',
        1000,
        'danger'
      );
      await this.haptic.error();
      return;
    }
    await this.FormulateVendorServiceList();
  };

  /**
   * Fetches the list of vendor services and updates the display list.
   */
  private FormulateVendorServiceList = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      return;
    }
    await this.loadingService.show('Loading Services...');
    try {
      let lst = await VendorService.FetchEntireListByCompanyRef(
        this.companyRef,
        async (errMsg) => {
          await this.toastService.present(
            'Error fetching services: ' + errMsg,
            1000,
            'warning'
          );
          await this.haptic.warning();
        }
      );
      this.MasterList = lst;
      this.DisplayMasterList = this.MasterList;
      this.loadPaginationData();
    } finally {
      this.loadingService.hide();
    }
  };

  /**
   * Opens the modal for adding a new service.
   */
  openAddServiceModal = () => {
    if (this.companyRef <= 0) {
      this.toastService.present('Company not selected', 1000, 'danger');
      this.haptic.error();
      return;
    }
    this.FormEntity = VendorService.CreateNewInstance(); // Clear form for new entry
    this.isEditMode = false;
    this.DetailsFormTitle = 'New Vendor Service';
    this.ModalOpen = true;
  };

  /**
   * Opens the modal for editing an existing service.
   * @param service The service object to edit.
   */
  openEditServiceModal = (service: VendorService) => {
    // Create an editable copy of the existing service data
    this.FormEntity = service.GetEditableVersion();
    this.isEditMode = true;
    this.DetailsFormTitle = 'Edit Vendor Service';
    this.ModalOpen = true;
  };

  /**
   * Handles the 'Save' or 'Update' action.
   */
  saveVendorService = async () => {
    if (!this.FormEntity.p.Name || !this.FormEntity.p.Name.trim()) {
      await this.toastService.present(
        'Service Name is required',
        1500,
        'warning'
      );
      await this.haptic.warning();
      return;
    }

    await this.loadingService.show('Saving Vendor Service...');

    try {
      // Set required properties before saving
      this.FormEntity.p.CompanyRef = this.companyRef;
      this.FormEntity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName() || '';

      // The VendorService.GetEditableVersion() is not needed here as FormEntity is already either a new instance or an editable version from openEditServiceModal
      let entitiesToSave = [this.FormEntity];
      let tr = await this.utils.SavePersistableEntities(entitiesToSave);

      if (!tr.Successful) {
        await this.toastService.present(
          tr.Message || 'Error saving service.',
          2000,
          'danger'
        );
        await this.haptic.error();
        return;
      }

      await this.toastService.present(
        this.isEditMode ? 'Service updated successfully!' : 'Service added successfully!',
        2000,
        'success'
      );
      await this.haptic.success();

      this.ModalOpen = false;
      await this.FormulateVendorServiceList(); // Reload the list to show the saved data

    } catch (error) {
      console.error('Save/Edit failed:', error);
      await this.toastService.present('Error saving service.', 2000, 'danger');
      await this.haptic.error();
    } finally {
      this.loadingService.hide();
    }
  };

  /**
   * Handles the 'Cancel' action and resets the form state.
   */
  cancelServiceEdit = () => {
    this.ModalOpen = false;
    this.FormEntity = VendorService.CreateNewInstance(); // Clear the form entity
    this.isEditMode = false;
  };

  // --- DELETE LOGIC (Unchanged and correct) ---

  onDeleteClicked = async (item: VendorService) => {
    try {
      this.alertService.presentDynamicAlert({
        header: 'Delete Vendor Service',
        subHeader: `Confirm deletion of ${item.p.Name}`,
        message:
          'Are you sure you want to permanently delete this Vendor Service? This action is irreversible.',
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
                    `Vendor Service ${item.p.Name} has been deleted!`,
                    1000,
                    'success'
                  );
                  await this.haptic.success();
                });
                await this.FormulateVendorServiceList();
              } finally {
                await this.loadingService.hide();
              }
            },
          },
        ],
      });
    } catch (error) {
      await this.toastService.present(
        'Failed to process delete request.',
        1000,
        'danger'
      );
      await this.haptic.error();
    }
  };

  // --- PAGINATION LOGIC (Unchanged and correct) ---

  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length;
    this.currentPage = 1;
  };

  paginatedList = () => {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  };

  onFilteredList(list: any[]) {
    this.DisplayMasterList = list as VendorService[];
    this.loadPaginationData();
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex;
  };
}