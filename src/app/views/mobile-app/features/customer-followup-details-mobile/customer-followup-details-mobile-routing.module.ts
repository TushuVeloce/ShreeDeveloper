import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerFollowupDetailsMobilePage } from './customer-followup-details-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerFollowupDetailsMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerFollowupDetailsMobilePageRoutingModule {}
