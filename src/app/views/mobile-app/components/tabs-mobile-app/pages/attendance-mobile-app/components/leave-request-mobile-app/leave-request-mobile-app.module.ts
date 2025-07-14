import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeaveRequestMobileAppPageRoutingModule } from './leave-request-mobile-app-routing.module';

import { LeaveRequestMobileAppPage } from './leave-request-mobile-app.page';
import { LeaveRequestViewMobileAppComponent } from './components/leave-request-view-mobile-app/leave-request-view-mobile-app.component';
import { LeaveRequestDetailsMobileAppComponent } from './components/leave-request-details-mobile-app/leave-request-details-mobile-app.component';
import { SharedModule } from "src/app/views/mobile-app/components/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeaveRequestMobileAppPageRoutingModule,
    SharedModule
],
  declarations: [LeaveRequestMobileAppPage, LeaveRequestViewMobileAppComponent, LeaveRequestDetailsMobileAppComponent]
})
export class LeaveRequestMobileAppPageModule {}
