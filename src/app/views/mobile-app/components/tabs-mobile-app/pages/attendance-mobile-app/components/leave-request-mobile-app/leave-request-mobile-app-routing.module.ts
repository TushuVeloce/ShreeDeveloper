import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeaveRequestMobileAppPage } from './leave-request-mobile-app.page';
import { LeaveRequestViewMobileAppComponent } from './components/leave-request-view-mobile-app/leave-request-view-mobile-app.component';
import { LeaveRequestDetailsMobileAppComponent } from './components/leave-request-details-mobile-app/leave-request-details-mobile-app.component';

const routes: Routes = [
  {
    path: '',
    component: LeaveRequestMobileAppPage,
    children: [
      // { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '', component: LeaveRequestViewMobileAppComponent },
      { path: 'add', component: LeaveRequestDetailsMobileAppComponent },
      { path: 'edit', component: LeaveRequestDetailsMobileAppComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaveRequestMobileAppPageRoutingModule {}
