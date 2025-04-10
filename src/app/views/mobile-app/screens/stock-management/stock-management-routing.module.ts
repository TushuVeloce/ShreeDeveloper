import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockManagementPage } from './stock-management.page';

const routes: Routes = [
  {
    path: '',
    component: StockManagementPage
  },  {
    path: 'material-requisition',
    loadChildren: () => import('./material-requisition/material-requisition.module').then( m => m.MaterialRequisitionPageModule)
  },
  {
    path: 'stock-order',
    loadChildren: () => import('./stock-order/stock-order.module').then( m => m.StockOrderPageModule)
  },
  {
    path: 'stock-inward',
    loadChildren: () => import('./stock-inward/stock-inward.module').then( m => m.StockInwardPageModule)
  },
  {
    path: 'stock-consume',
    loadChildren: () => import('./stock-consume/stock-consume.module').then( m => m.StockConsumePageModule)
  },
  {
    path: 'stock-transfer',
    loadChildren: () => import('./stock-transfer/stock-transfer.module').then( m => m.StockTransferPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockManagementPageRoutingModule {}
