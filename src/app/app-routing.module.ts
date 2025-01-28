import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './views/login-page/login-page.component';

const routes: Routes = [

  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component: LoginPageComponent, },

  {
    path: 'homepage',
    loadChildren: () => import('./views/sidebarlayout/sidebarlayout.routes').then(m => m.SidebarLayout_ROUTES)
  },
  {
    path: 'app_homepage',
    loadChildren: () => import('./views/ionic/ionic-feature.module').then(m => m.IonicFeaturesModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
