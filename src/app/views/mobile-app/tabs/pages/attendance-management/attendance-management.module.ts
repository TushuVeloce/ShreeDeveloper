import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttendanceManagementPageRoutingModule } from './attendance-management-routing.module';

import { SharedModule } from "../../../shared/shared.module";
import { AttendanceManagementPage } from './attendance-management.page';
import { AttendanceDetailsComponent } from './Views/attendance-details/attendance-details.component';
import { SalarySlipMobileAppComponent } from './Views/salary-slip-mobile-app/salary-slip-mobile-app.component';
import { LeaveRequestMobileAppComponent } from './Views/leave-request-mobile-app/leave-request-mobile-app.component';
import { AddLeaveRequestMobileAppComponent } from './Views/add-leave-request-mobile-app/add-leave-request-mobile-app.component';
import { AddSalarySlipMobileAppComponent } from './Views/add-salary-slip-mobile-app/add-salary-slip-mobile-app.component';
import { ViewAllPresentEmployeeComponent } from './Views/view-all-present-employee/view-all-present-employee.component';
import { LoaderComponent } from "../../../shared/loader/loader.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttendanceManagementPageRoutingModule,
    SharedModule,
    LoaderComponent,
    ReactiveFormsModule,
],
  declarations: [AttendanceManagementPage, AttendanceDetailsComponent, AddSalarySlipMobileAppComponent, SalarySlipMobileAppComponent, LeaveRequestMobileAppComponent, AddLeaveRequestMobileAppComponent,ViewAllPresentEmployeeComponent]

})
export class AttendanceManagementPageModule { }
