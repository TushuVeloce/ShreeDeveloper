import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockConsumePage } from './stock-consume.page';
import { AddEditStockConsumeComponent } from './add-edit-stock-consume/add-edit-stock-consume.component';

const routes: Routes = [
  {
    path: '',
    component: StockConsumePage
  },
      { path: 'add', component: AddEditStockConsumeComponent }, // Add Page
      { path: 'edit/:id', component: AddEditStockConsumeComponent }, // Edit Page with ID
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockConsumePageRoutingModule {}
