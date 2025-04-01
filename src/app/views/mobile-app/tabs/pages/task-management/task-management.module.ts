import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskManagementPageRoutingModule } from './task-management-routing.module';

import { SharedModule } from "../../../shared/shared.module";
import { TaskManagementPage } from './task-management.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskManagementPageRoutingModule,
    SharedModule
],
declarations: [TaskManagementPage]

})
export class TaskManagementPageModule {}
