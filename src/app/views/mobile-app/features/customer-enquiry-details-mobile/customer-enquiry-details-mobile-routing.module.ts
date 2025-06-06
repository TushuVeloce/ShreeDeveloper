import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerEnquiryDetailsMobilePage } from './customer-enquiry-details-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerEnquiryDetailsMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerEnquiryDetailsMobilePageRoutingModule {}
