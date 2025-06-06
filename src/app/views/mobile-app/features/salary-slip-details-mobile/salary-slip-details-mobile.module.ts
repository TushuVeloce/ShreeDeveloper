import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalarySlipDetailsMobilePageRoutingModule } from './salary-slip-details-mobile-routing.module';

import { SalarySlipDetailsMobilePage } from './salary-slip-details-mobile.page';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalarySlipDetailsMobilePageRoutingModule,
    LoaderComponent,
    SharedModule
],
  declarations: [SalarySlipDetailsMobilePage]
})
export class SalarySlipDetailsMobilePageModule {}
