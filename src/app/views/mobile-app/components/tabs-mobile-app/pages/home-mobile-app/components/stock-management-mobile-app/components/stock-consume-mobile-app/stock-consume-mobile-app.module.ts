import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockConsumeMobileAppPageRoutingModule } from './stock-consume-mobile-app-routing.module';

import { StockConsumeMobileAppPage } from './stock-consume-mobile-app.page';
import { StockConsumeViewMobileAppComponent } from './components/stock-consume-view-mobile-app/stock-consume-view-mobile-app.component';
import { StockConsumeDetailsMobileAppComponent } from './components/stock-consume-details-mobile-app/stock-consume-details-mobile-app.component';
import { SharedModule } from "src/app/views/mobile-app/components/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockConsumeMobileAppPageRoutingModule,
    SharedModule
],
  declarations: [StockConsumeMobileAppPage,StockConsumeViewMobileAppComponent,StockConsumeDetailsMobileAppComponent]
})
export class StockConsumeMobileAppPageModule {}
