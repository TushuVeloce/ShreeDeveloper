import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerEnquiryMobileAppPageRoutingModule } from './customer-enquiry-mobile-app-routing.module';

import { CustomerEnquiryMobileAppPage } from './customer-enquiry-mobile-app.page';
import { CustomerEnquiryViewMobileAppComponent } from './components/customer-enquiry-view-mobile-app/customer-enquiry-view-mobile-app.component';
import { CustomerEnquiryDetailsMobileAppComponent } from './components/customer-enquiry-details-mobile-app/customer-enquiry-details-mobile-app.component';
import { LoaderComponent } from "src/app/views/mobile-app/components/shared/loader/loader.component";
import { SharedModule } from "src/app/views/mobile-app/components/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerEnquiryMobileAppPageRoutingModule,
    LoaderComponent,
    SharedModule
],
  declarations: [CustomerEnquiryMobileAppPage,CustomerEnquiryViewMobileAppComponent,CustomerEnquiryDetailsMobileAppComponent]
})
export class CustomerEnquiryMobileAppPageModule {}
