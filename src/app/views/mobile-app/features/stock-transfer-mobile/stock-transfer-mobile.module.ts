import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockTransferMobilePageRoutingModule } from './stock-transfer-mobile-routing.module';

import { StockTransferMobilePage } from './stock-transfer-mobile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockTransferMobilePageRoutingModule
  ],
  declarations: [StockTransferMobilePage]
})
export class StockTransferMobilePageModule {}
