import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttendanceManagementPage } from './attendance-management.page';
import { AttendanceDetailsComponent } from './Views/attendance-details/attendance-details.component';
import { SalarySlipMobileAppComponent } from './Views/salary-slip-mobile-app/salary-slip-mobile-app.component';
import { LeaveRequestMobileAppComponent } from './Views/leave-request-mobile-app/leave-request-mobile-app.component';
import { AddLeaveRequestMobileAppComponent } from './Views/add-leave-request-mobile-app/add-leave-request-mobile-app.component';
import { AddSalarySlipMobileAppComponent } from './Views/add-salary-slip-mobile-app/add-salary-slip-mobile-app.component';
import { ViewAllPresentEmployeeComponent } from './Views/view-all-present-employee/view-all-present-employee.component';

const routes: Routes = [
  {
    path: '',
    component: AttendanceManagementPage
  },
  { path: 'attendance-details', component: AttendanceDetailsComponent },
  { path: 'salary-slip', component: SalarySlipMobileAppComponent },
  { path: 'add-salary-slip', component: AddSalarySlipMobileAppComponent },
  { path: 'leave-request', component: LeaveRequestMobileAppComponent },
  { path: 'add-leave-request', component: AddLeaveRequestMobileAppComponent },
  { path: 'present-employee', component: ViewAllPresentEmployeeComponent },
  // Add Page
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendanceManagementPageRoutingModule { }
