import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountingMobileAppPageRoutingModule } from './accounting-mobile-app-routing.module';

import { AccountingMobileAppPage } from './accounting-mobile-app.page';
import { AccountingViewMobileAppPageComponent } from './components/accounting-view-mobile-app-page/accounting-view-mobile-app-page.component';
import { SharedModule } from "src/app/views/mobile-app/components/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountingMobileAppPageRoutingModule,
    SharedModule
],
  declarations: [AccountingMobileAppPage,AccountingViewMobileAppPageComponent]
})
export class AccountingMobileAppPageModule {}
