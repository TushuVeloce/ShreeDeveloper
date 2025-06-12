import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VendorQuotationMobilePage } from './vendor-quotation-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: VendorQuotationMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorQuotationMobilePageRoutingModule {}
