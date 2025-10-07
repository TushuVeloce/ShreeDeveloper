import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VendorMasterMobileAppPageRoutingModule } from './vendor-master-mobile-app-routing.module';

import { VendorMasterMobileAppPage } from './vendor-master-mobile-app.page';
import { VendorMasterViewMobileAppComponent } from './components/vendor-master-view-mobile-app/vendor-master-view-mobile-app.component';
import { SharedModule } from 'src/app/views/mobile-app/components/shared/shared.module';
import { VendorMasterDetailsMobileAppComponent } from './components/vendor-master-details-mobile-app/vendor-master-details-mobile-app.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VendorMasterMobileAppPageRoutingModule,
    SharedModule
  ],
  declarations: [VendorMasterMobileAppPage,VendorMasterViewMobileAppComponent,VendorMasterDetailsMobileAppComponent]
})
export class VendorMasterMobileAppPageModule {}
