import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpenseDetailsMobilePage } from './expense-details-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: ExpenseDetailsMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpenseDetailsMobilePageRoutingModule {}
