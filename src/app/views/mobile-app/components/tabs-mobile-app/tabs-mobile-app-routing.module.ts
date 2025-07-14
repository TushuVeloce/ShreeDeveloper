import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsMobileAppPage } from './tabs-mobile-app.page';

const routes: Routes = [
  {
    path: '',
    component: TabsMobileAppPage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/home-mobile-app/home-mobile-app.module').then(m => m.HomeMobileAppPageModule)
      },
      {
        path: 'attendance',
        loadChildren: () => import('./pages/attendance-mobile-app/attendance-mobile-app.module').then(m => m.AttendanceMobileAppPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./pages/settings-mobile-app/settings-mobile-app.module').then(m => m.SettingsMobileAppPageModule)
      }
      ,
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsMobileAppPageRoutingModule { }
