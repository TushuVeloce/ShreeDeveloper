import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HolidaysMobileAppPageRoutingModule } from './holidays-mobile-app-routing.module';

import { HolidaysMobileAppPage } from './holidays-mobile-app.page';
import { HolidaysViewMobileAppComponent } from './components/holidays-view-mobile-app/holidays-view-mobile-app.component';
import { HolidaysDetailsMobileAppComponent } from './components/holidays-details-mobile-app/holidays-details-mobile-app.component';
import { SharedModule } from "src/app/views/mobile-app/components/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HolidaysMobileAppPageRoutingModule,
    SharedModule
],
  declarations: [HolidaysMobileAppPage,HolidaysViewMobileAppComponent,HolidaysDetailsMobileAppComponent]
})
export class HolidaysMobileAppPageModule {}
