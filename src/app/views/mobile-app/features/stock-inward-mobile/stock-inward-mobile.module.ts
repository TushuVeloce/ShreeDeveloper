import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockInwardMobilePageRoutingModule } from './stock-inward-mobile-routing.module';

import { StockInwardMobilePage } from './stock-inward-mobile.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockInwardMobilePageRoutingModule,
    SharedModule
],
  declarations: [StockInwardMobilePage]
})
export class StockInwardMobilePageModule {}
