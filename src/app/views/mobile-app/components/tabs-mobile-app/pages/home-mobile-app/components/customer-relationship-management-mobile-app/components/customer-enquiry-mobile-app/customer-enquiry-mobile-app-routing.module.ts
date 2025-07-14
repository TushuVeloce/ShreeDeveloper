import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerEnquiryMobileAppPage } from './customer-enquiry-mobile-app.page';
import { CustomerEnquiryViewMobileAppComponent } from './components/customer-enquiry-view-mobile-app/customer-enquiry-view-mobile-app.component';
import { CustomerEnquiryDetailsMobileAppComponent } from './components/customer-enquiry-details-mobile-app/customer-enquiry-details-mobile-app.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerEnquiryMobileAppPage,
    children: [
      // { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '', component: CustomerEnquiryViewMobileAppComponent },
      { path: 'add', component: CustomerEnquiryDetailsMobileAppComponent },
      { path: 'edit', component: CustomerEnquiryDetailsMobileAppComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerEnquiryMobileAppPageRoutingModule {}
