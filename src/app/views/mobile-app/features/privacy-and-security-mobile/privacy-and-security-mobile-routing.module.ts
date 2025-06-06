import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrivacyAndSecurityMobilePage } from './privacy-and-security-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: PrivacyAndSecurityMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivacyAndSecurityMobilePageRoutingModule {}
