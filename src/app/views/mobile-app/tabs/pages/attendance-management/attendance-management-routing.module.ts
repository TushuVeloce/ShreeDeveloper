import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttendanceManagementPage } from './attendance-management.page';
import { AttendanceDetailsComponent } from './attendance-details/attendance-details.component';

const routes: Routes = [
  {
    path: '',
    component: AttendanceManagementPage
  },
  { path: 'attendance-details', component: AttendanceDetailsComponent }, // Add Page

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendanceManagementPageRoutingModule { }
