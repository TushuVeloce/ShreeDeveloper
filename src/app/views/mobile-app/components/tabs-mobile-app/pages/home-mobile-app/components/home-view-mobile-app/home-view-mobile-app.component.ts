import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { App as CapacitorApp } from '@capacitor/app';

import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';

interface GridItem {
  icon: string;
  label: string;
  routerPath: string;
}

interface ActivityItem {
  icon: string;
  title: string;
  date: string;
  badge: string;
  cssClass: string;
}

@Component({
  selector: 'app-home-view-mobile-app',
  templateUrl: './home-view-mobile-app.component.html',
  styleUrls: ['./home-view-mobile-app.component.scss'],
  standalone: false,
})
export class HomeViewMobileAppComponent implements OnInit, OnDestroy {
  userName: string = '';
  currentDate: string = '';
  selectedIndex = 0;

  backButtonSub!: Subscription;

  gridItems: GridItem[] = [
    {
      icon: 'assets/icons/site_management_mobile_app.png',
      label: 'Site',
      routerPath: '/mobile-app/tabs/dashboard/site-management',
    },
    {
      icon: 'assets/icons/stock_mobile_app.png',
      label: 'Stock',
      routerPath: '/mobile-app/tabs/dashboard/stock-management',
    },
    {
      icon: 'assets/icons/crm_mobile_app.png',
      label: 'CRM',
      routerPath: '/mobile-app/tabs/dashboard/customer-relationship-management',
    },
    {
      icon: 'assets/icons/report_mobile_app.png',
      label: 'Accounting',
      routerPath: '/mobile-app/tabs/dashboard/accounting',
    },
  ];

  recentActivities: ActivityItem[] = [];

  constructor(
    private router: Router,
    private platform: Platform,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private dateConversion: DateconversionService,
    private appState: AppStateManageService
  ) { }

  ngOnInit(): void {
    this.initializeData();

    // Handle hardware back button
    this.backButtonSub = this.platform.backButton.subscribeWithPriority(10, async () => {
      await this.showExitConfirmation();
    });
  }

  ngOnDestroy(): void {
    this.backButtonSub?.unsubscribe();
  }

  async initializeData(): Promise<void> {
    this.userName = this.appState.localStorage.getItem('UserDisplayName') || 'User';
    this.recentActivities = this.getRecentActivityList();

    try {
      const serverDateStr = await CurrentDateTimeRequest.GetCurrentDateTime();
      this.currentDate = this.formatDateString(serverDateStr);
    } catch (error) {
      console.error('Error fetching date:', error);
      this.currentDate = this.formatDate(new Date());
    }
  }

  formatDateString(raw: string): string {
    const parts = raw?.substring(0, 10)?.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY
    }
    return raw;
  }

  formatDate(date: string | Date): string {
    return this.dateConversion.formatDate(date);
  }

  selectItem(index: number): void {
    this.selectedIndex = index;
  }

  async goToRouterPath(path: string): Promise<void> {
    await this.router.navigate([path]);
  }

  async showExitConfirmation(): Promise<void> {
    await this.alertService.presentDynamicAlert({
      header: 'Exit App',
      subHeader: 'Confirmation Required',
      message: 'Are you sure you want to exit?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'custom-cancel',
        },
        {
          text: 'Yes, Exit',
          cssClass: 'custom-confirm',
          handler: async () => {
            await CapacitorApp.exitApp();
          },
        },
      ],
    });
  }

  getRecentActivityList(): ActivityItem[] {
    return [
      {
        icon: 'checkmark-circle-outline',
        title: 'Submitted Report',
        date: 'Mar 27, 2025',
        badge: 'On Time',
        cssClass: 'on-time',
      },
      {
        icon: 'alert-circle-outline',
        title: 'Missed Deadline',
        date: 'Mar 25, 2025',
        badge: 'Too Late',
        cssClass: 'too-late',
      },
      {
        icon: 'document-text-outline',
        title: 'New Document Added',
        date: 'Mar 24, 2025',
        badge: 'N/A',
        cssClass: 'na',
      },
      {
        icon: 'cloud-upload-outline',
        title: 'Backup Completed',
        date: 'Mar 22, 2025',
        badge: 'On Time',
        cssClass: 'on-time',
      },
      {
        icon: 'people-outline',
        title: 'Joined New Team',
        date: 'Mar 20, 2025',
        badge: 'N/A',
        cssClass: 'na',
      },
    ];
  }

  viewAllActivity(): void {
    // Optional: route to full activity log
    this.toastService.present('Full activity list not implemented yet.', 1000, 'warning');
  }

  showOptions(item: ActivityItem): void {
    // Optional: action sheet or menu
    this.toastService.present(`Options for ${item.title}`,1000,'warning');  
  }
}
