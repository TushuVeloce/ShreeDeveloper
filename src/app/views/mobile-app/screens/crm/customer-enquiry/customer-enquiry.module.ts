import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerEnquiryPageRoutingModule } from './customer-enquiry-routing.module';

import { CustomerEnquiryPage } from './customer-enquiry.page';
import { SharedModule } from "../../../shared/shared.module";
import { AddEditCustomerEnquiryComponent } from './add-edit-customer-enquiry/add-edit-customer-enquiry.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerEnquiryPageRoutingModule,
    SharedModule
],
  declarations: [CustomerEnquiryPage, AddEditCustomerEnquiryComponent]
})
export class CustomerEnquiryPageModule {}
