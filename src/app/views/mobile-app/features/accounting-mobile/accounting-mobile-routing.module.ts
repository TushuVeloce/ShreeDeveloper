import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountingMobilePage } from './accounting-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: AccountingMobilePage
  },
  {
    path: 'income',
    loadChildren: () => import('../income-mobile/income-mobile.module').then(m => m.IncomeMobilePageModule)
  },
  {
    path: 'expense',
    loadChildren: () => import('../expense-mobile/expense-mobile.module').then(m => m.ExpenseMobilePageModule)
  },
  {
    path: 'invoice',
    loadChildren: () => import('../invoice-mobile/invoice-mobile.module').then(m => m.InvoiceMobilePageModule)
  },
  {
    path: 'Office',
    loadChildren: () => import('../accounting-report-mobile/accounting-report-mobile.module').then(m => m.AccountingReportMobilePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountingMobilePageRoutingModule {}
