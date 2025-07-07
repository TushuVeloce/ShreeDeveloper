import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountingReportMobilePage } from './accounting-report-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: AccountingReportMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountingReportMobilePageRoutingModule {}
