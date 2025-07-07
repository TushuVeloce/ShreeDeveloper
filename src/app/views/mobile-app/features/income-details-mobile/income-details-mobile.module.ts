import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncomeDetailsMobilePageRoutingModule } from './income-details-mobile-routing.module';

import { IncomeDetailsMobilePage } from './income-details-mobile.page';
import { SharedModule } from '../../shared/shared.module';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncomeDetailsMobilePageRoutingModule,
    SharedModule,
    NzDropDownModule,
    NzSelectModule,
  ],
  declarations: [IncomeDetailsMobilePage],
})
export class IncomeDetailsMobilePageModule {}
