import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountingReportMobilePageRoutingModule } from './accounting-report-mobile-routing.module';

import { AccountingReportMobilePage } from './accounting-report-mobile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountingReportMobilePageRoutingModule
  ],
  declarations: [AccountingReportMobilePage]
})
export class AccountingReportMobilePageModule {}
