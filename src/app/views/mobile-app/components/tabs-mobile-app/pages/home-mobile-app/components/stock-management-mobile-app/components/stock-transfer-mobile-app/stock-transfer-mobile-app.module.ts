import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockTransferMobileAppPageRoutingModule } from './stock-transfer-mobile-app-routing.module';

import { StockTransferMobileAppPage } from './stock-transfer-mobile-app.page';
import { StockTransferViewMobileAppComponent } from './components/stock-transfer-view-mobile-app/stock-transfer-view-mobile-app.component';
import { StockTransferDetailsMobileAppComponent } from './components/stock-transfer-details-mobile-app/stock-transfer-details-mobile-app.component';
import { SharedModule } from "src/app/views/mobile-app/components/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockTransferMobileAppPageRoutingModule,
    SharedModule
],
  declarations: [StockTransferMobileAppPage,StockTransferViewMobileAppComponent,StockTransferDetailsMobileAppComponent]
})
export class StockTransferMobileAppPageModule {}
