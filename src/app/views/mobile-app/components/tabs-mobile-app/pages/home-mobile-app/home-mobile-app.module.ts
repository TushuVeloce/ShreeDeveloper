import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeMobileAppPageRoutingModule } from './home-mobile-app-routing.module';

import { HomeMobileAppPage } from './home-mobile-app.page';
import { HomeViewMobileAppComponent } from './components/home-view-mobile-app/home-view-mobile-app.component';
import { SharedModule } from "src/app/views/mobile-app/components/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeMobileAppPageRoutingModule,
    SharedModule
],
  declarations: [HomeMobileAppPage,HomeViewMobileAppComponent]
})
export class HomeMobileAppPageModule {}
