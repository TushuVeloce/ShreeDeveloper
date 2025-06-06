import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerRelationshipManagementMobilePage } from './customer-relationship-management-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerRelationshipManagementMobilePage
  },
  {
    path: 'customer-enquiry',
    loadChildren: () => import('../customer-enquiry-mobile/customer-enquiry-mobile.module').then(m => m.CustomerEnquiryMobilePageModule)
  },
  {
    path: 'customer-followup',
    loadChildren: () => import('../customer-followup-mobile/customer-followup-mobile.module').then(m => m.CustomerFollowupMobilePageModule)
  },
  {
    path: 'pending-customer-followup',
    loadChildren: () => import('../pending-customer-followup-mobile/pending-customer-followup-mobile.module').then(m => m.PendingCustomerFollowupMobilePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRelationshipManagementMobilePageRoutingModule {}
