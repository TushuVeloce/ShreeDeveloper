import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttendanceManagementPageRoutingModule } from './attendance-management-routing.module';

import { SharedModule } from "../../../shared/shared.module";
import { AttendanceManagementPage } from './attendance-management.page';
import { AttendanceDetailsComponent } from './Views/attendance-details/attendance-details.component';
import { AddsalarySlipMobileAppComponent } from './Views/addsalary-slip-mobile-app/addsalary-slip-mobile-app.component';
import { SalarySlipMobileAppComponent } from './Views/salary-slip-mobile-app/salary-slip-mobile-app.component';
import { LeaveRequestMobileAppComponent } from './Views/leave-request-mobile-app/leave-request-mobile-app.component';
import { AddLeaveRequestMobileAppComponent } from './Views/add-leave-request-mobile-app/add-leave-request-mobile-app.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttendanceManagementPageRoutingModule,
    SharedModule
  ],
  declarations: [AttendanceManagementPage, AttendanceDetailsComponent, AddsalarySlipMobileAppComponent, SalarySlipMobileAppComponent, LeaveRequestMobileAppComponent, AddLeaveRequestMobileAppComponent]

})
export class AttendanceManagementPageModule { }
