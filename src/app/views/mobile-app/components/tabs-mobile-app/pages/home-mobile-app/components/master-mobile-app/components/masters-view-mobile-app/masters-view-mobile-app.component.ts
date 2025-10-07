import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import {
  MenuItem,
  ValidMenuItemsStateManagementMobileApp,
} from 'src/app/views/mobile-app/components/core/ValidMenuItemsStateManagementMobileApp';

interface GridItem {
  icon: string;
  label: string;
  routerPath: string;
  group: number;
}

@Component({
  selector: 'app-masters-view-mobile-app',
  templateUrl: './masters-view-mobile-app.component.html',
  styleUrls: ['./masters-view-mobile-app.component.scss'],
  standalone: false,
})
export class MastersViewMobileAppComponent implements OnInit {
  public gridItems: GridItem[] = [];

  private featureMap: {
    [key: number]: {
      label: string;
      icon: string;
      routerPath: string;
      group: number;
    };
  } = {
    100: {
      label: 'Vendor',
      icon: 'assets/icons/site_management_mobile_app.png',
      routerPath: '/mobile-app/tabs/dashboard/masters/vendor-master',
      group: 20,
    },
    200: {
      label: 'vendor Services',
      icon: 'assets/icons/report_mobile_app.png',
      routerPath: '/mobile-app/tabs/dashboard/masters/vendor-service-master',
      group: 20,
    },
  };

  public userName: string = 'User'; // Placeholder for user's name
  public currentDate: string = '';
  public isAdmin = false;
  public companyRef: number = 0;
  public selectedIndex = 0;

  constructor(
    private router: Router,
    private platform: Platform,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private dateConversion: DateconversionService,
    private appState: AppStateManageService,
    private validMenuItemsService: ValidMenuItemsStateManagementMobileApp
  ) {}

  ngOnInit() {
    // Initialization logic if needed
  }
  ionViewWillEnter(): void {
    this.initializeData();
  }
  // === Data Fetching and Initialization ===
  async initializeData(): Promise<void> {
    this.userName =
      this.appState.localStorage.getItem('UserDisplayName') || 'User';
    this.isAdmin = this.appState.localStorage.getItem('IsDefaultUser') == '1';
    this.companyRef = Number(
      this.appState.localStorage.getItem('SelectedCompanyRef')
    );

    this.filterGridItems();
  }

  navigateToMaster(masterRoute: string): void {
    // The navigation logic remains the same
    this.router.navigate(['mobile-app/masters', masterRoute]);
  }

  private filterGridItems(): void {
    // const validMenu = this.validMenuItemsService.getValidMenuItems(); // console.log('validMenu :', validMenu); // Keeping console.log for debugging purposes // 1. Map and return GridItem or null
    const validMenu = [
      {
        FeatureRef: 100,
        FeatureName: 'UnitMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 200,
        FeatureName: 'MaterialMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 300,
        FeatureName: 'StageMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 400,
        FeatureName: 'MarketingTypeMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 500,
        FeatureName: 'VendorServicesMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 600,
        FeatureName: 'VendorMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 700,
        FeatureName: 'BankAccountMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 800,
        FeatureName: 'StateMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 900,
        FeatureName: 'CountryMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 1000,
        FeatureName: 'CityMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 1100,
        FeatureName: 'DepartmentMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 1200,
        FeatureName: 'DesignationMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 1300,
        FeatureName: 'UserRoleMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 1400,
        FeatureName: 'UserRoleRight',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 1500,
        FeatureName: 'ExternalUserMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 1600,
        FeatureName: 'CompanyMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 1700,
        FeatureName: 'FinancialYearMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 1800,
        FeatureName: 'EmployeeMaster',
        FeatureGroupRef: 10,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 1900,
        FeatureName: 'AccountingTransaction',
        FeatureGroupRef: 20,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 2000,
        FeatureName: 'VendorReport',
        FeatureGroupRef: 30,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 2100,
        FeatureName: 'MaterialReport',
        FeatureGroupRef: 30,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 2200,
        FeatureName: 'EmployeeReport',
        FeatureGroupRef: 30,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
      {
        FeatureRef: 2300,
        FeatureName: 'MaterialTransaction',
        FeatureGroupRef: 20,
        CanAdd: true,
        CanEdit: true,
        CanDelete: true,
        CanView: true,
        CanPrint: true,
        CanExport: true,
      },
    ];
    const mappedItems = validMenu
      .filter((item: MenuItem) => item.CanView) // Must have CanView permission
      .map((item: MenuItem) => {
        const mappedFeature = this.featureMap[item.FeatureRef]; // Return null if the feature is not mapped

        if (!mappedFeature) {
          return null;
        } // Return the GridItem object

        return {
          label: mappedFeature.label || item.FeatureName,
          icon: mappedFeature.icon,
          routerPath: mappedFeature.routerPath,
          group: mappedFeature.group,
        } as GridItem;
      }); // 2. Filter out null values, filter out group 10 (assuming masters), and sort // console.log('mappedItems :', mappedItems); // Keeping console.log for debugging purposes

    this.gridItems = mappedItems
      .filter((item): item is GridItem => item !== null) // Type Predicate fix to filter out nulls
      .filter((item: GridItem) => item.group !== 10) // Further filtering (e.g., hiding masters)
      .sort((a, b) => a.label.localeCompare(b.label));
  }
  selectItem(index: number): void {
    this.selectedIndex = index;
  }
}
