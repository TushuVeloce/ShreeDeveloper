import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvoiceDetailsMobilePageRoutingModule } from './invoice-details-mobile-routing.module';

import { InvoiceDetailsMobilePage } from './invoice-details-mobile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvoiceDetailsMobilePageRoutingModule
  ],
  declarations: [InvoiceDetailsMobilePage]
})
export class InvoiceDetailsMobilePageModule {}
