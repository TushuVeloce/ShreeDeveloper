import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerFollowupMobileAppPageRoutingModule } from './customer-followup-mobile-app-routing.module';

import { CustomerFollowupMobileAppPage } from './customer-followup-mobile-app.page';
import { CustomerFollowupViewMobileAppComponent } from './components/customer-followup-view-mobile-app/customer-followup-view-mobile-app.component';
import { CustomerFollowupDetailsMobileAppComponent } from './components/customer-followup-details-mobile-app/customer-followup-details-mobile-app.component';
import { LoaderComponent } from "src/app/views/mobile-app/components/shared/loader/loader.component";
import { SharedModule } from "src/app/views/mobile-app/components/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerFollowupMobileAppPageRoutingModule,
    LoaderComponent,
    SharedModule
],
  declarations: [CustomerFollowupMobileAppPage,CustomerFollowupViewMobileAppComponent,CustomerFollowupDetailsMobileAppComponent]
})
export class CustomerFollowupMobileAppPageModule {}
