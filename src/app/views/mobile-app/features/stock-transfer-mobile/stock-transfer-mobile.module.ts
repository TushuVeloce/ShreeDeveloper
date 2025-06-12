import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockTransferMobilePageRoutingModule } from './stock-transfer-mobile-routing.module';

import { StockTransferMobilePage } from './stock-transfer-mobile.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockTransferMobilePageRoutingModule,
    SharedModule
],
  declarations: [StockTransferMobilePage]
})
export class StockTransferMobilePageModule {}
