import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockInwardMobilePage } from './stock-inward-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: StockInwardMobilePage
  },
  {
    path: 'add',
    loadChildren: () => import('../stock-inward-details-mobile/stock-inward-details-mobile.module').then(m => m.StockInwardDetailsMobilePageModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('../stock-inward-details-mobile/stock-inward-details-mobile.module').then(m => m.StockInwardDetailsMobilePageModule)
  },
  {
    path: 'print',
    loadChildren: () => import('../stock-inward-print-preview-mobile/stock-inward-print-preview-mobile.module').then(m => m.StockInwardPrintPreviewMobilePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockInwardMobilePageRoutingModule { }
