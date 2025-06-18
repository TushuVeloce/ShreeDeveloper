import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VendorQuotationDetailsMobilePageRoutingModule } from './vendor-quotation-details-mobile-routing.module';

import { VendorQuotationDetailsMobilePage } from './vendor-quotation-details-mobile.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VendorQuotationDetailsMobilePageRoutingModule,
    SharedModule
],
  declarations: [VendorQuotationDetailsMobilePage]
})
export class VendorQuotationDetailsMobilePageModule {}
