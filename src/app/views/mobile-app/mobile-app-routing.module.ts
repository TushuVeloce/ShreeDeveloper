import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MobileAppPage } from './mobile-app.page';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { authMobileGuard } from './components/core/auth-mobile.guard';
import { loginMobileGuard } from './components/core/login-mobile.guard';

const routes: Routes = [
  {
    path: '',
    component: MobileAppPage,
    children: [
      // { path: '', redirectTo: 'splash-screen', pathMatch: 'full' }
      { path: '', component: SplashScreenComponent },
      {
        canActivate: [loginMobileGuard],
        path: 'auth',
        loadChildren: () => import('./components/auth-mobile-app/auth-mobile-app.module').then(m => m.AuthMobileAppPageModule)
      },
      {
        canActivate: [authMobileGuard],
        path: 'tabs',
        loadChildren: () => import('./components/tabs-mobile-app/tabs-mobile-app.module').then(m => m.TabsMobileAppPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MobileAppPageRoutingModule { }
