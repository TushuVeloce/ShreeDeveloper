import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './views/login-page/login-page.component';
import { CreatePasswordComponent } from './views/login-page/create_password/create-password/create-password.component';


const routes: Routes = [

  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component: LoginPageComponent, },
  { path: 'create_password', component: CreatePasswordComponent, },

  {
    path: 'homepage',
    loadChildren: () => import('./views/sidebarlayout/sidebarlayout.routes').then(m => m.SidebarLayout_ROUTES)
  },
  {
    path: 'app_homepage',
    loadChildren: () => import('./views/mobile-app/mobile.module').then(m => m.MobileModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
