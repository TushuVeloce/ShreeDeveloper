import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalarySlipMobilePageRoutingModule } from './salary-slip-mobile-routing.module';

import { SalarySlipMobilePage } from './salary-slip-mobile.page';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalarySlipMobilePageRoutingModule,
    LoaderComponent,
    SharedModule
],
  declarations: [SalarySlipMobilePage]
})
export class SalarySlipMobilePageModule {}
