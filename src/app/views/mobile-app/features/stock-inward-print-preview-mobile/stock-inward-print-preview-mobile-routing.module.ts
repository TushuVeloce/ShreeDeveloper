import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockInwardPrintPreviewMobilePage } from './stock-inward-print-preview-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: StockInwardPrintPreviewMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockInwardPrintPreviewMobilePageRoutingModule {}
