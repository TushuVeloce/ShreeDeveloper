import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvoicePrintPreviewMobilePage } from './invoice-print-preview-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: InvoicePrintPreviewMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoicePrintPreviewMobilePageRoutingModule {}
