import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttendanceDetailsMobilePage } from './attendance-details-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: AttendanceDetailsMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendanceDetailsMobilePageRoutingModule {}
