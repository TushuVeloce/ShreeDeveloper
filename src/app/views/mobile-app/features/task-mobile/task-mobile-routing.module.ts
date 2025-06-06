import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskMobilePage } from './task-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: TaskMobilePage
  },
  {
    path: 'add',
    loadChildren: () => import('../task-details-mobile/task-details-mobile.module').then(m => m.TaskDetailsMobilePageModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('../task-details-mobile/task-details-mobile.module').then(m => m.TaskDetailsMobilePageModule)
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskMobilePageRoutingModule {}
