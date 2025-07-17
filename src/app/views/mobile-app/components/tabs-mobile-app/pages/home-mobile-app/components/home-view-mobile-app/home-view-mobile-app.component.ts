import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { App as CapacitorApp } from '@capacitor/app';
import { IonIcon, IonCol, IonGrid } from "@ionic/angular/standalone";

@Component({
  selector: 'app-home-view-mobile-app',
  templateUrl: './home-view-mobile-app.component.html',
  styleUrls: ['./home-view-mobile-app.component.scss'],
  standalone:false
})
export class HomeViewMobileAppComponent implements OnInit, OnDestroy {
  backButtonSub!: Subscription;

  constructor(
    private router: Router,
    private platform: Platform,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.loadData();

    this.backButtonSub = this.platform.backButton.subscribeWithPriority(10, async () => {
      await this.showExitConfirm();
    });
  }

  ngOnDestroy() {
    if (this.backButtonSub) {
      this.backButtonSub.unsubscribe();
    }
  }

  async showExitConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Exit App',
      message: 'Are you sure you want to exit?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Exit',
          handler: () => {
            CapacitorApp.exitApp(); // ✅ Correct usage
          },
        },
      ],
    });

    await alert.present();
  }

  todayDate = new Date().toDateString();
  attendanceData: any = [];
  recentActivities: any = [];

  // gridItems = [
  //   { label: 'Site Management', icon: 'layers-outline', routerPath: '/mobileapp/tabs/dashboard/site-management' },
  //   { label: 'Stock Management', icon: 'grid-outline', routerPath: '/mobileapp/tabs/dashboard/stock-management' },
  //   { label: 'Marketing Management', icon: 'bar-chart-outline', routerPath: '/mobileapp/tabs/dashboard/marketing-management' },
  //   { label: 'CRM', icon: 'people-outline', routerPath: '/mobileapp/tabs/dashboard/customer-relationship-management' },
  //   // { label: 'Report', icon: 'reader-outline', routerPath: '/mobileapp/tabs/dashboard/report' },
  // ];
  gridItems = [
    {
      icon: 'assets/icons/site_management_mobile_app.png',
      label: 'Site',
      routerPath: '/mobile-app/tabs/dashboard/site-management'
    },
    {
      icon: 'assets/icons/stock_mobile_app.png',
      label: 'Stock',
      routerPath: '/mobile-app/tabs/dashboard/stock-management'
    },
    // {
    //   icon: 'assets/icons/marketing_mobile_app.png',
    //   label: 'Marketing',
    //   routerPath: '/mobile-app/tabs/dashboard/marketing-management'
    // },
    {
      icon: 'assets/icons/crm_mobile_app.png',
      label: 'CRM',
      routerPath: '/mobile-app/tabs/dashboard/customer-relationship-management'
    },
    {
      icon: 'assets/icons/report_mobile_app.png',
      label: 'Accounting',
      routerPath: '/mobile-app/tabs/dashboard/accounting'
    },
  ];

  selectedIndex = 0;

  selectItem(index: number) {
    this.selectedIndex = index;
  }

  async goToRouterPath(path: string) {
    await this.router.navigate([path]);
  }

  loadData() {
    this.recentActivities = [
      {
        icon: "checkmark-circle-outline",
        title: "Submitted Report",
        date: "Mar 27, 2025",
        badge: "On Time",
        cssClass: "on-time",
      },
      {
        icon: "alert-circle-outline",
        title: "Missed Deadline",
        date: "Mar 25, 2025",
        badge: "Too Late",
        cssClass: "too-late",
      },
      {
        icon: "document-text-outline",
        title: "New Document Added",
        date: "Mar 24, 2025",
        badge: "N/A",
        cssClass: "na",
      },
      {
        icon: "cloud-upload-outline",
        title: "Backup Completed",
        date: "Mar 22, 2025",
        badge: "On Time",
        cssClass: "on-time",
      },
      {
        icon: "people-outline",
        title: "Joined New Team",
        date: "Mar 20, 2025",
        badge: "N/A",
        cssClass: "na",
      },
    ];
  }

  showOptions(item: any) {
    // Optional: Implement actions for item
  }

  viewAllActivity() {
    // Optional: Implement routing or logic
  }
}
