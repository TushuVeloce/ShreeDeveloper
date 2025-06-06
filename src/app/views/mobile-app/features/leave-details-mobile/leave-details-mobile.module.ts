import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeaveDetailsMobilePageRoutingModule } from './leave-details-mobile-routing.module';

import { LeaveDetailsMobilePage } from './leave-details-mobile.page';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeaveDetailsMobilePageRoutingModule,
    LoaderComponent,
    SharedModule
],
  declarations: [LeaveDetailsMobilePage]
})
export class LeaveDetailsMobilePageModule {}
