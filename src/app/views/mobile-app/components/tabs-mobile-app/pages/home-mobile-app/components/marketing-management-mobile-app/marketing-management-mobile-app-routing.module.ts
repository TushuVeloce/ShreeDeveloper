import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarketingManagementMobileAppPage } from './marketing-management-mobile-app.page';
import { MarketingManagementViewMobileAppComponent } from './components/marketing-management-view-mobile-app/marketing-management-view-mobile-app.component';
import { MarketingManagementDetailsMobileAppComponent } from './components/marketing-management-details-mobile-app/marketing-management-details-mobile-app.component';

const routes: Routes = [
  {
    path: '',
    component: MarketingManagementMobileAppPage,
    children: [
      // { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '', component: MarketingManagementViewMobileAppComponent },
      { path: 'add', component: MarketingManagementDetailsMobileAppComponent },
      { path: 'edit', component: MarketingManagementDetailsMobileAppComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketingManagementMobileAppPageRoutingModule {}
