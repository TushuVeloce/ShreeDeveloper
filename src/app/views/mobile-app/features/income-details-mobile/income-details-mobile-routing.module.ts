import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncomeDetailsMobilePage } from './income-details-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: IncomeDetailsMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncomeDetailsMobilePageRoutingModule {}
