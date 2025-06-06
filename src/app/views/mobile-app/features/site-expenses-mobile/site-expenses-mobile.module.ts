import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SiteExpensesMobilePageRoutingModule } from './site-expenses-mobile-routing.module';

import { SiteExpensesMobilePage } from './site-expenses-mobile.page';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SiteExpensesMobilePageRoutingModule,
    LoaderComponent,
    SharedModule
],
  declarations: [SiteExpensesMobilePage]
})
export class SiteExpensesMobilePageModule {}
