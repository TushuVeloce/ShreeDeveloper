import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerFollowUpPage } from './customer-follow-up.page';
import { AddEditCustomerFollowUpComponent } from './add-edit-customer-follow-up/add-edit-customer-follow-up.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerFollowUpPage
  },
  { path: 'add', component: AddEditCustomerFollowUpComponent }, // Add Page
  { path: 'edit/:id', component: AddEditCustomerFollowUpComponent }, // Edit Page with ID
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerFollowUpPageRoutingModule { }
