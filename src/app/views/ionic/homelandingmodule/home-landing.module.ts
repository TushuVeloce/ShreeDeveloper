import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HomeRoutingModule } from './home-landing-routing.module';
import { HomeLandingComponent } from './home-landing.component';
import { HomeLandingViewComponent } from './components/home-landing-view/home-landing-view.component';

@NgModule({
  declarations: [HomeLandingComponent,HomeLandingViewComponent],
  imports: [
    HomeRoutingModule,
    CommonModule,
    IonicModule
  ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
}) 
export class HomeModule { }
