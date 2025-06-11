import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaterialRequisitionDetailsMobilePageRoutingModule } from './material-requisition-details-mobile-routing.module';

import { MaterialRequisitionDetailsMobilePage } from './material-requisition-details-mobile.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialRequisitionDetailsMobilePageRoutingModule,
    SharedModule
],
  declarations: [MaterialRequisitionDetailsMobilePage]
})
export class MaterialRequisitionDetailsMobilePageModule {}
