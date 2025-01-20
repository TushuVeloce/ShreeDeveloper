import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

  isMobile: boolean = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  constructor(private router: Router, private platform: Platform,) {

    platform.ready().then(async () => {
      this.isIosPlatform = platform.is('ios');
      this.isAndroidPlatform = platform.is('android');
    });
  }

  ngOnInit() { }
  Login = async () => {
    
    // if (this.isIosPlatform || this.isAndroidPlatform) {
    //   await this.router.navigate(['/app_homepage']);
    // }
    // else {
    //   await this.router.navigate(['/website_homepage']);
    // }

    if (this.isMobile) {
      this.router.navigate(['/app_homepage']);  // Navigate to mobile
    } else {
      this.router.navigate(['/website_homepage']);  // Navigate to web
    }
  }
}
