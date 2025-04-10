import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
  standalone:false
})
export class ReportPage implements OnInit {

constructor(private router: Router) { }

  ngOnInit() {
  }
  gridItems = [
    { label: 'Billing Report', icon: 'receipt-outline', routerPath: '/app_homepage/tabs/report/billing-report' },
    { label: 'Office Report', icon: 'business-outline', routerPath: '/app_homepage/tabs/report/office-report' },
    { label: 'Booking Report', icon: 'calendar-outline', routerPath: '/app_homepage/tabs/report/booking-report' },
    { label: 'Stock Report', icon: 'cube-outline', routerPath: '/app_homepage/tabs/report/stock-report' },
    { label: 'CRM Report', icon: 'people-outline', routerPath: '/app_homepage/tabs/report/crm-report' },
    { label: 'Follow-Up Report', icon: 'chatbubble-ellipses-outline', routerPath: '/app_homepage/tabs/report/followup-report' },
    { label: 'Employee Report', icon: 'person-outline', routerPath: '/app_homepage/tabs/report/employee-report' },
    { label: 'Marketing Report', icon: 'megaphone-outline', routerPath: '/app_homepage/tabs/report/marketing-report' },
    { label: 'Stages Report', icon: 'podium-outline', routerPath: '/app_homepage/tabs/report/stages-report' },
    { label: 'Account Report', icon: 'wallet-outline', routerPath: '/app_homepage/tabs/report/account-report' },
  ];
  // Navigate to the Task page
  async goToRouterPath(path: string) {
    await this.router.navigate([path]);
  }
}
