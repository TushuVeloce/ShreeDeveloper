import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskMobilePageRoutingModule } from './task-mobile-routing.module';
import { TaskMobilePage } from './task-mobile.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TaskMobilePageRoutingModule,
    SharedModule
  ],
  declarations: [TaskMobilePage]
})
export class TaskMobilePageModule { }
