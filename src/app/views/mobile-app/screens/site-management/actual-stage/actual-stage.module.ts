import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActualStagePageRoutingModule } from './actual-stage-routing.module';

import { ActualStagePage } from './actual-stage.page';
import { SharedModule } from "../../../shared/shared.module";
import { AddEditActualStageComponent } from './add-edit-actual-stage/add-edit-actual-stage.component';
import { LoaderComponent } from "../../../shared/loader/loader.component";
import { PreviewPrintComponent } from './preview-print/preview-print.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActualStagePageRoutingModule,
    SharedModule,
    LoaderComponent
],
  declarations: [ActualStagePage,AddEditActualStageComponent,PreviewPrintComponent]
})
export class ActualStagePageModule {}
