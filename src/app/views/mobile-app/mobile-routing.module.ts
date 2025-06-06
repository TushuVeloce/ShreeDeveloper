import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loginMobileGuard } from './core/login-mobile.guard';
import { authMobileGuard } from './core/auth-mobile.guard';

const routes: Routes = [
  { path: '', redirectTo: 'auth/login-mobile', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [loginMobileGuard]
  },
  // {
  //   path: 'features',
  //   loadChildren: () => import('./features/features.module').then(m => m.FeaturesModule),
  //   canActivate: [authMobileGuard] 
  // },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsModule),
    canActivate: [authMobileGuard] 
  },
  { path: '**', redirectTo: 'auth/login-mobile' }
];

// logout() {
//   localStorage.removeItem('authToken');
//   this.router.navigate(['/login'], { replaceUrl: true });
// }

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MobileRoutingModule { }
