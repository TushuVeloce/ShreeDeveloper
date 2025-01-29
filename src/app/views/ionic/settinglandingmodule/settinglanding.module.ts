import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettinglandingRoutingModule } from './settinglanding-routing.module';
import { IonicModule } from '@ionic/angular';
import { SettingLandingComponent } from './setting-landing.component';


@NgModule({
  declarations: [SettingLandingComponent],
  imports: [
    CommonModule,
    SettinglandingRoutingModule,
 IonicModule
  ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SettinglandingModule { }
