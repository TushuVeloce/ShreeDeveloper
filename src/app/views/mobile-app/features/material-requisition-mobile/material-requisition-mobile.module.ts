import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaterialRequisitionMobilePageRoutingModule } from './material-requisition-mobile-routing.module';

import { MaterialRequisitionMobilePage } from './material-requisition-mobile.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialRequisitionMobilePageRoutingModule,
    SharedModule
],
  declarations: [MaterialRequisitionMobilePage]
})
export class MaterialRequisitionMobilePageModule {}
