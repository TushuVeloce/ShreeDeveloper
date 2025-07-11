import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockOrderMobilePageRoutingModule } from './stock-order-mobile-routing.module';

import { StockOrderMobilePage } from './stock-order-mobile.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockOrderMobilePageRoutingModule,
    SharedModule
],
  declarations: [StockOrderMobilePage]
})
export class StockOrderMobilePageModule {}
