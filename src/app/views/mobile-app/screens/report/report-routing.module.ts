import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportPage } from './report.page';
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
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ReportPage
  },
  {
    path: 'billing-report',
    component: BillingReportComponent
  }
  ,
  {
    path: 'office-report',
    component: OfficeReportComponent
  }
  ,
  {
    path: 'booking-report',
    component: BookingReportComponent
  }
  ,
  {
    path: 'stock-report',
    component: StockReportComponent
  }
  ,
  {
    path: 'crm-report',
    component: CrmReportComponent
  }
  ,
  {
    path: 'followup-report',
    component: FollowupReportComponent
  }
  ,
  {
    path: 'employee-report',
    component: EmployeeReportComponent
  },
  {
    path: 'marketing-report',
    component: MarketingReportComponent
  },
  {
    path: 'stages-report',
    component: StagesReportComponent
  },
  {
    path: 'billing-report',
    component: BillingReportComponent
  },
  {
    path: 'account-report',
    component: AccountReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
})
export class ReportPageRoutingModule { }
