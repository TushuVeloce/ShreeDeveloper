import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './views/login-page/login-page.component';
import { ForgotPasswordComponent } from './views/sidebarlayout/forgot_password/forgot-password/forgot-password.component';
import { CreatePasswordComponent } from './views/sidebarlayout/create_password/create-password/create-password.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'create_password', component: CreatePasswordComponent },
  { path: 'forgot_password', component: ForgotPasswordComponent },
  {
    path: 'homepage',
    loadChildren: () => import('./views/sidebarlayout/sidebarlayout.routes').then(m => m.SidebarLayout_ROUTES)
  },
  {
    path: 'mobile-app',
    loadChildren: () => import('./views/mobile-app/mobile-app.module').then( m => m.MobileAppPageModule)
  }

];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
