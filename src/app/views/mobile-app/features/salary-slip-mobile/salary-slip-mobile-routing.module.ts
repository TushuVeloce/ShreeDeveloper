import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalarySlipMobilePage } from './salary-slip-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: SalarySlipMobilePage
  },
  {
    path: 'add',
    loadChildren: () => import('../salary-slip-details-mobile/salary-slip-details-mobile.module').then(m => m.SalarySlipDetailsMobilePageModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('../salary-slip-details-mobile/salary-slip-details-mobile.module').then(m => m.SalarySlipDetailsMobilePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalarySlipMobilePageRoutingModule {}
