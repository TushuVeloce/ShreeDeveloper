import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accounting-mobile',
  templateUrl: './accounting-mobile.page.html',
  styleUrls: ['./accounting-mobile.page.scss'],
  standalone: false
})
export class AccountingMobilePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  gridItems = [
    {
      icon: 'assets/icons/site_management_mobile_app.png',
      label: 'Income',
      routerPath: '/mobileapp/tabs/dashboard/accounting/income'
    },
    {
      icon: 'assets/icons/marketing_mobile_app.png',
      label: 'Expense',
      routerPath: '/mobileapp/tabs/dashboard/accounting/expense'
    },
    {
      icon: 'assets/icons/crm_mobile_app.png',
      label: 'Billing',
      routerPath: '/mobileapp/tabs/dashboard/accounting/invoice'
    },
    {
      icon: 'assets/icons/crm_mobile_app.png',
      label: 'Office',
      routerPath: '/mobileapp/tabs/dashboard/accounting/office'
    },
  ];


  selectedIndex = 0;
  expensePercent = 30; 

  selectItem(index: number) {
    this.selectedIndex = index;
  }

}
