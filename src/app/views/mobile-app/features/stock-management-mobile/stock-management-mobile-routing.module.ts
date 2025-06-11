import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockManagementMobilePage } from './stock-management-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: StockManagementMobilePage
  },
  {
    path: 'material-requisition',
    loadChildren: () => import('../material-requisition-mobile/material-requisition-mobile.module').then(m => m.MaterialRequisitionMobilePageModule)
  },
  {
    path: 'stock-transfer',
    loadChildren: () => import('../stock-transfer-mobile/stock-transfer-mobile.module').then(m => m.StockTransferMobilePageModule)
  },
  {
    path: 'stock-consume',
    loadChildren: () => import('../stock-consume-mobile/stock-consume-mobile.module').then(m => m.StockConsumeMobilePageModule)
  },
  {
    path: 'stock-inward',
    loadChildren: () => import('../stock-inward-mobile/stock-inward-mobile.module').then(m => m.StockInwardMobilePageModule)
  }
  ,
  {
    path: 'stock-order',
    loadChildren: () => import('../stock-order-mobile/stock-order-mobile.module').then(m => m.StockOrderMobilePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockManagementMobilePageRoutingModule {}
