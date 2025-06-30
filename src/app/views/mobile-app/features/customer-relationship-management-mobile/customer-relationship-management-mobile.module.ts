import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerRelationshipManagementMobilePageRoutingModule } from './customer-relationship-management-mobile-routing.module';

import { CustomerRelationshipManagementMobilePage } from './customer-relationship-management-mobile.page';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerRelationshipManagementMobilePageRoutingModule,
    LoaderComponent,
    SharedModule,
],
  declarations: [CustomerRelationshipManagementMobilePage]
})
export class CustomerRelationshipManagementMobilePageModule {}
