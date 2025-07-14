import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthMobileAppPageRoutingModule } from './auth-mobile-app-routing.module';

import { AuthMobileAppPage } from './auth-mobile-app.page';
import { LoginMobileAppComponent } from './components/login-mobile-app/login-mobile-app.component';
import { CreateNewPasswordMobileAppComponent } from './components/create-new-password-mobile-app/create-new-password-mobile-app.component';
import { ForgotPasswordMobileAppComponent } from './components/forgot-password-mobile-app/forgot-password-mobile-app.component';
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthMobileAppPageRoutingModule,
    SharedModule,
    ReactiveFormsModule
],
  declarations: [AuthMobileAppPage,LoginMobileAppComponent,CreateNewPasswordMobileAppComponent,ForgotPasswordMobileAppComponent]
})
export class AuthMobileAppPageModule {}
