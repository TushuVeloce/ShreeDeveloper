import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PendingCustomerFollowupMobilePage } from './pending-customer-followup-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: PendingCustomerFollowupMobilePage
  }
  // ,
  // {
  //   path: 'add',
  //   loadChildren: () => import('../pending-customer-followup-details-mobile/pending-customer-followup-details-mobile-routing.module').then(m => m.PendingCustomerFollowupDetailsMobilePageRoutingModule)
  // },
  // {
  //   path: 'edit',
  //   loadChildren: () => import('../pending-customer-followup-details-mobile/pending-customer-followup-details-mobile-routing.module').then(m => m.PendingCustomerFollowupDetailsMobilePageRoutingModule)
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PendingCustomerFollowupMobilePageRoutingModule {}
