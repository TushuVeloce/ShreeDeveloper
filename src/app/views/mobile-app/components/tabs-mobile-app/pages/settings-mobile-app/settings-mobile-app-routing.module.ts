import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsMobileAppPage } from './settings-mobile-app.page';
import { SettingsViewMobileAppComponent } from './components/settings-view-mobile-app/settings-view-mobile-app.component';
import { ChangePasswordComponent } from 'src/app/views/website/profile/change_password/change-password/change-password.component';
import { NotificationsMobileAppComponent } from './components/notifications-mobile-app/notifications-mobile-app.component';
import { PrivacyAndSecurityMobileAppComponent } from './components/privacy-and-security-mobile-app/privacy-and-security-mobile-app.component';
import { UserProfileMobileAppComponent } from './components/user-profile-mobile-app/user-profile-mobile-app.component';
import { ChangePasswordMobileAppComponent } from './components/change-password-mobile-app/change-password-mobile-app.component';


const routes: Routes = [
  {
    path: '',
    component: SettingsMobileAppPage,
    children: [
      // { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '', component: SettingsViewMobileAppComponent },
      { path: 'change-password', component: ChangePasswordMobileAppComponent },
      { path: 'notifications', component: NotificationsMobileAppComponent },
      { path: 'privacy-and-security', component: PrivacyAndSecurityMobileAppComponent },
      { path: 'profile', component: UserProfileMobileAppComponent },
    ]
  }

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsMobileAppPageRoutingModule {}
