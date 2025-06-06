import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarketingManagementMobilePage } from './marketing-management-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: MarketingManagementMobilePage
  },
  {
    path: 'add',
    loadChildren: () => import('../marketing-management-details-mobile/marketing-management-details-mobile.module').then(m => m.MarketingManagementDetailsMobilePageModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('../marketing-management-details-mobile/marketing-management-details-mobile.module').then(m => m.MarketingManagementDetailsMobilePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketingManagementMobilePageRoutingModule { }
