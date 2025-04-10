import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock-management',
  templateUrl: './stock-management.page.html',
  styleUrls: ['./stock-management.page.scss'],
  standalone:false
})
export class StockManagementPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    this.loadData();
  }
  gridItems = [
    { label: 'Material Requisition', icon: 'layers-outline', routerPath: '/app_homepage/tabs/stock-management/material-requisition' },
    { label: 'Stock Order', icon: 'grid-outline', routerPath: '/app_homepage/tabs/stock-management/stock-order' },
    { label: 'Stock Inward', icon: 'bar-chart-outline', routerPath: '/app_homepage/tabs/stock-management/stock-inward' },
    { label: 'Stock Consume', icon: 'reader-outline', routerPath: '/app_homepage/tabs/stock-management/stock-consume' },
    { label: 'Stock Transfer', icon: 'people-outline', routerPath: '/app_homepage/tabs/stock-management/stock-transfer' },
  ];
  // Navigate to the Task page
  async goToRouterPath(path: string) {
    await this.router.navigate([path]);
  }
  todayDate = new Date().toDateString();
  attendanceData: any = [];
  recentActivities: any = [];

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
    console.log('Options for', item.title);
  }

  viewAllActivity() {
    console.log('Viewing all activity');
  }
}
