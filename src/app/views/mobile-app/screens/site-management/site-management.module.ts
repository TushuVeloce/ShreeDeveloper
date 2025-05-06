import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SiteManagementPageRoutingModule } from './site-management-routing.module';
import { SiteManagementPage } from './site-management.page';
import { SharedModule } from "../../shared/shared.module";
import { LoaderComponent } from "../../shared/loader/loader.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SiteManagementPageRoutingModule,
    SharedModule,
    LoaderComponent
],
  declarations:[SiteManagementPage]
})
export class SiteManagementPageModule {}
