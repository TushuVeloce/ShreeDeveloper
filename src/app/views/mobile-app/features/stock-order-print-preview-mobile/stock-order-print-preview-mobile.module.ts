import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockOrderPrintPreviewMobilePageRoutingModule } from './stock-order-print-preview-mobile-routing.module';

import { StockOrderPrintPreviewMobilePage } from './stock-order-print-preview-mobile.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockOrderPrintPreviewMobilePageRoutingModule,
    SharedModule
],
  declarations: [StockOrderPrintPreviewMobilePage]
})
export class StockOrderPrintPreviewMobilePageModule {}
