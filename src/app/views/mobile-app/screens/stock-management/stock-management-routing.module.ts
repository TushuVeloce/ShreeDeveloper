import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockManagementPage } from './stock-management.page';

const routes: Routes = [
  {
    path: '',
    component: StockManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockManagementPageRoutingModule {}
