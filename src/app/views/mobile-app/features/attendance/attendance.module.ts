import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttendancePageRoutingModule } from './attendance-routing.module';

import { AttendancePage } from './attendance.page';
import { SharedModule } from "../../shared/shared.module";
import { LoaderComponent } from "../../shared/loader/loader.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttendancePageRoutingModule,
    SharedModule,
    LoaderComponent
],
  declarations: [AttendancePage]
})
export class AttendancePageModule {}
