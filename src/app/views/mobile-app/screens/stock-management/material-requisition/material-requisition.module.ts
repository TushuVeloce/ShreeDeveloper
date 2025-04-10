import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaterialRequisitionPageRoutingModule } from './material-requisition-routing.module';

import { MaterialRequisitionPage } from './material-requisition.page';
import { SharedModule } from "../../../shared/shared.module";
import { AddEditMaterialRequisitionComponent } from './add-edit-material-requisition/add-edit-material-requisition.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialRequisitionPageRoutingModule,
    SharedModule
],
  declarations: [MaterialRequisitionPage,AddEditMaterialRequisitionComponent]
})
export class MaterialRequisitionPageModule {}
