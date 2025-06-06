import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationMobilePage } from './notification-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: NotificationMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationMobilePageRoutingModule {}
