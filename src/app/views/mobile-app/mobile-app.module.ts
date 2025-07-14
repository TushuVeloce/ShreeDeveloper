import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MobileAppPageRoutingModule } from './mobile-app-routing.module';

import { MobileAppPage } from './mobile-app.page';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MobileAppPageRoutingModule
  ],
  declarations: [MobileAppPage,SplashScreenComponent]
})
export class MobileAppPageModule {}
