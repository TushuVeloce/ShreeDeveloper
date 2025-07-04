import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockInwardPrintPreviewMobilePageRoutingModule } from './stock-inward-print-preview-mobile-routing.module';

import { StockInwardPrintPreviewMobilePage } from './stock-inward-print-preview-mobile.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockInwardPrintPreviewMobilePageRoutingModule,
    SharedModule
],
  declarations: [StockInwardPrintPreviewMobilePage]
})
export class StockInwardPrintPreviewMobilePageModule {}
