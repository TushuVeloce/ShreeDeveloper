import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrivacyAndSecurityMobilePageRoutingModule } from './privacy-and-security-mobile-routing.module';

import { PrivacyAndSecurityMobilePage } from './privacy-and-security-mobile.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrivacyAndSecurityMobilePageRoutingModule,
    SharedModule
],
  declarations: [PrivacyAndSecurityMobilePage]
})
export class PrivacyAndSecurityMobilePageModule {}
