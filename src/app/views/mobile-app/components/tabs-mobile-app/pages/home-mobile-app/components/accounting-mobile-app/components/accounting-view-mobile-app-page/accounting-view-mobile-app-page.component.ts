import { Component, OnInit } from '@angular/core';
import { ApplicationFeatures } from 'src/app/classes/domain/domainenums/domainenums';
import { FeatureAccessMobileAppService } from 'src/app/services/feature-access-mobile-app.service';

@Component({
  selector: 'app-accounting-view-mobile-app-page',
  templateUrl: './accounting-view-mobile-app-page.component.html',
  styleUrls: ['./accounting-view-mobile-app-page.component.scss'],
  standalone: false,
})
export class AccountingViewMobileAppPageComponent implements OnInit {
  constructor(public access: FeatureAccessMobileAppService) {}

  ngOnInit() {
    this.access.refresh();
    // Filter grid items based on access
    this.gridItems = this.gridItems.filter((item) =>
      this.access.hasAnyAccess(item.Ref)
    );
  }

  gridItems = [
    {
      icon: 'assets/icons/Invoice_mobile_app.png',
      label: 'Billing',
      routerPath: '/mobile-app/tabs/dashboard/accounting/invoice',
      Ref: ApplicationFeatures.Billing,
    },
    {
      icon: 'assets/icons/income_mobile_app.png',
      label: 'Income',
      routerPath: '/mobile-app/tabs/dashboard/accounting/income',
      Ref: ApplicationFeatures.Income,
    },
    {
      icon: 'assets/icons/expense_mobile_app.png',
      label: 'Expense',
      routerPath: '/mobile-app/tabs/dashboard/accounting/expenses',
      Ref: ApplicationFeatures.Expense,
    },
    {
      icon: 'assets/icons/office_report_mobile_app.png',
      label: 'Office',
      routerPath: '/mobile-app/tabs/dashboard/accounting/office',
      Ref: ApplicationFeatures.OfficeReport,
    },
    {
      icon: 'assets/icons/office_report_mobile_app.png',
      label: 'Bill Payable Report',
      routerPath: '/mobile-app/tabs/dashboard/accounting/bill-payable',
      Ref: ApplicationFeatures.BillPayableReport,
    },
  ];

  selectedIndex = 0;
  expensePercent = 30;

  selectItem(index: number) {
    this.selectedIndex = index;
  }
}
