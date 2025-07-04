import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginMobilePageRoutingModule } from './login-mobile-routing.module';

import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginMobilePageRoutingModule,
    SharedModule,
    ReactiveFormsModule
],
  declarations: []
})
export class LoginMobilePageModule {}
