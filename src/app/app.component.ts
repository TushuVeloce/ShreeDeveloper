import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiceInjector } from './classes/infrastructure/injector';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';


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
   async ngOnInit() {
    // Check if the platform is iOS or Android before applying styles
    if (Capacitor.isNativePlatform()) {
      // Set the status bar style to match the app's theme
      // Use 'Dark' for a light-colored background, 'Light' for a dark-colored background
       await StatusBar.setStyle({ style: Style.Light });

      // On Android, set the background color to match your app's theme
      if (Capacitor.getPlatform() === 'android') {
        await StatusBar.setBackgroundColor({ color: '#7c2424' });
        //  await NavigationBar.setNavigationBarColor({
        //   color: '#7c2424', // Use the starting color of your gradient
        //   darkButtons: false // Set to false for a dark background
        // });
      }
    }
  }
}
