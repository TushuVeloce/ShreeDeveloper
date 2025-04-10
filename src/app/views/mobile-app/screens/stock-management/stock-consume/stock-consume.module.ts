import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockConsumePageRoutingModule } from './stock-consume-routing.module';

import { StockConsumePage } from './stock-consume.page';
import { SharedModule } from "../../../shared/shared.module";
import { AddEditStockConsumeComponent } from './add-edit-stock-consume/add-edit-stock-consume.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockConsumePageRoutingModule,
    SharedModule
],
  declarations: [StockConsumePage,AddEditStockConsumeComponent]
})
export class StockConsumePageModule {}
