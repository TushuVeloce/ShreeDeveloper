import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerEnquiryPage} from './customer-enquiry.page';
import { AddEditCustomerEnquiryComponent } from './add-edit-customer-enquiry/add-edit-customer-enquiry.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerEnquiryPage
  },
  { path: 'add', component: AddEditCustomerEnquiryComponent }, // Add Page
  { path: 'edit', component: AddEditCustomerEnquiryComponent }, // Edit Page with ID
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerEnquiryPageRoutingModule {}
