import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SiteManagementMobileAppPage } from './site-management-mobile-app.page';
import { SiteManagementViewMobileAppComponent } from './components/site-management-view-mobile-app/site-management-view-mobile-app.component';

const routes: Routes = [
  {
    path: '',
    component: SiteManagementMobileAppPage,
    children: [
      // { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '', component: SiteManagementViewMobileAppComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiteManagementMobileAppPageRoutingModule {}
