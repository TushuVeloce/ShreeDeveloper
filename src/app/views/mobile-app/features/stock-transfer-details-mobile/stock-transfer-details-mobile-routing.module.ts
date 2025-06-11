import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockTransferDetailsMobilePage } from './stock-transfer-details-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: StockTransferDetailsMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockTransferDetailsMobilePageRoutingModule {}
