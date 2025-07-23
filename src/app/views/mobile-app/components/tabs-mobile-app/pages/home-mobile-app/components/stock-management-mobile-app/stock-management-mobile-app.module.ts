import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockManagementMobileAppPageRoutingModule } from './stock-management-mobile-app-routing.module';

import { StockManagementMobileAppPage } from './stock-management-mobile-app.page';
import { StockManagementViewMobileAppPageComponent } from './components/stock-management-view-mobile-app-page/stock-management-view-mobile-app-page.component';
import { SharedModule } from "src/app/views/mobile-app/components/shared/shared.module";
import { StockSummaryMobileAppComponent } from './components/stock-summary-mobile-app/stock-summary-mobile-app.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockManagementMobileAppPageRoutingModule,
    SharedModule
],
  declarations: [StockManagementMobileAppPage,StockManagementViewMobileAppPageComponent,StockSummaryMobileAppComponent],
})
export class StockManagementMobileAppPageModule {}
