import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaterialRequisitionMobileAppPageRoutingModule } from './material-requisition-mobile-app-routing.module';

import { MaterialRequisitionMobileAppPage } from './material-requisition-mobile-app.page';
import { MaterialRequisitionViewMobileAppComponent } from './components/material-requisition-view-mobile-app/material-requisition-view-mobile-app.component';
import { MaterialRequisitionDetailsMobileAppComponent } from './components/material-requisition-details-mobile-app/material-requisition-details-mobile-app.component';
import { SharedModule } from "src/app/views/mobile-app/components/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialRequisitionMobileAppPageRoutingModule,
    SharedModule
],
  declarations: [MaterialRequisitionMobileAppPage,MaterialRequisitionViewMobileAppComponent,MaterialRequisitionDetailsMobileAppComponent]
})
export class MaterialRequisitionMobileAppPageModule {}
