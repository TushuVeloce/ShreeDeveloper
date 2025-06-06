import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarketingManagementDetailsMobilePageRoutingModule } from './marketing-management-details-mobile-routing.module';

import { MarketingManagementDetailsMobilePage } from './marketing-management-details-mobile.page';
import { SharedModule } from "../../shared/shared.module";
import { LoaderComponent } from "../../shared/loader/loader.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MarketingManagementDetailsMobilePageRoutingModule,
    SharedModule,
    LoaderComponent
],
  declarations: [MarketingManagementDetailsMobilePage]
})
export class MarketingManagementDetailsMobilePageModule {}
