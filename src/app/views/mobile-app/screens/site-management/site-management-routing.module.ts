import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SiteManagementPage } from './site-management.page';

const routes: Routes = [
  {
    path: '',
    component: SiteManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiteManagementPageRoutingModule {}
