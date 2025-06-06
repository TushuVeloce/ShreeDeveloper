import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerFollowupMobilePageRoutingModule } from './customer-followup-mobile-routing.module';

import { CustomerFollowupMobilePage } from './customer-followup-mobile.page';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerFollowupMobilePageRoutingModule,
    LoaderComponent,
    SharedModule
],
  declarations: [CustomerFollowupMobilePage]
})
export class CustomerFollowupMobilePageModule {}
