import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SiteManagementMobilePageRoutingModule } from './site-management-mobile-routing.module';

import { SiteManagementMobilePage } from './site-management-mobile.page';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SiteManagementMobilePageRoutingModule,
    LoaderComponent,
    SharedModule
],
  declarations: [SiteManagementMobilePage]
})
export class SiteManagementMobilePageModule {}
