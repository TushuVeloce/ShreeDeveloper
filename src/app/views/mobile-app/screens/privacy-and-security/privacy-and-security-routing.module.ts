import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrivacyAndSecurityPage } from './privacy-and-security.page';

const routes: Routes = [
  {
    path: '',
    component: PrivacyAndSecurityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivacyAndSecurityPageRoutingModule {}
