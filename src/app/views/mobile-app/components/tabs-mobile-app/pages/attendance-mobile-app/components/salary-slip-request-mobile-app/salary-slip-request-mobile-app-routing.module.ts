import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalarySlipRequestMobileAppPage } from './salary-slip-request-mobile-app.page';
import { SalarySlipRequestViewMobileAppComponent } from './components/salary-slip-request-view-mobile-app/salary-slip-request-view-mobile-app.component';
import { SalarySlipRequestDetailsMobileAppComponent } from './components/salary-slip-request-details-mobile-app/salary-slip-request-details-mobile-app.component';
import { SalarySlipRequestPrintMobileAppComponent } from './components/salary-slip-request-print-mobile-app/salary-slip-request-print-mobile-app.component';

const routes: Routes = [
  {
    path: '',
    component: SalarySlipRequestMobileAppPage,
    children: [
      // { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '', component: SalarySlipRequestViewMobileAppComponent },
      { path: 'add', component: SalarySlipRequestDetailsMobileAppComponent },
      { path: 'edit', component: SalarySlipRequestDetailsMobileAppComponent },
      { path: 'print', component: SalarySlipRequestPrintMobileAppComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalarySlipRequestMobileAppPageRoutingModule {}
