import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserProfileMobilePageRoutingModule } from './user-profile-mobile-routing.module';

import { UserProfileMobilePage } from './user-profile-mobile.page';
import { SharedModule } from "../../shared/shared.module";
import { LoaderComponent } from "../../shared/loader/loader.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserProfileMobilePageRoutingModule,
    SharedModule,
    LoaderComponent
],
  declarations: [UserProfileMobilePage]
})
export class UserProfileMobilePageModule {}
