import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VendorQuotationMobilePageRoutingModule } from './vendor-quotation-mobile-routing.module';

import { VendorQuotationMobilePage } from './vendor-quotation-mobile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VendorQuotationMobilePageRoutingModule
  ],
  declarations: [VendorQuotationMobilePage]
})
export class VendorQuotationMobilePageModule {}
