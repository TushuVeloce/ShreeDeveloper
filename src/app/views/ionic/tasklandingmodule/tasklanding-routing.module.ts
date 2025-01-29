import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskLandingComponent } from './task-landing.component';
import { TaskLandingViewComponent } from './components/task-landing-view/task-landing-view.component';
import { AddTaskComponent } from './components/add-task/add-task.component';

const routes: Routes = [
  {
    path: '', component: TaskLandingComponent,
    children:
      [
        { path: '', component: TaskLandingViewComponent },
        { path: 'add', component: AddTaskComponent }
      ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasklandingRoutingModule { }
