import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonContent, IonInput } from "@ionic/angular/standalone";

@Component({
  selector: 'app-mobile-app-login-page',
  templateUrl: './mobile-app-login-page.component.html',
  styleUrls: ['./mobile-app-login-page.component.scss'],
  standalone:false
})
export class MobileAppLoginPageComponent  implements OnInit {

  ngOnInit() {}

  loginForm: FormGroup;
  showPassword = false;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (this.loginForm.valid) {
      console.log('Logging in with:', this.loginForm.value);
      // Add your login logic
    } else {
      this.loginForm.markAllAsTouched();
    }
  }


}
