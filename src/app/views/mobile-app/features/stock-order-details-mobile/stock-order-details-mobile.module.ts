import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockOrderDetailsMobilePageRoutingModule } from './stock-order-details-mobile-routing.module';

import { StockOrderDetailsMobilePage } from './stock-order-details-mobile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockOrderDetailsMobilePageRoutingModule
  ],
  declarations: [StockOrderDetailsMobilePage]
})
export class StockOrderDetailsMobilePageModule {}
