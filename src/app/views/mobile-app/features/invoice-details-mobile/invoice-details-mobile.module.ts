import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvoiceDetailsMobilePageRoutingModule } from './invoice-details-mobile-routing.module';

import { InvoiceDetailsMobilePage } from './invoice-details-mobile.page';
import { SharedModule } from '../../shared/shared.module';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvoiceDetailsMobilePageRoutingModule,
    SharedModule,
    NzDropDownModule,
    NzSelectModule,
  ],
  declarations: [InvoiceDetailsMobilePage],
})
export class InvoiceDetailsMobilePageModule {}
