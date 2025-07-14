import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvoiceMobileAppPageRoutingModule } from './invoice-mobile-app-routing.module';

import { InvoiceMobileAppPage } from './invoice-mobile-app.page';
import { InvoiceViewMobileAppComponent } from './components/invoice-view-mobile-app/invoice-view-mobile-app.component';
import { InvoiceDetailsMobileAppComponent } from './components/invoice-details-mobile-app/invoice-details-mobile-app.component';
import { SharedModule } from "src/app/views/mobile-app/components/shared/shared.module";
import { InvoicePrintMobileAppComponent } from './components/invoice-print-mobile-app/invoice-print-mobile-app.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvoiceMobileAppPageRoutingModule,
    SharedModule
],
  declarations: [InvoiceMobileAppPage,InvoiceViewMobileAppComponent,InvoiceDetailsMobileAppComponent,InvoicePrintMobileAppComponent]
})
export class InvoiceMobileAppPageModule {}
