import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountingMobilePageRoutingModule } from './accounting-mobile-routing.module';

import { AccountingMobilePage } from './accounting-mobile.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountingMobilePageRoutingModule,
    SharedModule
],
  declarations: [AccountingMobilePage]
})
export class AccountingMobilePageModule {}
