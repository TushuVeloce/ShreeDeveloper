import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { IonicRoutingModule } from './ionic-routing.module';
import { IonicLayoutComponent } from './ionic-layout/ionic-layout.component';

@NgModule({
  declarations: [IonicLayoutComponent],
  imports: [
    CommonModule,
    IonicModule, 
    IonicRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
})
export class IonicFeaturesModule { } 
