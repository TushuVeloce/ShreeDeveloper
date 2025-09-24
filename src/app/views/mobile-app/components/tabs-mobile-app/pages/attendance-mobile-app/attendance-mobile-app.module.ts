import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttendanceMobileAppPageRoutingModule } from './attendance-mobile-app-routing.module';

import { AttendanceMobileAppPage } from './attendance-mobile-app.page';
import { AttendanceViewMobileAppComponent } from './components/attendance-view-mobile-app/attendance-view-mobile-app.component';
import { SharedModule } from "src/app/views/mobile-app/components/shared/shared.module";
import { AllAttendanceMobileAppComponent } from './components/all-attendance-mobile-app/all-attendance-mobile-app.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttendanceMobileAppPageRoutingModule,
    SharedModule
],
  declarations: [AttendanceMobileAppPage,AttendanceViewMobileAppComponent,AllAttendanceMobileAppComponent]
})
export class AttendanceMobileAppPageModule {}
