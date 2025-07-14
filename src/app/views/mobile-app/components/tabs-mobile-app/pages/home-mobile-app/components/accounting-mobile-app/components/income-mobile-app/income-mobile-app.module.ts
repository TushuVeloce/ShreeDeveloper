import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncomeMobileAppPageRoutingModule } from './income-mobile-app-routing.module';

import { IncomeMobileAppPage } from './income-mobile-app.page';
import { IncomeViewMobileAppComponent } from './components/income-view-mobile-app/income-view-mobile-app.component';
import { IncomeDetailsMobileAppComponent } from './components/income-details-mobile-app/income-details-mobile-app.component';
import { SharedModule } from "src/app/views/mobile-app/components/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncomeMobileAppPageRoutingModule,
    SharedModule
],
  declarations: [IncomeMobileAppPage,IncomeViewMobileAppComponent,IncomeDetailsMobileAppComponent]
})
export class IncomeMobileAppPageModule {}
