import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskManagementPage } from './task-management.page';
import { AddEditTaskManagementComponent } from './add-edit-task-management/add-edit-task-management.component';

// const routes: Routes = [
//   {
//     path: '',
//     component: TaskManagementPage
//   }
// ];
const routes: Routes = [
  { path: '', component: TaskManagementPage }, // Home List Page
  { path: 'add', component: AddEditTaskManagementComponent }, // Add Page
  { path: 'edit/:id', component: AddEditTaskManagementComponent }, // Edit Page with ID
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskManagementPageRoutingModule {}
