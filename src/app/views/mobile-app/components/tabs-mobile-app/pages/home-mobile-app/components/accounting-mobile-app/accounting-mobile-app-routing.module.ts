import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountingMobileAppPage } from './accounting-mobile-app.page';
import { AccountingViewMobileAppPageComponent } from './components/accounting-view-mobile-app-page/accounting-view-mobile-app-page.component';

const routes: Routes = [
  {
    path: '',
    component: AccountingMobileAppPage,
    children: [
      // { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '', component: AccountingViewMobileAppPageComponent },
      {
        path: 'invoice',
        loadChildren: () => import('./components/invoice-mobile-app/invoice-mobile-app.module').then(m => m.InvoiceMobileAppPageModule)
      },
      {
        path: 'income',
        loadChildren: () => import('./components/income-mobile-app/income-mobile-app.module').then(m => m.IncomeMobileAppPageModule)
      },
      {
        path: 'office',
        loadChildren: () => import('./components/office-mobile-app/office-mobile-app.module').then(m => m.OfficeMobileAppPageModule)
      },
      {
        path: 'expenses',
        loadChildren: () => import('./components/expenses-mobile-app/expenses-mobile-app.module').then(m => m.ExpensesMobileAppPageModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountingMobileAppPageRoutingModule { }
