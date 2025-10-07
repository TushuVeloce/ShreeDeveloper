import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VendorServiceMasterMobileAppPageRoutingModule } from './vendor-service-master-mobile-app-routing.module';

import { VendorServiceMasterMobileAppPage } from './vendor-service-master-mobile-app.page';
import { VendorServiceMasterViewMobileAppComponent } from './components/vendor-service-master-view-mobile-app/vendor-service-master-view-mobile-app.component';
import { VendorServiceMasterDetailsMobileAppComponent } from './components/vendor-service-master-details-mobile-app/vendor-service-master-details-mobile-app.component';
import { SharedModule } from "src/app/views/mobile-app/components/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VendorServiceMasterMobileAppPageRoutingModule,
    SharedModule
],
  declarations: [VendorServiceMasterMobileAppPage,VendorServiceMasterViewMobileAppComponent,VendorServiceMasterDetailsMobileAppComponent]
})
export class VendorServiceMasterMobileAppPageModule {}
