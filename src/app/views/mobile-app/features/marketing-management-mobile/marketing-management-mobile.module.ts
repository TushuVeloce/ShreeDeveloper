import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarketingManagementMobilePageRoutingModule } from './marketing-management-mobile-routing.module';

import { MarketingManagementMobilePage } from './marketing-management-mobile.page';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MarketingManagementMobilePageRoutingModule,
    LoaderComponent,
    SharedModule
],
  declarations: [MarketingManagementMobilePage]
})
export class MarketingManagementMobilePageModule {}
