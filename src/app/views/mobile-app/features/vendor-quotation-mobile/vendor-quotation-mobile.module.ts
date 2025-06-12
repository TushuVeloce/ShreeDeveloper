import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VendorQuotationMobilePageRoutingModule } from './vendor-quotation-mobile-routing.module';

import { VendorQuotationMobilePage } from './vendor-quotation-mobile.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VendorQuotationMobilePageRoutingModule,
    SharedModule
],
  declarations: [VendorQuotationMobilePage]
})
export class VendorQuotationMobilePageModule {}
