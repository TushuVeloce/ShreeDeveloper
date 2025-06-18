import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VendorQuotationDetailsMobilePage } from './vendor-quotation-details-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: VendorQuotationDetailsMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorQuotationDetailsMobilePageRoutingModule {}
