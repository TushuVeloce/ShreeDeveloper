import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crm',
  templateUrl: './crm.page.html',
  styleUrls: ['./crm.page.scss'],
  standalone: false
})
export class CRMPage implements OnInit {

  crmStats: any = [];
  reminders: any = [];

  constructor(private router: Router) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // CRM Stats
    this.crmStats = [
      {
        title: 'Total Visited Customers',
        value: 123,
        icon: 'people-outline'
      },
      {
        title: 'Total Deals Open',
        value: 15,
        icon: 'folder-open-outline'
      },
      {
        title: 'Total Deals Closed',
        value: 50,
        icon: 'checkmark-circle-outline'
      },
      {
        title: 'Total Deals Done',
        value: 30,
        icon: 'trophy-outline'
      }
    ];

    // Reminders for Follow-Up
    this.reminders = [
      {
        icon: 'calendar-outline',
        title: 'Follow-up with ABC Corp.',
        date: 'April 15, 2025'
      },
      {
        icon: 'calendar-outline',
        title: 'Follow-up with XYZ Ltd.',
        date: 'April 17, 2025'
      },
      {
        icon: 'calendar-outline',
        title: 'Follow-up with Tech Innovators',
        date: 'April 19, 2025'
      },
      {
        icon: 'calendar-outline',
        title: 'Follow-up with Global Tech',
        date: 'April 22, 2025'
      }
    ];
  }

  goToVisitedCustomer() {
    this.router.navigate(['/app_homepage/tabs/crm/customer-enquiry']);
  }

  goToCustomerFollowUp() {
    this.router.navigate(['/app_homepage/tabs/crm/customer-follow-up']);
  }
}
