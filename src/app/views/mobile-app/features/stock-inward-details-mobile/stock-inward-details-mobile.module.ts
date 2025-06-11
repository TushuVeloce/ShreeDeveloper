import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockInwardDetailsMobilePageRoutingModule } from './stock-inward-details-mobile-routing.module';

import { StockInwardDetailsMobilePage } from './stock-inward-details-mobile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockInwardDetailsMobilePageRoutingModule
  ],
  declarations: [StockInwardDetailsMobilePage]
})
export class StockInwardDetailsMobilePageModule {}
