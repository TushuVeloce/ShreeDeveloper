import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgotPasswordMobilePageRoutingModule } from './forgot-password-mobile-routing.module';

import { ForgotPasswordMobilePage } from './forgot-password-mobile.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgotPasswordMobilePageRoutingModule,
    SharedModule,
    ReactiveFormsModule
],
  declarations: [ForgotPasswordMobilePage]
})
export class ForgotPasswordMobilePageModule {}
