import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportPageRoutingModule } from './report-routing.module';
import { ReportPage } from './report.page';
import { SharedModule } from "../../shared/shared.module";
import { BillingReportComponent } from './components/billing-report/billing-report.component';
import { OfficeReportComponent } from './components/office-report/office-report.component';
import { BookingReportComponent } from './components/booking-report/booking-report.component';
import { StockReportComponent } from './components/stock-report/stock-report.component';
import { CrmReportComponent } from './components/crm-report/crm-report.component';
import { FollowupReportComponent } from './components/followup-report/followup-report.component';
import { EmployeeReportComponent } from './components/employee-report/employee-report.component';
import { MarketingReportComponent } from './components/marketing-report/marketing-report.component';
import { StagesReportComponent } from './components/stages-report/stages-report.component';
import { AccountReportComponent } from './components/account-report/account-report.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportPageRoutingModule,
    SharedModule
  ],
  declarations: [ReportPage, BillingReportComponent, OfficeReportComponent, BookingReportComponent, StockReportComponent, CrmReportComponent, FollowupReportComponent, EmployeeReportComponent, MarketingReportComponent, StagesReportComponent, AccountReportComponent]
})
export class ReportPageModule { }
