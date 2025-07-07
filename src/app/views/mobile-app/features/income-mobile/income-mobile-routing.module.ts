import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncomeMobilePage } from './income-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: IncomeMobilePage
  },
  {
    path: 'add',
    loadChildren: () => import('../income-details-mobile/income-details-mobile.module').then(m => m.IncomeDetailsMobilePageModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('../income-details-mobile/income-details-mobile.module').then(m => m.IncomeDetailsMobilePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncomeMobilePageRoutingModule { }
