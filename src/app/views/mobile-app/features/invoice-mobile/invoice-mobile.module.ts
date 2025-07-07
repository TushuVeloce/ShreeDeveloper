import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvoiceMobilePageRoutingModule } from './invoice-mobile-routing.module';

import { InvoiceMobilePage } from './invoice-mobile.page';
import { SharedModule } from "../../shared/shared.module";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvoiceMobilePageRoutingModule,
    SharedModule
  ],
  declarations: [InvoiceMobilePage]
})
export class InvoiceMobilePageModule {}
