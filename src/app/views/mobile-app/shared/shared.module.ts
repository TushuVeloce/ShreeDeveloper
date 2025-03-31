import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from './header/header.component';
import { HeaderWithBackHandlerComponent } from './header-with-back-handler/header-with-back-handler.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [HeaderComponent, HeaderWithBackHandlerComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
  ],
  exports: [HeaderComponent, HeaderWithBackHandlerComponent]
})
export class SharedModule { }
