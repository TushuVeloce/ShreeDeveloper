import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CRMPage } from './crm.page';
import { CustomerPendingFollowUpMobileAppComponent } from './customer-pending-follow-up-mobile-app/customer-pending-follow-up-mobile-app.component';

const routes: Routes = [
  {
    path: '',
    component: CRMPage
  },
  {
    path: 'customer-enquiry',
    loadChildren: () => import('./customer-enquiry/customer-enquiry.module').then(m => m.CustomerEnquiryPageModule)
  },
  {
    path: 'customer-follow-up',
    loadChildren: () => import('./customer-follow-up/customer-follow-up.module').then( m => m.CustomerFollowUpPageModule)
  },
  {
    path: 'pending-customer-follow-up',
    component:CustomerPendingFollowUpMobileAppComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CRMPageRoutingModule {}
