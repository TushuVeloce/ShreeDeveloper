import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvoiceMobilePage } from './invoice-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: InvoiceMobilePage
  },
  {
    path: 'add',
    loadChildren: () => import('../invoice-details-mobile/invoice-details-mobile.module').then(m => m.InvoiceDetailsMobilePageModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('../invoice-details-mobile/invoice-details-mobile.module').then(m => m.InvoiceDetailsMobilePageModule)
  }, 
  {
    path: 'print',
    loadChildren: () => import('../invoice-print-preview-mobile/invoice-print-preview-mobile.module').then(m => m.InvoicePrintPreviewMobilePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoiceMobilePageRoutingModule {}
