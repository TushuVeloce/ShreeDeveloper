import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockInwardPage } from './stock-inward.page';
import { AddEditStockInwardComponent } from './add-edit-stock-inward/add-edit-stock-inward.component';

const routes: Routes = [
  {
    path: '',
    component: StockInwardPage
  },
  { path: 'add', component: AddEditStockInwardComponent }, // Add Page
  { path: 'edit/:id', component: AddEditStockInwardComponent }, // Edit Page with ID
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockInwardPageRoutingModule { }
