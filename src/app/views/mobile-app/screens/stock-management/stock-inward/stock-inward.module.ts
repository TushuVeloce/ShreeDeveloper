import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockInwardPageRoutingModule } from './stock-inward-routing.module';

import { StockInwardPage } from './stock-inward.page';
import { SharedModule } from "../../../shared/shared.module";
import { AddEditStockInwardComponent } from './add-edit-stock-inward/add-edit-stock-inward.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockInwardPageRoutingModule,
    SharedModule
],
  declarations: [StockInwardPage,AddEditStockInwardComponent]
})
export class StockInwardPageModule {}
