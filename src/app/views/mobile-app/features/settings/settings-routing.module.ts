import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsPage } from './settings.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage
  },
  {
    path: 'user-profile',
    loadChildren: () => import('../user-profile-mobile/user-profile-mobile.module').then(m => m.UserProfileMobilePageModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('../notification-mobile/notification-mobile.module').then(m => m.NotificationMobilePageModule)
  },
  {
    path: 'privacy-and-security',
    loadChildren: () => import('../privacy-and-security-mobile/privacy-and-security-mobile.module').then(m => m.PrivacyAndSecurityMobilePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule {}
