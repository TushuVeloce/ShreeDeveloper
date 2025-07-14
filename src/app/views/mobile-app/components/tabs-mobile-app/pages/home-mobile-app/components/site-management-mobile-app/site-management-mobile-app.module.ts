import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SiteManagementMobileAppPageRoutingModule } from './site-management-mobile-app-routing.module';

import { SiteManagementMobileAppPage } from './site-management-mobile-app.page';
import { SiteManagementViewMobileAppComponent } from './components/site-management-view-mobile-app/site-management-view-mobile-app.component';
import { LoaderComponent } from "src/app/views/mobile-app/components/shared/loader/loader.component";
import { SharedModule } from "src/app/views/mobile-app/components/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SiteManagementMobileAppPageRoutingModule,
    LoaderComponent,
    SharedModule
],
  declarations: [SiteManagementMobileAppPage,SiteManagementViewMobileAppComponent]
})
export class SiteManagementMobileAppPageModule {}
