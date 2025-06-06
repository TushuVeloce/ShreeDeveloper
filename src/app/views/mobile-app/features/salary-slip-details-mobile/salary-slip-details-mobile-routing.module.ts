import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalarySlipDetailsMobilePage } from './salary-slip-details-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: SalarySlipDetailsMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalarySlipDetailsMobilePageRoutingModule {}
