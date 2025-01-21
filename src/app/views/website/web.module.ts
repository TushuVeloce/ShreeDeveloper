import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebRoutingModule } from './web-routing.module';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DemoWebsiteComponent } from './demo-website/demo-website.component';





@NgModule({
  declarations: [DemoWebsiteComponent],
  imports: [
    CommonModule,
    WebRoutingModule,FormsModule, BrowserModule,
  ]
})
export class WebModule { }
