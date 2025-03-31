import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CRMPageRoutingModule } from './crm-routing.module';
import { CRMPage } from './crm.page';
import { SharedModule } from "../../shared/shared.module";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CRMPageRoutingModule,
    SharedModule
],
  declarations:[CRMPage]
})
export class CRMPageModule {}
