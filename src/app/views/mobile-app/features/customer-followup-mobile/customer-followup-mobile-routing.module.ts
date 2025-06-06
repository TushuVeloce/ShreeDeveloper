import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerFollowupMobilePage } from './customer-followup-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerFollowupMobilePage
  },
  {
    path: 'add',
    loadChildren: () => import('../customer-followup-details-mobile/customer-followup-details-mobile.module').then(m => m.CustomerFollowupDetailsMobilePageModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('../customer-followup-details-mobile/customer-followup-details-mobile.module').then(m => m.CustomerFollowupDetailsMobilePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerFollowupMobilePageRoutingModule {}
