import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttendanceMobileAppPage } from './attendance-mobile-app.page';
import { AttendanceViewMobileAppComponent } from './components/attendance-view-mobile-app/attendance-view-mobile-app.component';
import { AllAttendanceMobileAppComponent } from './components/all-attendance-mobile-app/all-attendance-mobile-app.component';
 
const routes: Routes = [
  {
    path: '',
    component: AttendanceMobileAppPage,
    children: [
      // { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '', component: AttendanceViewMobileAppComponent },
      { path: 'all-attendance', component: AllAttendanceMobileAppComponent },
      {
        path: 'leave-request',
        loadChildren: () => import('./components/leave-request-mobile-app/leave-request-mobile-app.module').then(m => m.LeaveRequestMobileAppPageModule)
      },
      {
        path: 'salary-slip-request',
        loadChildren: () => import('./components/salary-slip-request-mobile-app/salary-slip-request-mobile-app.module').then(m => m.SalarySlipRequestMobileAppPageModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendanceMobileAppPageRoutingModule {}
