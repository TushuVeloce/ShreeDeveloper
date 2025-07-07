import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExpenseDetailsMobilePageRoutingModule } from './expense-details-mobile-routing.module';

import { ExpenseDetailsMobilePage } from './expense-details-mobile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExpenseDetailsMobilePageRoutingModule
  ],
  declarations: [ExpenseDetailsMobilePage]
})
export class ExpenseDetailsMobilePageModule {}
