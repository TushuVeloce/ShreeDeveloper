import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicLayoutComponent } from './ionic-layout/ionic-layout.component';

const routes: Routes = [
  {
    path: '',
    component: IonicLayoutComponent, // Parent layout with Bottom Navigation
    children: [
      {
        path: 'home',
        loadChildren: () => import('./homelandingmodule/home-landing.module').then(m => m.HomeModule),
      },
      {
        path: 'task',
        loadChildren: () => import('./tasklandingmodule/tasklanding.module').then(m => m.TasklandingModule),
      },
      {
        path: 'attendance',
        loadChildren: () => import('./attendancelandingmodule/attendancelanding.module').then(m => m.AttendancelandingModule),
      },
      {
        path: 'settings',
        loadChildren: () => import('./settinglandingmodule/settinglanding.module').then(m => m.SettinglandingModule),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IonicRoutingModule { }
