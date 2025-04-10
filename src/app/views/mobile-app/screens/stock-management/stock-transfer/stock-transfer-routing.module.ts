import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockTransferPage } from './stock-transfer.page';
import { AddEditStockTransferComponent } from './add-edit-stock-transfer/add-edit-stock-transfer.component';

const routes: Routes = [
  {
    path: '',
    component: StockTransferPage
  }, 
  { path: 'add', component: AddEditStockTransferComponent }, // Add Page
    { path: 'edit/:id', component: AddEditStockTransferComponent }, // Edit Page with ID
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockTransferPageRoutingModule {}
