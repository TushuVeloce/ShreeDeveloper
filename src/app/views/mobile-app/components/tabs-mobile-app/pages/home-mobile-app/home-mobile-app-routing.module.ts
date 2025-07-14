import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeMobileAppPage } from './home-mobile-app.page';
import { HomeViewMobileAppComponent } from './components/home-view-mobile-app/home-view-mobile-app.component';

const routes: Routes = [
  {
    path: '',
    component: HomeMobileAppPage,
    children: [
      // { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '', component: HomeViewMobileAppComponent },
      {
        path: 'site-management',
        loadChildren: () => import('./components/site-management-mobile-app/site-management-mobile-app.module').then(m => m.SiteManagementMobileAppPageModule)
      },
      {
        path: 'stock-management',
        loadChildren: () => import('./components/stock-management-mobile-app/stock-management-mobile-app.module').then(m => m.StockManagementMobileAppPageModule)
      },
      {
        path: 'marketing-management',
        loadChildren: () => import('./components/marketing-management-mobile-app/marketing-management-mobile-app.module').then(m => m.MarketingManagementMobileAppPageModule)
      },
      {
        path: 'accounting',
        loadChildren: () => import('./components/accounting-mobile-app/accounting-mobile-app.module').then(m => m.AccountingMobileAppPageModule)
      },
      {
        path: 'customer-relationship-management',
        loadChildren: () => import('./components/customer-relationship-management-mobile-app/customer-relationship-management-mobile-app.module').then(m => m.CustomerRelationshipManagementMobileAppPageModule)
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeMobileAppPageRoutingModule { }
