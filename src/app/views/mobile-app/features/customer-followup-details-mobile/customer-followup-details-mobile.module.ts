import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerFollowupDetailsMobilePageRoutingModule } from './customer-followup-details-mobile-routing.module';

import { CustomerFollowupDetailsMobilePage } from './customer-followup-details-mobile.page';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerFollowupDetailsMobilePageRoutingModule,
    LoaderComponent,
    SharedModule
],
  declarations: [CustomerFollowupDetailsMobilePage]
})
export class CustomerFollowupDetailsMobilePageModule {}
