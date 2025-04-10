import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrivacyAndSecurityPageRoutingModule } from './privacy-and-security-routing.module';

import { PrivacyAndSecurityPage } from './privacy-and-security.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrivacyAndSecurityPageRoutingModule,
    SharedModule
],
  declarations: [PrivacyAndSecurityPage]
})
export class PrivacyAndSecurityPageModule {}
