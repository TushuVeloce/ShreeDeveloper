import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncomeMobilePageRoutingModule } from './income-mobile-routing.module';

import { IncomeMobilePage } from './income-mobile.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncomeMobilePageRoutingModule,
    SharedModule
],
  declarations: [IncomeMobilePage]
})
export class IncomeMobilePageModule {}
