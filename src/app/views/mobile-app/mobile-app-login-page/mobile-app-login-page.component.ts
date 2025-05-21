import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Keyboard } from '@capacitor/keyboard';
import { Platform } from '@ionic/angular';
import { UserLoginRequest } from 'src/app/classes/infrastructure/request_response/userloginrequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { SessionValues } from 'src/app/services/sessionvalues.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-mobile-app-login-page',
  templateUrl: './mobile-app-login-page.component.html',
  styleUrls: ['./mobile-app-login-page.component.scss'],
  standalone: false
})
export class MobileAppLoginPageComponent implements OnInit {
  // loginForm: FormGroup;
  // showPassword = false;

  // constructor(private fb: FormBuilder, private platform: Platform) {
  //   this.loginForm = this.fb.group({
  //     email: ['', [Validators.required, Validators.email]],
  //     password: ['', Validators.required],
  //   });
  // }

  ngOnInit() {
    //   // When keyboard is closed (by tapping outside or hardware back), fix layout
    //   Keyboard.addListener('keyboardWillHide', () => {
    //     this.fixLayoutAfterKeyboard();
    //   });

    //   // Handle Android hardware back button to blur input
    //   this.platform.backButton.subscribeWithPriority(10, () => {
    //     const active = document.activeElement as HTMLElement | null;
    //     if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
    //       active.blur(); // dismiss keyboard
    //     }
    //   });
  }

  // fixLayoutAfterKeyboard() {
  //   setTimeout(() => {
  //     window.dispatchEvent(new Event('resize'));
  //     // Optional scroll reset (if layout is scrolled weirdly)
  //     document.querySelector('ion-content')?.scrollToTop(300);
  //   }, 100);
  // }

  // get email() {
  //   return this.loginForm.get('email')!;
  // }

  // get password() {
  //   return this.loginForm.get('password')!;
  // }

  // togglePasswordVisibility() {
  //   this.showPassword = !this.showPassword;
  // }

  // onLogin() {
  //   if (this.loginForm.valid) {
  //     console.log('Logging in with:', this.loginForm.value);
  //     // Proceed with login API call
  //   } else {
  //     this.loginForm.markAllAsTouched();
  //   }
  // }
  showPassword: boolean = false;
  UserId: string = 'admin@gmail.com';
  Password: string = 'admin123';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(private fb: FormBuilder, private router: Router, private servercommunicator: ServerCommunicatorService,
    private uiUtils: UIUtils, private sessionValues: SessionValues,
    private appStateManage: AppStateManageService) { }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin = async () => {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      let req = new UserLoginRequest();
      this.UserId = email ?? '';
      this.Password = password ?? '';
      if (this.UserId === '') {
        this.uiUtils.showErrorMessage('Error', 'Please Enter Email ID');
        return
      } else if (this.Password === '') {
        this.uiUtils.showErrorMessage('Error', 'Please Enter Password');
        return
      }
      req.UserId = this.UserId;
      req.Password = this.Password;
      req.LoginDeviceId = this.sessionValues.LoginDeviceId;
      const response = await this.servercommunicator.LoginUser(req);
      this.appStateManage.setEmployeeRef(response.LoginEmployeeRef)
      this.appStateManage.setLoginToken(response.LoginToken)
      this.appStateManage.StorageKey.setItem("UserDisplayName", response.UserDisplayName)

      if (!response.Successful) {
        await this.uiUtils.showErrorMessage('Error', response.Message);
        return
      } else {
        if (response.LoginForFirstTime == 0) {
          await this.router.navigate(['/create_password_mobile']);
        } else {
          await this.router.navigate(['/app_homepage']);
        }
      }
    }
  }
}
