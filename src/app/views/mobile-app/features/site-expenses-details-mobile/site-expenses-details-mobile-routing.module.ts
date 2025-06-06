import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SiteExpensesDetailsMobilePage } from './site-expenses-details-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: SiteExpensesDetailsMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiteExpensesDetailsMobilePageRoutingModule {}
