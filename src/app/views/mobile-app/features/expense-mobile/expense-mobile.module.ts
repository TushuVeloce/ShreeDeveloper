import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExpenseMobilePageRoutingModule } from './expense-mobile-routing.module';

import { ExpenseMobilePage } from './expense-mobile.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExpenseMobilePageRoutingModule,
    SharedModule
],
  declarations: [ExpenseMobilePage]
})
export class ExpenseMobilePageModule {}
