import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerEnquiryMobilePage } from './customer-enquiry-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerEnquiryMobilePage
  },
  {
    path: 'add',
    loadChildren: () => import('../customer-enquiry-details-mobile/customer-enquiry-details-mobile.module').then(m => m.CustomerEnquiryDetailsMobilePageModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('../customer-enquiry-details-mobile/customer-enquiry-details-mobile.module').then(m => m.CustomerEnquiryDetailsMobilePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerEnquiryMobilePageRoutingModule {}
