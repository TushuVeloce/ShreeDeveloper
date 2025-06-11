import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangePasswordMobilePageRoutingModule } from './change-password-mobile-routing.module';

import { ChangePasswordMobilePage } from './change-password-mobile.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangePasswordMobilePageRoutingModule,
    SharedModule,
    ReactiveFormsModule
],
  declarations: [ChangePasswordMobilePage]
})
export class ChangePasswordMobilePageModule {}
