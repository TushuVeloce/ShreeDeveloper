import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VendorQuotationMobilePage } from './vendor-quotation-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: VendorQuotationMobilePage
  }
  ,
  {
    path: 'add',
    loadChildren: () => import('../vendor-quotation-details-mobile/vendor-quotation-details-mobile.module').then(m => m.VendorQuotationDetailsMobilePageModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('../vendor-quotation-details-mobile/vendor-quotation-details-mobile.module').then(m => m.VendorQuotationDetailsMobilePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorQuotationMobilePageRoutingModule {}
