import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockTransferPageRoutingModule } from './stock-transfer-routing.module';

import { StockTransferPage } from './stock-transfer.page';
import { SharedModule } from "../../../shared/shared.module";
import { AddEditStockTransferComponent } from './add-edit-stock-transfer/add-edit-stock-transfer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockTransferPageRoutingModule,
    SharedModule
],
  declarations: [StockTransferPage,AddEditStockTransferComponent]
})
export class StockTransferPageModule {}
