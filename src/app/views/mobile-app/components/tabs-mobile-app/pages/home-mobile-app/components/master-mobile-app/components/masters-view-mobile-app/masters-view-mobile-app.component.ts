import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { ApplicationFeatures } from 'src/app/classes/domain/domainenums/domainenums';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { FeatureAccessMobileAppService } from 'src/app/services/feature-access-mobile-app.service';
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
  Ref: number;
}

@Component({
  selector: 'app-masters-view-mobile-app',
  templateUrl: './masters-view-mobile-app.component.html',
  styleUrls: ['./masters-view-mobile-app.component.scss'],
  standalone: false,
})
export class MastersViewMobileAppComponent implements OnInit {
  public gridItems: GridItem[] = [{
      label: 'Vendor',
      icon: 'assets/icons/site_management_mobile_app.png',
      routerPath: '/mobile-app/tabs/dashboard/masters/vendor-master',
       Ref: ApplicationFeatures.VendorMaster,
    },
  {
      label: 'vendor Services',
      icon: 'assets/icons/report_mobile_app.png',
      routerPath: '/mobile-app/tabs/dashboard/masters/vendor-service-master',
       Ref: ApplicationFeatures.VendorServicesMaster,
    },];

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
    public access: FeatureAccessMobileAppService
  ) {}

  ngOnInit() {
    // Initialization logic if needed
  }
  ionViewWillEnter(): void {
        this.gridItems = this.gridItems.filter((item) =>
      this.access.hasAnyAccess(item.Ref)
    );
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
  }

  navigateToMaster(masterRoute: string): void {
    // The navigation logic remains the same
    this.router.navigate(['mobile-app/masters', masterRoute]);
  }

  selectItem(index: number): void {
    this.selectedIndex = index;
  }
}
