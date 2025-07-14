import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockInwardMobileAppPageRoutingModule } from './stock-inward-mobile-app-routing.module';

import { StockInwardMobileAppPage } from './stock-inward-mobile-app.page';
import { StockInwardViewMobileAppComponent } from './components/stock-inward-view-mobile-app/stock-inward-view-mobile-app.component';
import { StockInwardDetailsMobileAppComponent } from './components/stock-inward-details-mobile-app/stock-inward-details-mobile-app.component';
import { SharedModule } from "src/app/views/mobile-app/components/shared/shared.module";
import { StockInwardPrintMobileAppComponent } from './components/stock-inward-print-mobile-app/stock-inward-print-mobile-app.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockInwardMobileAppPageRoutingModule,
    SharedModule
],
  declarations: [StockInwardMobileAppPage,StockInwardViewMobileAppComponent,StockInwardDetailsMobileAppComponent,StockInwardPrintMobileAppComponent]
})
export class StockInwardMobileAppPageModule {}
