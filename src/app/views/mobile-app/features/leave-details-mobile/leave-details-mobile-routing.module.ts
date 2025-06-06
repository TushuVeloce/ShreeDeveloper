import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeaveDetailsMobilePage } from './leave-details-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: LeaveDetailsMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaveDetailsMobilePageRoutingModule {}
