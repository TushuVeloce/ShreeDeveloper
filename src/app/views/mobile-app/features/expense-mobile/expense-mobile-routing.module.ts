import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpenseMobilePage } from './expense-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: ExpenseMobilePage
  },
  {
    path: 'add',
    loadChildren: () => import('../expense-details-mobile/expense-details-mobile.module').then(m => m.ExpenseDetailsMobilePageModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('../expense-details-mobile/expense-details-mobile.module').then(m => m.ExpenseDetailsMobilePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpenseMobilePageRoutingModule {}
