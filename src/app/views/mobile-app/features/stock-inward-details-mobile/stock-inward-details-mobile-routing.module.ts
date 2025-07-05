import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockInwardDetailsMobilePage } from './stock-inward-details-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: StockInwardDetailsMobilePage
  },
  {
    path: 'edit',
    loadChildren: () => import('../stock-inward-details-mobile/stock-inward-details-mobile.module').then(m => m.StockInwardDetailsMobilePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockInwardDetailsMobilePageRoutingModule {}
