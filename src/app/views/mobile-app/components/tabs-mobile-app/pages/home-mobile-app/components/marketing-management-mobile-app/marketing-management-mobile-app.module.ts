import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarketingManagementMobileAppPageRoutingModule } from './marketing-management-mobile-app-routing.module';

import { MarketingManagementMobileAppPage } from './marketing-management-mobile-app.page';
import { MarketingManagementViewMobileAppComponent } from './components/marketing-management-view-mobile-app/marketing-management-view-mobile-app.component';
import { MarketingManagementDetailsMobileAppComponent } from './components/marketing-management-details-mobile-app/marketing-management-details-mobile-app.component';
import { LoaderComponent } from "src/app/views/mobile-app/components/shared/loader/loader.component";
import { SharedModule } from "src/app/views/mobile-app/components/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MarketingManagementMobileAppPageRoutingModule,
    LoaderComponent,
    SharedModule
],
  declarations: [MarketingManagementMobileAppPage, MarketingManagementViewMobileAppComponent, MarketingManagementDetailsMobileAppComponent]
})
export class MarketingManagementMobileAppPageModule {}
