import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockManagementPageRoutingModule } from './stock-management-routing.module';
import { StockManagementPage } from './stock-management.page';
import { SharedModule } from "../../shared/shared.module";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockManagementPageRoutingModule,
    SharedModule
],
  declarations:[StockManagementPage]
})
export class StockManagementPageModule {}
