import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginMobilePage } from './login-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: LoginMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginMobilePageRoutingModule {}
