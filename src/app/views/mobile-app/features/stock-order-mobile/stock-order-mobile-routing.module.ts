import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockOrderMobilePage } from './stock-order-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: StockOrderMobilePage
  },
  {
    path: 'add',
    loadChildren: () => import('../stock-order-details-mobile/stock-order-details-mobile.module').then(m => m.StockOrderDetailsMobilePageModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('../stock-order-details-mobile/stock-order-details-mobile.module').then(m => m.StockOrderDetailsMobilePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockOrderMobilePageRoutingModule {}
