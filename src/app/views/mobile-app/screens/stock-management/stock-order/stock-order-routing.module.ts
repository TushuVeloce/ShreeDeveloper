import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockOrderPage } from './stock-order.page';
import { AddEditStockOrderComponent } from './add-edit-stock-order/add-edit-stock-order.component';

const routes: Routes = [
  {
    path: '',
    component: StockOrderPage
  },
  { path: 'add', component: AddEditStockOrderComponent }, // Add Page
  { path: 'edit/:id', component: AddEditStockOrderComponent }, // Edit Page with ID
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockOrderPageRoutingModule { }
