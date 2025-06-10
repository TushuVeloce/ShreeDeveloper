import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserProfileMobilePageRoutingModule } from './user-profile-mobile-routing.module';

import { UserProfileMobilePage } from './user-profile-mobile.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserProfileMobilePageRoutingModule,
    SharedModule,
    ReactiveFormsModule
],
  declarations: [UserProfileMobilePage]
})
export class UserProfileMobilePageModule {}
