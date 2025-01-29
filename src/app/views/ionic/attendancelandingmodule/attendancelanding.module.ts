import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendancelandingRoutingModule } from './attendancelanding-routing.module';
import { IonicModule } from '@ionic/angular';
import { AttendanceLandingComponent } from './attendance-landing.component';


@NgModule({
  declarations: [AttendanceLandingComponent],
  imports: [
    CommonModule,
    AttendancelandingRoutingModule,
    IonicModule
  ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AttendancelandingModule { }
