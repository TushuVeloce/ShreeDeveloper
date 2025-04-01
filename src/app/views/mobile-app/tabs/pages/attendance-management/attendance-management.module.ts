import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttendanceManagementPageRoutingModule } from './attendance-management-routing.module';

import { SharedModule } from "../../../shared/shared.module";
import { AttendanceManagementPage } from './attendance-management.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttendanceManagementPageRoutingModule,
    SharedModule
],
declarations: [AttendanceManagementPage]

})
export class AttendanceManagementPageModule {}
