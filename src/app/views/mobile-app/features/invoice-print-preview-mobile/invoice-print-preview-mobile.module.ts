import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvoicePrintPreviewMobilePageRoutingModule } from './invoice-print-preview-mobile-routing.module';

import { InvoicePrintPreviewMobilePage } from './invoice-print-preview-mobile.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvoicePrintPreviewMobilePageRoutingModule,
    SharedModule
],
  declarations: [InvoicePrintPreviewMobilePage]
})
export class InvoicePrintPreviewMobilePageModule {}
