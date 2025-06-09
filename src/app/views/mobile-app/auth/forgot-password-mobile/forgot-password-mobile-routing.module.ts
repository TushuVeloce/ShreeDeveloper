import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgotPasswordMobilePage } from './forgot-password-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: ForgotPasswordMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgotPasswordMobilePageRoutingModule {}
