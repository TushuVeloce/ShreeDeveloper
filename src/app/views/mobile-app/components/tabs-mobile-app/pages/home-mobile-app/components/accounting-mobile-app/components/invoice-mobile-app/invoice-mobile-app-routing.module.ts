import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvoiceMobileAppPage } from './invoice-mobile-app.page';
import { InvoiceViewMobileAppComponent } from './components/invoice-view-mobile-app/invoice-view-mobile-app.component';
import { InvoiceDetailsMobileAppComponent } from './components/invoice-details-mobile-app/invoice-details-mobile-app.component';
import { InvoicePrintMobileAppComponent } from './components/invoice-print-mobile-app/invoice-print-mobile-app.component';

const routes: Routes = [
  {
    path: '',
    component: InvoiceMobileAppPage,
    children: [
      // { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '', component: InvoiceViewMobileAppComponent },
      { path: 'add', component: InvoiceDetailsMobileAppComponent },
      { path: 'edit', component: InvoiceDetailsMobileAppComponent },
      { path: 'print', component: InvoicePrintMobileAppComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoiceMobileAppPageRoutingModule {}
