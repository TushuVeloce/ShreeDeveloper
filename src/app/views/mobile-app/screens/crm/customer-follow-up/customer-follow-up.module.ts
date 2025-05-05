import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerFollowUpPageRoutingModule } from './customer-follow-up-routing.module';

import { CustomerFollowUpPage } from './customer-follow-up.page';
import { SharedModule } from "../../../shared/shared.module";
import { AddEditCustomerFollowUpComponent } from './add-edit-customer-follow-up/add-edit-customer-follow-up.component';
import { LoaderComponent } from "../../../shared/loader/loader.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerFollowUpPageRoutingModule,
    SharedModule,
    LoaderComponent
],
  declarations: [CustomerFollowUpPage,AddEditCustomerFollowUpComponent]
})
export class CustomerFollowUpPageModule {}
