import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockConsumeMobilePageRoutingModule } from './stock-consume-mobile-routing.module';

import { StockConsumeMobilePage } from './stock-consume-mobile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockConsumeMobilePageRoutingModule
  ],
  declarations: [StockConsumeMobilePage]
})
export class StockConsumeMobilePageModule {}
