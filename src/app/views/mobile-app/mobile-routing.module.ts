import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsModule)
  },
  {
    path: 'user-profile',
    loadChildren: () => import('./screens/user-profile/user-profile.module').then( m => m.UserProfilePageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./screens/notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'privacy-and-security',
    loadChildren: () => import('./screens/privacy-and-security/privacy-and-security.module').then( m => m.PrivacyAndSecurityPageModule)
  },

 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MobileRoutingModule { }
