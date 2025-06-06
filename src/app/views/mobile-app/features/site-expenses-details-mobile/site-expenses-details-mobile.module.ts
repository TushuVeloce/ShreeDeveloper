import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SiteExpensesDetailsMobilePageRoutingModule } from './site-expenses-details-mobile-routing.module';

import { SiteExpensesDetailsMobilePage } from './site-expenses-details-mobile.page';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SiteExpensesDetailsMobilePageRoutingModule,
    LoaderComponent,
    SharedModule
],
  declarations: [SiteExpensesDetailsMobilePage]
})
export class SiteExpensesDetailsMobilePageModule {}
