import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './views/login-page/login-page.component';
import { CreatePasswordComponent } from './views/login-page/create_password/create-password/create-password.component';
import { ForgotPasswordComponent } from './views/sidebarlayout/forgot_password/forgot-password/forgot-password.component';

const routes: Routes = [
  { path: '', redirectTo: 'splash-screen', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'create_password', component: CreatePasswordComponent },
  { path: 'forgot_password', component: ForgotPasswordComponent },
  {
    path: 'homepage',
    loadChildren: () => import('./views/sidebarlayout/sidebarlayout.routes').then(m => m.SidebarLayout_ROUTES)
  },
  {
    path: 'splash-screen',
    loadChildren: () => import('./views/mobile-app/splash/splash.module').then(m => m.SplashPageModule)
  },
  {
    path: 'mobileapp',
    loadChildren: () => import('./views/mobile-app/mobile.module').then(m => m.MobileModule)
  },
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
