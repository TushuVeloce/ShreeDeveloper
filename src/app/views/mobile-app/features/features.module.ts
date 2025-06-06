import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeaturesRoutingModule } from './features-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "../shared/shared.module";
// import { TaskDetailsMobilePage } from './task-details-mobile/task-details-mobile.page';
// import { TaskMobilePage } from './task-mobile/task-mobile.page';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    FeaturesRoutingModule,
    SharedModule
]
})
export class FeaturesModule { }
