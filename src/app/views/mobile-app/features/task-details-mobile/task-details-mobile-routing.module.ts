import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskDetailsMobilePage } from './task-details-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: TaskDetailsMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskDetailsMobilePageRoutingModule {}
