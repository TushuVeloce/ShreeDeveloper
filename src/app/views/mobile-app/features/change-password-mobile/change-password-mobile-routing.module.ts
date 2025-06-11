import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangePasswordMobilePage } from './change-password-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: ChangePasswordMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangePasswordMobilePageRoutingModule {}
