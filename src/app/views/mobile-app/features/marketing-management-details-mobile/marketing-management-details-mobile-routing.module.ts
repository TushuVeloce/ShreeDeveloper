import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarketingManagementDetailsMobilePage } from './marketing-management-details-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: MarketingManagementDetailsMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketingManagementDetailsMobilePageRoutingModule {}
