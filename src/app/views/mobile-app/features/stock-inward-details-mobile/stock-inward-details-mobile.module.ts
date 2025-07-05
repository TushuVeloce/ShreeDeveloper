import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockInwardDetailsMobilePageRoutingModule } from './stock-inward-details-mobile-routing.module';

import { StockInwardDetailsMobilePage } from './stock-inward-details-mobile.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockInwardDetailsMobilePageRoutingModule,
    SharedModule
],
  declarations: [StockInwardDetailsMobilePage]
})
export class StockInwardDetailsMobilePageModule {}
