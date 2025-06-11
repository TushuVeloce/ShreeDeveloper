import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockConsumeDetailsMobilePageRoutingModule } from './stock-consume-details-mobile-routing.module';

import { StockConsumeDetailsMobilePage } from './stock-consume-details-mobile.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockConsumeDetailsMobilePageRoutingModule,
    SharedModule
],
  declarations: [StockConsumeDetailsMobilePage]
})
export class StockConsumeDetailsMobilePageModule {}
