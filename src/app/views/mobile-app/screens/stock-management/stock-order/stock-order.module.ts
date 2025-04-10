import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockOrderPageRoutingModule } from './stock-order-routing.module';

import { StockOrderPage } from './stock-order.page';
import { SharedModule } from "../../../shared/shared.module";
import { AddEditStockOrderComponent } from './add-edit-stock-order/add-edit-stock-order.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockOrderPageRoutingModule,
    SharedModule
],
  declarations: [StockOrderPage,AddEditStockOrderComponent]
})
export class StockOrderPageModule {}
