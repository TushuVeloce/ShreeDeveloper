import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accounting-view-mobile-app-page',
  templateUrl: './accounting-view-mobile-app-page.component.html',
  styleUrls: ['./accounting-view-mobile-app-page.component.scss'],
  standalone:false
})
export class AccountingViewMobileAppPageComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  gridItems = [
    {
      icon: 'assets/icons/Invoice_mobile_app.png',
      label: 'Billing',
      routerPath: '/mobile-app/tabs/dashboard/accounting/invoice'
    },
    {
      icon: 'assets/icons/income_mobile_app.png',
      label: 'Income',
      routerPath: '/mobile-app/tabs/dashboard/accounting/income'
    },
    { 
      icon: 'assets/icons/expense_mobile_app.png',
      label: 'Expense',
      routerPath: '/mobile-app/tabs/dashboard/accounting/expenses'
    },
    {
      icon: 'assets/icons/office_report_mobile_app.png',
      label: 'Office',
      routerPath: '/mobile-app/tabs/dashboard/accounting/office'
    },
  ];


  selectedIndex = 0;
  expensePercent = 30;

  selectItem(index: number) {
    this.selectedIndex = index;
  }

}
