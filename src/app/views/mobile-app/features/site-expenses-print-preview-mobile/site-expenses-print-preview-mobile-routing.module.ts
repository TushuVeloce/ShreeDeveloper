import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SiteExpensesPrintPreviewMobilePage } from './site-expenses-print-preview-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: SiteExpensesPrintPreviewMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiteExpensesPrintPreviewMobilePageRoutingModule {}
