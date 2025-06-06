import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeaveMobilePageRoutingModule } from './leave-mobile-routing.module';

import { LeaveMobilePage } from './leave-mobile.page';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeaveMobilePageRoutingModule,
    LoaderComponent,
    SharedModule
],
  declarations: [LeaveMobilePage]
})
export class LeaveMobilePageModule {}
