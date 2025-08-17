import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginPageComponent } from './views/login-page/login-page.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ImageInterceptor } from './ImageInterceptor';


@NgModule({
  declarations: [AppComponent,],
  imports: [CommonModule, IonicModule.forRoot(),
 AppRoutingModule, FormsModule, BrowserAnimationsModule,
    NzTableModule,HttpClientModule
   ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ImageInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule { }
