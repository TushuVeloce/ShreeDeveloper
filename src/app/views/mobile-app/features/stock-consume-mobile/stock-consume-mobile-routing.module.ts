import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockConsumeMobilePage } from './stock-consume-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: StockConsumeMobilePage
  },
  {
    path: 'add',
    loadChildren: () => import('../stock-consume-details-mobile/stock-consume-details-mobile.module').then(m => m.StockConsumeDetailsMobilePageModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('../stock-consume-details-mobile/stock-consume-details-mobile.module').then(m => m.StockConsumeDetailsMobilePageModule)
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockConsumeMobilePageRoutingModule {}
