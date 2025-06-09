import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginMobilePage } from './login-mobile/login-mobile.page';
import { CreateNewPasswordMobilePage } from './create-new-password-mobile/create-new-password-mobile.page';

const routes: Routes = [
  { path: 'login-mobile', component: LoginMobilePage },
  { path: 'create-new-password-mobile', component: CreateNewPasswordMobilePage },
  {
    path: 'forgot-password-mobile',
    loadChildren: () => import('./forgot-password-mobile/forgot-password-mobile.module').then( m => m.ForgotPasswordMobilePageModule)
  },
  { path: '', redirectTo: 'login-mobile', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
