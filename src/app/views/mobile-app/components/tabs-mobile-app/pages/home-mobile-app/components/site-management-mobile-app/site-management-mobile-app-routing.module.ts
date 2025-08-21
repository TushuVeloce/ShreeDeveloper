import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SiteManagementMobileAppPage } from './site-management-mobile-app.page';
import { SiteManagementViewMobileAppComponent } from './components/site-management-view-mobile-app/site-management-view-mobile-app.component';
import { SiteDetailsComponent } from './components/site-details/site-details.component';

const routes: Routes = [
  {
    path: '',
    component: SiteManagementMobileAppPage,
    children: [
      // { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '', component: SiteManagementViewMobileAppComponent },
      { path: 'site-details', component: SiteDetailsComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiteManagementMobileAppPageRoutingModule {}
