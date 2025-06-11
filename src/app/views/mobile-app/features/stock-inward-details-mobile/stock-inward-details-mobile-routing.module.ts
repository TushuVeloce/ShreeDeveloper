import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockInwardDetailsMobilePage } from './stock-inward-details-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: StockInwardDetailsMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockInwardDetailsMobilePageRoutingModule {}
