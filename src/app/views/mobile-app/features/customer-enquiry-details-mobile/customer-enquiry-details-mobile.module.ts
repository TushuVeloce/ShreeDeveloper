import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerEnquiryDetailsMobilePageRoutingModule } from './customer-enquiry-details-mobile-routing.module';

import { CustomerEnquiryDetailsMobilePage } from './customer-enquiry-details-mobile.page';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerEnquiryDetailsMobilePageRoutingModule,
    LoaderComponent,
    SharedModule
],
  declarations: [CustomerEnquiryDetailsMobilePage]
})
export class CustomerEnquiryDetailsMobilePageModule {}
