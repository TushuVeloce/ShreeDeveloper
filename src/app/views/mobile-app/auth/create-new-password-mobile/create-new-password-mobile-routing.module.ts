import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateNewPasswordMobilePage } from './create-new-password-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: CreateNewPasswordMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateNewPasswordMobilePageRoutingModule {}
