import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvoiceDetailsMobilePage } from './invoice-details-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: InvoiceDetailsMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoiceDetailsMobilePageRoutingModule {}
