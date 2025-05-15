import { NgModule } from '@angular/core';

import { MobileRoutingModule } from './mobile-routing.module';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MobileAppLoginPageComponent } from './mobile-app-login-page/mobile-app-login-page.component';
import { CreatePasswordMobileAppComponent } from './mobile-app-login-page/create-password-mobile-app/create-password-mobile-app.component';

@NgModule({
  declarations: [MobileAppLoginPageComponent,CreatePasswordMobileAppComponent],
  imports: [
    MobileRoutingModule,
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MobileModule { }
