import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockOrderMobileAppPageRoutingModule } from './stock-order-mobile-app-routing.module';

import { StockOrderMobileAppPage } from './stock-order-mobile-app.page';
import { StockOrderViewMobileAppComponent } from './components/stock-order-view-mobile-app/stock-order-view-mobile-app.component';
import { StockOrderDetailsMobileAppComponent } from './components/stock-order-details-mobile-app/stock-order-details-mobile-app.component';
import { StockOrderPrintMobileAppComponent } from './components/stock-order-print-mobile-app/stock-order-print-mobile-app.component';
import { SharedModule } from "src/app/views/mobile-app/components/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockOrderMobileAppPageRoutingModule,
    SharedModule
],
  declarations: [StockOrderMobileAppPage,StockOrderViewMobileAppComponent,StockOrderDetailsMobileAppComponent,StockOrderPrintMobileAppComponent]
})
export class StockOrderMobileAppPageModule {}
