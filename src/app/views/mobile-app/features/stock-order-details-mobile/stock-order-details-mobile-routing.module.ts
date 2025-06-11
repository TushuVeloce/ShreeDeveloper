import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockOrderDetailsMobilePage } from './stock-order-details-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: StockOrderDetailsMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockOrderDetailsMobilePageRoutingModule {}
