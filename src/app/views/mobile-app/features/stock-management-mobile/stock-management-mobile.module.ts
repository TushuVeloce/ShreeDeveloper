import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockManagementMobilePageRoutingModule } from './stock-management-mobile-routing.module';

import { StockManagementMobilePage } from './stock-management-mobile.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockManagementMobilePageRoutingModule,
    SharedModule
],
  declarations: [StockManagementMobilePage]
})
export class StockManagementMobilePageModule {}
