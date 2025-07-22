import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockManagementMobileAppPage } from './stock-management-mobile-app.page';
import { StockManagementViewMobileAppPageComponent } from './components/stock-management-view-mobile-app-page/stock-management-view-mobile-app-page.component';
import { StockSummaryMobileAppComponent } from './components/stock-summary-mobile-app/stock-summary-mobile-app.component';

const routes: Routes = [
  {
    path: '',
    component: StockManagementMobileAppPage,
    children: [
      // { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '', component: StockManagementViewMobileAppPageComponent },
      { path: 'stock-summary', component: StockSummaryMobileAppComponent },
      {
        path: 'material-requisition',
        loadChildren: () => import('./components/material-requisition-mobile-app/material-requisition-mobile-app.module').then(m => m.MaterialRequisitionMobileAppPageModule)
      },
      {
        path: 'stock-order',
        loadChildren: () => import('./components/stock-order-mobile-app/stock-order-mobile-app.module').then(m => m.StockOrderMobileAppPageModule)
      },
      {
        path: 'stock-inward',
        loadChildren: () => import('./components/stock-inward-mobile-app/stock-inward-mobile-app.module').then(m => m.StockInwardMobileAppPageModule)
      },
      {
        path: 'stock-transfer',
        loadChildren: () => import('./components/stock-transfer-mobile-app/stock-transfer-mobile-app.module').then(m => m.StockTransferMobileAppPageModule)
      },
      {
        path: 'stock-consume',
        loadChildren: () => import('./components/stock-consume-mobile-app/stock-consume-mobile-app.module').then(m => m.StockConsumeMobileAppPageModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockManagementMobileAppPageRoutingModule { }
