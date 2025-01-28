import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceComponent } from './attendance/attendance.component';

const routes: Routes = [
  { path: '', component: AttendanceComponent },
  // { path: 'detail', component: AttendanceDetailComponent }, // Example of a nested page
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
 