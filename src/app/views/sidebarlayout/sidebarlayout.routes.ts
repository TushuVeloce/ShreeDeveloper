import { Routes } from '@angular/router';
import { SidebarlayoutComponent } from './sidebarlayout.component';


export const SidebarLayout_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'homepage' },
  {
    path: '', component: SidebarlayoutComponent,
    children: [
      // { path: 'gladiance', loadChildren: () => import('../../gladiance/gladiance.routes').then(m => m.Gladiance_ROUTES) }
      { path: 'Website', loadChildren: () => import('../website/web.module').then(m => m.WebModule) }
    ]
  },
];
