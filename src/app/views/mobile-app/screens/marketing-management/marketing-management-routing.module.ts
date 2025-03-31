import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarketingManagementPage } from './marketing-management.page';

const routes: Routes = [
  {
    path: '',
    component: MarketingManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketingManagementPageRoutingModule {}
