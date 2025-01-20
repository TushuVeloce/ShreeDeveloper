import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './views/login-page/login-page.component';

const routes: Routes = [

  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component: LoginPageComponent, },

  {
    path: 'website_homepage',
    loadChildren: () => import('./views/website/sidebarlayout/sidebarlayout.routes').then(m => m.SidebarLayout_ROUTES)
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
