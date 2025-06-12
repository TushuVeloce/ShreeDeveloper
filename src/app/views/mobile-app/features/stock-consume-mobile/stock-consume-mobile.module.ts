import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockConsumeMobilePageRoutingModule } from './stock-consume-mobile-routing.module';

import { StockConsumeMobilePage } from './stock-consume-mobile.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockConsumeMobilePageRoutingModule,
    SharedModule
],
  declarations: [StockConsumeMobilePage]
})
export class StockConsumeMobilePageModule {}
