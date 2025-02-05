import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { IonicRoutingModule } from './ionic-routing.module';
import { IonicLayoutComponent } from './ionic-layout/ionic-layout.component';
import { SharedModule } from "./shared/shared.module";
@NgModule({
  declarations: [IonicLayoutComponent],
  imports: [
    CommonModule,
    IonicModule,
    IonicRoutingModule,
    SharedModule
],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
})
export class IonicFeaturesModule { } 
