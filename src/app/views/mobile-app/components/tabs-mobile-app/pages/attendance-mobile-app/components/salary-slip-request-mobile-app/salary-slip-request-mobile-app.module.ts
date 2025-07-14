import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalarySlipRequestMobileAppPageRoutingModule } from './salary-slip-request-mobile-app-routing.module';

import { SalarySlipRequestMobileAppPage } from './salary-slip-request-mobile-app.page';
import { SalarySlipRequestViewMobileAppComponent } from './components/salary-slip-request-view-mobile-app/salary-slip-request-view-mobile-app.component';
import { SalarySlipRequestDetailsMobileAppComponent } from './components/salary-slip-request-details-mobile-app/salary-slip-request-details-mobile-app.component';
import { SharedModule } from "src/app/views/mobile-app/components/shared/shared.module";
import { SalarySlipRequestPrintMobileAppComponent } from './components/salary-slip-request-print-mobile-app/salary-slip-request-print-mobile-app.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalarySlipRequestMobileAppPageRoutingModule,
    SharedModule
],
  declarations: [SalarySlipRequestMobileAppPage, SalarySlipRequestViewMobileAppComponent, SalarySlipRequestDetailsMobileAppComponent,SalarySlipRequestPrintMobileAppComponent]
})
export class SalarySlipRequestMobileAppPageModule {}
