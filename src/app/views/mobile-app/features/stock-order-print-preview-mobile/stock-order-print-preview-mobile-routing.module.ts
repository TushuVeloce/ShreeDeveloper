import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockOrderPrintPreviewMobilePage } from './stock-order-print-preview-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: StockOrderPrintPreviewMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockOrderPrintPreviewMobilePageRoutingModule {}
