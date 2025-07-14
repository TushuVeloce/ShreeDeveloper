import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerFollowupMobileAppPage } from './customer-followup-mobile-app.page';
import { CustomerFollowupViewMobileAppComponent } from './components/customer-followup-view-mobile-app/customer-followup-view-mobile-app.component';
import { CustomerFollowupDetailsMobileAppComponent } from './components/customer-followup-details-mobile-app/customer-followup-details-mobile-app.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerFollowupMobileAppPage,
    children: [
      // { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '', component: CustomerFollowupViewMobileAppComponent },
      { path: 'add', component: CustomerFollowupDetailsMobileAppComponent },
      { path: 'edit', component: CustomerFollowupDetailsMobileAppComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerFollowupMobileAppPageRoutingModule {}
