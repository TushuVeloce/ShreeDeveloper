import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SiteExpensesPrintPreviewMobilePageRoutingModule } from './site-expenses-print-preview-mobile-routing.module';

import { SiteExpensesPrintPreviewMobilePage } from './site-expenses-print-preview-mobile.page';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SiteExpensesPrintPreviewMobilePageRoutingModule,
    LoaderComponent,
    SharedModule
],
  declarations: [SiteExpensesPrintPreviewMobilePage]
})
export class SiteExpensesPrintPreviewMobilePageModule {}
