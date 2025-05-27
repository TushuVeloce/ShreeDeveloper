import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CRMPageRoutingModule } from './crm-routing.module';
import { CRMPage } from './crm.page';
import { SharedModule } from "../../shared/shared.module";
import { LoaderComponent } from "../../shared/loader/loader.component";
import { CustomerPendingFollowUpMobileAppComponent } from './customer-pending-follow-up-mobile-app/customer-pending-follow-up-mobile-app.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CRMPageRoutingModule,
    SharedModule,
    LoaderComponent
],
  declarations:[CRMPage,CustomerPendingFollowUpMobileAppComponent]
})
export class CRMPageModule {}
