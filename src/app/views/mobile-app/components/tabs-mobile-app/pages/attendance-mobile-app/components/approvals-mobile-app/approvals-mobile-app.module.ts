import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApprovalsMobileAppPageRoutingModule } from './approvals-mobile-app-routing.module';

import { ApprovalsMobileAppPage } from './approvals-mobile-app.page';
import { SharedModule } from "src/app/views/mobile-app/components/shared/shared.module";
import { LeaveApprovalMobileAppComponent } from './components/leave-approval-mobile-app/leave-approval-mobile-app.component';
import { SalarySlipApprovalMobileAppComponent } from './components/salary-slip-approval-mobile-app/salary-slip-approval-mobile-app.component';
import { ApprovalViewMobileAppComponent } from './components/approval-view-mobile-app/approval-view-mobile-app.component';
import { AttendanceApprovalMobileAppComponent } from './components/attendance-approval-mobile-app/attendance-approval-mobile-app.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApprovalsMobileAppPageRoutingModule,
    SharedModule
],
  declarations: [ApprovalsMobileAppPage,LeaveApprovalMobileAppComponent,SalarySlipApprovalMobileAppComponent,ApprovalViewMobileAppComponent,AttendanceApprovalMobileAppComponent]
})
export class ApprovalsMobileAppPageModule {}
