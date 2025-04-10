import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttendanceManagementPageRoutingModule } from './attendance-management-routing.module';

import { SharedModule } from "../../../shared/shared.module";
import { AttendanceManagementPage } from './attendance-management.page';
import { AttendanceDetailsComponent } from './attendance-details/attendance-details.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttendanceManagementPageRoutingModule,
    SharedModule
],
declarations: [AttendanceManagementPage,AttendanceDetailsComponent]

})
export class AttendanceManagementPageModule {}
