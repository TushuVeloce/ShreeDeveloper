import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockTransferMobilePage } from './stock-transfer-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: StockTransferMobilePage
  },
  {
    path: 'add',
    loadChildren: () => import('../stock-transfer-details-mobile/stock-transfer-details-mobile.module').then(m => m.StockTransferDetailsMobilePageModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('../stock-transfer-details-mobile/stock-transfer-details-mobile.module').then(m => m.StockTransferDetailsMobilePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockTransferMobilePageRoutingModule {}
