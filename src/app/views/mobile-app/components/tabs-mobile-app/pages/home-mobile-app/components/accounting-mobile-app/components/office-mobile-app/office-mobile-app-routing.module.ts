import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfficeMobileAppPage } from './office-mobile-app.page';
import { OfficeViewMobileAppComponent } from './components/office-view-mobile-app/office-view-mobile-app.component';

const routes: Routes = [
  {
    path: '',
    component: OfficeMobileAppPage,
    children: [
      // { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '', component: OfficeViewMobileAppComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfficeMobileAppPageRoutingModule {}
