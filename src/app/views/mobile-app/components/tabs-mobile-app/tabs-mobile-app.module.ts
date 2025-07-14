import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsMobileAppPageRoutingModule } from './tabs-mobile-app-routing.module';

import { TabsMobileAppPage } from './tabs-mobile-app.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsMobileAppPageRoutingModule
  ],
  declarations: [TabsMobileAppPage]
})
export class TabsMobileAppPageModule {}
