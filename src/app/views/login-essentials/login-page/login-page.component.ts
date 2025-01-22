import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  isIosPlatform: boolean = false;
  isAndroidPlatform: boolean = false;
  constructor(private router: Router, private platform: Platform,) {

    platform.ready().then(async () => {
      this.isIosPlatform = platform.is('ios');
      this.isAndroidPlatform = platform.is('android');
    });
  }

  ngOnInit() { }
  Login = async () => {
    
    if (this.isIosPlatform || this.isAndroidPlatform) {
      await this.router.navigate(['/app_homepage']);
    }
    else {
      await this.router.navigate(['/website_homepage']);
    }
  }
}
