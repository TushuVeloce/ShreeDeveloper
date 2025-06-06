import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttendancePage } from './attendance.page';

const routes: Routes = [
  {
    path: '',
    component: AttendancePage
  },
  {
    path: 'salary-slip',
    loadChildren: () => import('../salary-slip-mobile/salary-slip-mobile.module').then(m => m.SalarySlipMobilePageModule)
  },
  {
    path: 'leave',
    loadChildren: () => import('../leave-mobile/leave-mobile.module').then(m => m.LeaveMobilePageModule)
  },
  {
    path: 'attendance-details',
    loadChildren: () => import('../attendance-details-mobile/attendance-details-mobile.module').then(m => m.AttendanceDetailsMobilePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendancePageRoutingModule {}
