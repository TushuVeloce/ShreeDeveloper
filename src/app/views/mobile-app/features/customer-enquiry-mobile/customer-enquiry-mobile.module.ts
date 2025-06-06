import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerEnquiryMobilePageRoutingModule } from './customer-enquiry-mobile-routing.module';

import { CustomerEnquiryMobilePage } from './customer-enquiry-mobile.page';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerEnquiryMobilePageRoutingModule,
    LoaderComponent,
    SharedModule
],
  declarations: [CustomerEnquiryMobilePage]
})
export class CustomerEnquiryMobilePageModule {}
