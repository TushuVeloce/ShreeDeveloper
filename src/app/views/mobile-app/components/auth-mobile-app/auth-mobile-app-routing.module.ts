import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthMobileAppPage } from './auth-mobile-app.page';
import { LoginMobileAppComponent } from './components/login-mobile-app/login-mobile-app.component';
import { CreateNewPasswordMobileAppComponent } from './components/create-new-password-mobile-app/create-new-password-mobile-app.component';
import { ForgotPasswordMobileAppComponent } from './components/forgot-password-mobile-app/forgot-password-mobile-app.component';

const routes: Routes = [
  {
    path: '',
    component: AuthMobileAppPage,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginMobileAppComponent },
      { path: 'create-new-password', component: CreateNewPasswordMobileAppComponent },
      { path: 'forgot-password', component: ForgotPasswordMobileAppComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthMobileAppPageRoutingModule { }
