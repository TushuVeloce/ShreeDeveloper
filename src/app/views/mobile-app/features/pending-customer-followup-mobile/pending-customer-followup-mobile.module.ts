import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PendingCustomerFollowupMobilePageRoutingModule } from './pending-customer-followup-mobile-routing.module';

import { PendingCustomerFollowupMobilePage } from './pending-customer-followup-mobile.page';
import { SharedModule } from "../../shared/shared.module";
import { LoaderComponent } from "../../shared/loader/loader.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PendingCustomerFollowupMobilePageRoutingModule,
    SharedModule,
    LoaderComponent
],
  declarations: [PendingCustomerFollowupMobilePage]
})
export class PendingCustomerFollowupMobilePageModule {}
