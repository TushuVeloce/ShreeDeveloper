import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CRMPage } from './crm.page';

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
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CRMPageRoutingModule {}
