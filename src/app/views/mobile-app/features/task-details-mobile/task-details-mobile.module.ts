import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskDetailsMobilePageRoutingModule } from './task-details-mobile-routing.module';

import { TaskDetailsMobilePage } from './task-details-mobile.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskDetailsMobilePageRoutingModule,
    SharedModule
],
  declarations: [TaskDetailsMobilePage]
})
export class TaskDetailsMobilePageModule {}
