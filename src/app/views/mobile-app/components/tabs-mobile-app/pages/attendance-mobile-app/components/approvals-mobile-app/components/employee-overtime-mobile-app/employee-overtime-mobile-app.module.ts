import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeOvertimeMobileAppPageRoutingModule } from './employee-overtime-mobile-app-routing.module';

import { EmployeeOvertimeMobileAppPage } from './employee-overtime-mobile-app.page';
import { SharedModule } from "src/app/views/mobile-app/components/shared/shared.module";
import { EmployeeOvertimeDetailsMobileAppComponent } from './components/employee-overtime-details-mobile-app/employee-overtime-details-mobile-app.component';
import { EmployeeOvertimeViewMobileAppComponent } from './components/employee-overtime-view-mobile-app/employee-overtime-view-mobile-app.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeeOvertimeMobileAppPageRoutingModule,
    SharedModule,
    ReactiveFormsModule
],
  declarations: [EmployeeOvertimeMobileAppPage,EmployeeOvertimeDetailsMobileAppComponent,EmployeeOvertimeViewMobileAppComponent]
})
export class EmployeeOvertimeMobileAppPageModule {}
