import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttendanceDetailsMobilePageRoutingModule } from './attendance-details-mobile-routing.module';

import { AttendanceDetailsMobilePage } from './attendance-details-mobile.page';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttendanceDetailsMobilePageRoutingModule,
    LoaderComponent,
    SharedModule
],
  declarations: [AttendanceDetailsMobilePage]
})
export class AttendanceDetailsMobilePageModule {}
