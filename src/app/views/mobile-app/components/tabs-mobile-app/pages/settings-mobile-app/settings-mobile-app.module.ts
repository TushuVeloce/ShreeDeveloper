import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsMobileAppPageRoutingModule } from './settings-mobile-app-routing.module';

import { SettingsMobileAppPage } from './settings-mobile-app.page';
import { SettingsViewMobileAppComponent } from './components/settings-view-mobile-app/settings-view-mobile-app.component';
import { SharedModule } from "src/app/views/mobile-app/components/shared/shared.module";
import { ChangePasswordMobileAppComponent } from './components/change-password-mobile-app/change-password-mobile-app.component';
import { NotificationsMobileAppComponent } from './components/notifications-mobile-app/notifications-mobile-app.component';
import { PrivacyAndSecurityMobileAppComponent } from './components/privacy-and-security-mobile-app/privacy-and-security-mobile-app.component';
import { UserProfileMobileAppComponent } from './components/user-profile-mobile-app/user-profile-mobile-app.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsMobileAppPageRoutingModule,
    SharedModule,
    ReactiveFormsModule
],
  declarations: [SettingsMobileAppPage,SettingsViewMobileAppComponent,ChangePasswordMobileAppComponent,NotificationsMobileAppComponent,PrivacyAndSecurityMobileAppComponent,UserProfileMobileAppComponent]
})
export class SettingsMobileAppPageModule {}
