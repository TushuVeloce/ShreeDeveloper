import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateNewPasswordMobilePageRoutingModule } from './create-new-password-mobile-routing.module';

import { CreateNewPasswordMobilePage } from './create-new-password-mobile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateNewPasswordMobilePageRoutingModule
  ],
  declarations: []
})
export class CreateNewPasswordMobilePageModule {}
