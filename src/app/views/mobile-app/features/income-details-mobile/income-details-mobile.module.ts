import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncomeDetailsMobilePageRoutingModule } from './income-details-mobile-routing.module';

import { IncomeDetailsMobilePage } from './income-details-mobile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncomeDetailsMobilePageRoutingModule
  ],
  declarations: [IncomeDetailsMobilePage]
})
export class IncomeDetailsMobilePageModule {}
