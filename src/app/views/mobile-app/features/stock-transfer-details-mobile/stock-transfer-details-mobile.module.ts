import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockTransferDetailsMobilePageRoutingModule } from './stock-transfer-details-mobile-routing.module';

import { StockTransferDetailsMobilePage } from './stock-transfer-details-mobile.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockTransferDetailsMobilePageRoutingModule,
    SharedModule
],
  declarations: [StockTransferDetailsMobilePage]
})
export class StockTransferDetailsMobilePageModule {}
