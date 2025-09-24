import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApprovalsMobileAppPage } from './approvals-mobile-app.page';
import { AttendanceViewMobileAppComponent } from '../attendance-view-mobile-app/attendance-view-mobile-app.component';
import { AttendanceApprovalMobileAppComponent } from './components/attendance-approval-mobile-app/attendance-approval-mobile-app.component';
import { LeaveApprovalMobileAppComponent } from './components/leave-approval-mobile-app/leave-approval-mobile-app.component';
import { SalarySlipApprovalMobileAppComponent } from './components/salary-slip-approval-mobile-app/salary-slip-approval-mobile-app.component';
import { ApprovalViewMobileAppComponent } from './components/approval-view-mobile-app/approval-view-mobile-app.component';

const routes: Routes = [
  {
    path: '',
    component: ApprovalsMobileAppPage,
    children: [
      // { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '', component: ApprovalViewMobileAppComponent },
      {
        path: 'attendance-approval',
        component: AttendanceApprovalMobileAppComponent,
      },
      {
        path: 'leave-approval',
        component: LeaveApprovalMobileAppComponent,
      },
      {
        path: 'salary-slip-approval',
        component: SalarySlipApprovalMobileAppComponent,
      },
      {
        path: 'employee-overtime',
        loadChildren: () =>
          import(
            './components/employee-overtime-mobile-app/employee-overtime-mobile-app.module'
          ).then((m) => m.EmployeeOvertimeMobileAppPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApprovalsMobileAppPageRoutingModule {}
