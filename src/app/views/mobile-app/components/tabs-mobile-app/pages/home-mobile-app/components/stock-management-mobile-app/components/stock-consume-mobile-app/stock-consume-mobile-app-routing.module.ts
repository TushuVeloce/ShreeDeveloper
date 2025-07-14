import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockConsumeMobileAppPage } from './stock-consume-mobile-app.page';
import { StockConsumeViewMobileAppComponent } from './components/stock-consume-view-mobile-app/stock-consume-view-mobile-app.component';
import { StockConsumeDetailsMobileAppComponent } from './components/stock-consume-details-mobile-app/stock-consume-details-mobile-app.component';

const routes: Routes = [
  {
    path: '',
    component: StockConsumeMobileAppPage,
    children: [
      // { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '', component: StockConsumeViewMobileAppComponent },
      { path: 'add', component: StockConsumeDetailsMobileAppComponent },
      { path: 'edit', component: StockConsumeDetailsMobileAppComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockConsumeMobileAppPageRoutingModule {}
