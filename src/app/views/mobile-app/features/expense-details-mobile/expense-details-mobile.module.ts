import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExpenseDetailsMobilePageRoutingModule } from './expense-details-mobile-routing.module';

import { ExpenseDetailsMobilePage } from './expense-details-mobile.page';
import { SharedModule } from "../../shared/shared.module";
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSelectModule } from 'ng-zorro-antd/select';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExpenseDetailsMobilePageRoutingModule,
    SharedModule,
    NzDropDownModule,
    NzSelectModule
],
  declarations: [ExpenseDetailsMobilePage]
})
export class ExpenseDetailsMobilePageModule {}
