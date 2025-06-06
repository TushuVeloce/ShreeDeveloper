import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationMobilePageRoutingModule } from './notification-mobile-routing.module';

import { NotificationMobilePage } from './notification-mobile.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationMobilePageRoutingModule,
    SharedModule
],
  declarations: [NotificationMobilePage]
})
export class NotificationMobilePageModule {}
