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
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
      },
      {
        path: 'task',
        loadChildren: () => import('./task/task.module').then(m => m.TaskModule),
      },
      {
        path: 'attendance',
        loadChildren: () => import('./attendance/attendance.module').then(m => m.AttendanceModule),
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
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
