import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarketingManagementPageRoutingModule } from './marketing-management-routing.module';
import { MarketingManagementPage } from './marketing-management.page';
import { SharedModule } from "../../shared/shared.module";
import { AddEditMarketingManagementComponent } from './add-edit-marketing-management/add-edit-marketing-management.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MarketingManagementPageRoutingModule,
    SharedModule
],
  declarations:[MarketingManagementPage,AddEditMarketingManagementComponent]
})
export class MarketingManagementPageModule {}
