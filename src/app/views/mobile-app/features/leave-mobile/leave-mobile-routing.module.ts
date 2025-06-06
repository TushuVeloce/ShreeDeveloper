import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeaveMobilePage } from './leave-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: LeaveMobilePage
  },
  {
    path: 'add',
    loadChildren: () => import('../leave-details-mobile/leave-details-mobile.module').then(m => m.LeaveDetailsMobilePageModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('../leave-details-mobile/leave-details-mobile.module').then(m => m.LeaveDetailsMobilePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaveMobilePageRoutingModule {}
