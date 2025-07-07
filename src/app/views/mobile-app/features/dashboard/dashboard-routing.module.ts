import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage
  },
  {
    path: 'site-management',
    loadChildren: () => import('../site-management-mobile/site-management-mobile.module').then(m => m.SiteManagementMobilePageModule)
  },
  {
    path: 'stock-management',
    loadChildren: () => import('../stock-management-mobile/stock-management-mobile.module').then(m => m.StockManagementMobilePageModule)
  },
  {
    path: 'marketing-management',
    loadChildren: () => import('../marketing-management-mobile/marketing-management-mobile.module').then(m => m.MarketingManagementMobilePageModule)
  },
  {
    path: 'report',
    loadChildren: () => import('../site-management-mobile/site-management-mobile.module').then(m => m.SiteManagementMobilePageModule)
  },
  {
    path: 'customer-relationship-management',
    loadChildren: () => import('../customer-relationship-management-mobile/customer-relationship-management-mobile.module').then(m => m.CustomerRelationshipManagementMobilePageModule)
  },
  {
    path: 'accounting',
    loadChildren: () => import('../accounting-mobile/accounting-mobile.module').then(m => m.AccountingMobilePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
