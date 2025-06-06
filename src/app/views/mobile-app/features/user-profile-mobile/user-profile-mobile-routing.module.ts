import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserProfileMobilePage } from './user-profile-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: UserProfileMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserProfileMobilePageRoutingModule {}
