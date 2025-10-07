import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Removed ActivatedRoute as it's not used
// Removed unused: ValidationPatterns, DomainEnums, DateconversionService
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { City } from 'src/app/classes/domain/entities/website/masters/city/city';
import { Country } from 'src/app/classes/domain/entities/website/masters/country/country';
import { Material } from 'src/app/classes/domain/entities/website/masters/material/material';
import { State } from 'src/app/classes/domain/entities/website/masters/state/state';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { VendorService } from 'src/app/classes/domain/entities/website/masters/vendorservices/vendorservices';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { Utils } from 'src/app/services/utils.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';

@Component({
  selector: 'app-vendor-master-details-mobile-app',
  templateUrl: './vendor-master-details-mobile-app.component.html',
  styleUrls: ['./vendor-master-details-mobile-app.component.scss'],
  standalone: false,
})
export class VendorMasterDetailsMobileAppComponent implements OnInit {
  // --- Form Data and State ---
  // isEditMode is inferred from IsNewEntity, but kept for clarity in the template.
  isEditMode: boolean = false;
  FormEntity: Vendor = Vendor.CreateNewInstance();
  companyName = ''; // Initialized via constructor/state service call
  CompanyTypeList = DomainEnums.CompanyTypeList();
  MaterialList: Material[] = [];
  ServiceList: VendorService[] = [];
  DetailsFormTitle: 'New Vendor' | 'Edit Vendor' = 'New Vendor';
  private IsNewEntity: boolean = true;

  CountryList: Country[] = [];
  StateList: State[] = [];
  CityList: City[] = [];

  companyRef: number = 0; // --- Validation Patterns (Using raw regex as properties are already defined) ---

  private panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  private gstinPattern =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
  private mobilePattern = /^[0-9]{10}$/;
  private ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/; // private CIN = /^([LUu]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$/; // Unused
  constructor(
    private router: Router, // private route: ActivatedRoute, // Removed: Unused
    private appStateManagement: AppStateManageService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    public loadingService: LoadingService, // private DateconversionService: DateconversionService, // Removed: Unused
    private companystatemanagement: CompanyStateManagement,
    private utils: Utils
  ) {
    // Initialize company name here
    this.companyName = this.companystatemanagement.getCurrentCompanyName();
  }

  async ngOnInit() {
    // Ensure companyRef is loaded first for subsequent list loads
    // await this.loadVendorMasterIfCompanyExists();
  }

  ionViewWillEnter = async () => {
    // Re-check company reference on view enter
    await this.loadVendorMasterIfCompanyExists();
  };

  handleRefresh = async (event: CustomEvent): Promise<void> => {
    await this.loadVendorMasterIfCompanyExists(); // Re-fetch all dropdown data on refresh
    await this.FormulateCountryList(); // pass true to reset selection
    this.getMaterialListByCompanyRef();
    this.getVendorServiceListByCompanyRef();

    (event.target as HTMLIonRefresherElement).complete();
  };

  private loadVendorMasterIfCompanyExists = async (): Promise<void> => {
    this.companyRef = Number(
      this.appStateManagement.localStorage.getItem('SelectedCompanyRef')
    );
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }

    await this.FormulateCountryList();
    this.getMaterialListByCompanyRef();
    this.getVendorServiceListByCompanyRef();

    const isEditable =
      this.appStateManagement.StorageKey.getItem('Editable') === 'Edit';
    this.IsNewEntity = !isEditable;
    this.isEditMode = isEditable;

    this.DetailsFormTitle = this.IsNewEntity ? 'New Vendor' : 'Edit Vendor';

    if (isEditable) {
      this.FormEntity = Vendor.GetCurrentInstance();
      this.appStateManagement.StorageKey.removeItem('Editable');
    } else {
      this.FormEntity = Vendor.CreateNewInstance();
      Vendor.SetCurrentInstance(this.FormEntity);
    } // Load State and City based on existing refs (for Edit Mode)

    // Load State based on Default Country Ref
    if (this.FormEntity.p.CountryRef) {
      await this.getStateListByCountryRef(this.FormEntity.p.CountryRef);
    }

    // Load Cities based on Default State Ref
    if (this.FormEntity.p.StateRef) {
      await this.getCityListByStateRef(this.FormEntity.p.StateRef);
    }
  };
  /**
   * Primary form validation check.
   */

  private validateForm(): boolean {
    const v = this.FormEntity; // Check mandatory fields
    console.log('v :', v);

    if (!v.p.Name || !v.p.MobileNo || !v.p.AddressLine1) {
      this.toastService.present(
        'Please fill all mandatory fields (marked with *)',
        1500,
        'warning'
      );
      this.haptic.warning();
      return false;
    }

    // Check mandatory dropdowns
    if (!v.p.CompanyType || !v.p.CountryRef || !v.p.StateRef || !v.p.CityRef) {
      this.toastService.present(
        'Please select Company Type, Country, State, and City.',
        1500,
        'warning'
      );
      this.haptic.warning();
      return false;
    }

    // Check patterns (moved to TS for better control over error messages)
    if (!this.mobilePattern.test(v.p.MobileNo)) {
      this.toastService.present(
        'Invalid Mobile Number format (10 digits)',
        1500,
        'warning'
      );
      this.haptic.warning();
      return false;
    }
    // if (!this.panPattern.test(v.p.Pan)) {
    //   this.toastService.present(
    //     'Invalid PAN format (e.g., ABCDE1234F)',
    //     1500,
    //     'warning'
    //   );
    //   this.haptic.warning();
    //   return false;
    // }
    // if (!this.gstinPattern.test(v.p.GSTIN)) {
    //   this.toastService.present('Invalid GSTIN format', 1500, 'warning');
    //   this.haptic.warning();
    //   return false;
    // }
    // if (v.p.IFSC && !this.ifscPattern.test(v.p.IFSC)) {
    //   this.toastService.present('Invalid IFSC format', 1500, 'warning');
    //   this.haptic.warning();
    //   return false;
    // }
    if (v.p.ServiceListSuppliedByVendor.length == 0 && v.p.MaterialListSuppliedByVendor.length == 0) {
      this.toastService.present('Please select at least one Service or Material', 1500, 'warning');
      this.haptic.warning();
      return false;
    }

    return true;
  }

  getVendorServiceListByCompanyRef = async () => {
    // Ensure companyRef is available before fetching
    if (this.companyRef > 0) {
      let lst = await VendorService.FetchEntireListByCompanyRef(
        this.companyRef,
        async (errMsg) => {
          await this.toastService.present(
            'Failed to load services list.',
            2000,
            'danger'
          );
          await this.haptic.error();
        }
      );
      this.ServiceList = lst;
    }
  };

  getMaterialListByCompanyRef = async () => {
    // Ensure companyRef is available before fetching
    if (this.companyRef > 0) {
      let lst = await Material.FetchEntireListByCompanyRef(
        this.companyRef,
        async (errMsg) => {
          await this.toastService.present(
            'Failed to load materials list.',
            2000,
            'danger'
          );
          await this.haptic.error();
        }
      );
      this.MaterialList = lst;
    }
  };
  FormulateCountryList = async () => {
    this.CountryList = await Country.FetchEntireList(async (errMsg) => {
      await this.toastService.present(
        'Failed to load country list.',
        2000,
        'danger'
      );
      await this.haptic.error();
    });

    // Set default country if exists
    if (this.CountryList.length) {
      const defaultCountry = this.CountryList.find(
        (c) => c.p.Ref === this.FormEntity.p.CountryRef
      );
      this.FormEntity.p.CountryRef = defaultCountry
        ? defaultCountry.p.Ref
        : this.CountryList[0].p.Ref;

      // Fetch the corresponding states
      await this.getStateListByCountryRef(this.FormEntity.p.CountryRef);
    }
  };

  getStateListByCountryRef = async (CountryRef: number) => {
    this.StateList = await State.FetchEntireListByCountryRef(
      CountryRef,
      async (errMsg) => {
        await this.toastService.present(
          'Failed to load state list.',
          2000,
          'danger'
        );
        await this.haptic.error();
      }
    );

    // Set default state if exists
    if (this.StateList.length) {
      const defaultState = this.StateList.find(
        (s) => s.p.Ref === this.FormEntity.p.StateRef
      );
      this.FormEntity.p.StateRef = defaultState
        ? defaultState.p.Ref
        : this.StateList[0].p.Ref;

      // Fetch the corresponding cities
      await this.getCityListByStateRef(this.FormEntity.p.StateRef);
    }
  };

  getCityListByStateRef = async (StateRef: number) => {
    this.CityList = await City.FetchEntireListByStateRef(
      StateRef,
      async (errMsg) => {
        await this.toastService.present(
          'Failed to load city list.',
          2000,
          'danger'
        );
        await this.haptic.error();
      }
    );

    // Set default city if exists
    if (this.CityList.length) {
      const defaultCity = this.CityList.find(
        (c) => c.p.Ref === this.FormEntity.p.CityRef
      );
      this.FormEntity.p.CityRef = defaultCity
        ? defaultCity.p.Ref
        : this.CityList[0].p.Ref;
    }
  };
  onMaterialsChange = (selectedRefs: any) => {
    this.FormEntity.p.MaterialListSuppliedByVendor = selectedRefs;
  };
  onServicesChange = (selectedRefs: any) => {
    this.FormEntity.p.ServiceListSuppliedByVendor = selectedRefs;
  };
  /**
   * Handles the form submission (Save/Update).
   */

  async saveVendorDetails(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    await this.loadingService.show(
      this.DetailsFormTitle === 'Edit Vendor'
        ? 'Updating Vendor...'
        : 'Adding Vendor...'
    );

    try {
      this.FormEntity.p.CompanyRef = this.companyRef;
      this.FormEntity.p.CompanyName =
        this.companystatemanagement.getCurrentCompanyName();
      // Set audit fields
      if (this.FormEntity.p.CreatedBy === 0) {
        const loginEmployeeRef = Number(
          this.appStateManagement.localStorage.getItem('LoginEmployeeRef')
        );
        this.FormEntity.p.CreatedBy = loginEmployeeRef;
        this.FormEntity.p.UpdatedBy = loginEmployeeRef;
      } else {
        // Only update UpdatedBy if it's an existing record
        this.FormEntity.p.UpdatedBy = Number(
          this.appStateManagement.localStorage.getItem('LoginEmployeeRef')
        );
      }

      let entityToSave = this.FormEntity.GetEditableVersion();
      let entitiesToSave = [entityToSave];
      let tr = await this.utils.SavePersistableEntities(entitiesToSave);

      if (!tr.Successful) {
        await this.toastService.present(
          tr.Message || 'Failed to save vendor details.',
          2000,
          'danger'
        );
        await this.haptic.error();
        return;
      }

      const successMessage =
        this.DetailsFormTitle === 'Edit Vendor'
          ? 'Vendor updated successfully!'
          : 'Vendor added successfully!';

      await this.toastService.present(successMessage, 2000, 'success');
      await this.haptic.success();

      this.router.navigate(['mobile-app/tabs/dashboard/masters/vendor-master']);
    } catch (error) {
      console.error('Error saving vendor:', error);
      await this.toastService.present(
        'Failed to save vendor details due to an unexpected error.',
        2000,
        'danger'
      );
      await this.haptic.error();
    } finally {
      this.loadingService.hide();
    }
  }

  cancelForm(): void {
    this.router.navigate(['mobile-app/tabs/dashboard/masters/vendor-master']);
  }
}
