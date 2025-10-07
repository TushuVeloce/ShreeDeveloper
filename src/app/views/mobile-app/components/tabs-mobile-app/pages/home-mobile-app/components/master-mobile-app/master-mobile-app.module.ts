import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MasterMobileAppPageRoutingModule } from './master-mobile-app-routing.module';

import { MasterMobileAppPage } from './master-mobile-app.page';
import { SharedModule } from 'src/app/views/mobile-app/components/shared/shared.module';
import { MastersViewMobileAppComponent } from './components/masters-view-mobile-app/masters-view-mobile-app.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MasterMobileAppPageRoutingModule,
    SharedModule
  ],
  declarations: [MasterMobileAppPage,MastersViewMobileAppComponent]
})
export class MasterMobileAppPageModule {}
