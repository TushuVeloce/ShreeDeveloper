import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfficeMobileAppPageRoutingModule } from './office-mobile-app-routing.module';

import { OfficeMobileAppPage } from './office-mobile-app.page';
import { OfficeViewMobileAppComponent } from './components/office-view-mobile-app/office-view-mobile-app.component';
import { SharedModule } from "src/app/views/mobile-app/components/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfficeMobileAppPageRoutingModule,
    SharedModule
],
  declarations: [OfficeMobileAppPage,OfficeViewMobileAppComponent]
})
export class OfficeMobileAppPageModule {}
