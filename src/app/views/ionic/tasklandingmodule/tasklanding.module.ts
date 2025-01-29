import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasklandingRoutingModule } from './tasklanding-routing.module';
import { IonicModule } from '@ionic/angular';
import { TaskLandingComponent } from './task-landing.component';
import { TaskLandingViewComponent } from './components/task-landing-view/task-landing-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { FilterComponentComponent } from './components/filter-component/filter-component.component';


@NgModule({
  declarations: [TaskLandingComponent,TaskLandingViewComponent,AddTaskComponent,FilterComponentComponent],
  imports: [
    CommonModule,
    TasklandingRoutingModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
   ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TasklandingModule { }
