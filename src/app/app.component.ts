import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiceInjector } from './classes/infrastructure/injector';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(public router: Router, private injector: Injector, private alertController: AlertController) {
    // this.isDarkTheme = themeService.IsDarkMode;
    ServiceInjector.AppInjector = this.injector;
  }
}
