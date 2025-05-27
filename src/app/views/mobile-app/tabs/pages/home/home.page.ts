import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone:false
})
export class HomePage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    this.loadData();
  }
  gridItems = [
    { label: 'Site Management', icon: 'layers-outline', routerPath: '/app_homepage/tabs/site-management' },
    // { label: 'Stock Management', icon: 'grid-outline', routerPath: '/app_homepage/tabs/stock-management' },
    { label: 'Marketing Management', icon: 'bar-chart-outline', routerPath: '/app_homepage/tabs/marketing-management' },
    { label: 'CRM', icon: 'people-outline', routerPath: '/app_homepage/tabs/crm' },
    // { label: 'Report', icon: 'reader-outline', routerPath: '/app_homepage/tabs/report' },
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
  }

  viewAllActivity() {
  }
}
