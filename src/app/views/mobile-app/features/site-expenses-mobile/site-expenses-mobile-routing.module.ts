import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SiteExpensesMobilePage } from './site-expenses-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: SiteExpensesMobilePage
  }, 
  {
    path: 'add',
    loadChildren: () => import('../site-expenses-details-mobile/site-expenses-details-mobile.module').then(m => m.SiteExpensesDetailsMobilePageModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('../site-expenses-details-mobile/site-expenses-details-mobile.module').then(m => m.SiteExpensesDetailsMobilePageModule)
  },
  {
    path: 'print',
    loadChildren: () => import('../site-expenses-print-preview-mobile/site-expenses-print-preview-mobile.module').then(m => m.SiteExpensesPrintPreviewMobilePageModule)
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiteExpensesMobilePageRoutingModule { }
