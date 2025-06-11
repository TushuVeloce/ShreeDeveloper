import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockConsumeDetailsMobilePage } from './stock-consume-details-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: StockConsumeDetailsMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockConsumeDetailsMobilePageRoutingModule {}
