import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SiteManagementMobilePage } from './site-management-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: SiteManagementMobilePage
  },
  {
    path: 'site-expenses',
    loadChildren: () => import('../site-expenses-mobile/site-expenses-mobile.module').then(m => m.SiteExpensesMobilePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiteManagementMobilePageRoutingModule { }
