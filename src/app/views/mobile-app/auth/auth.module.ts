import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginMobilePage } from './login-mobile/login-mobile.page';
import { CreateNewPasswordMobilePage } from './create-new-password-mobile/create-new-password-mobile.page';
import { SharedModule } from "../shared/shared.module";


@NgModule({
  declarations: [LoginMobilePage, CreateNewPasswordMobilePage],
  imports: [
    AuthRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
]
})
export class AuthModule { }
