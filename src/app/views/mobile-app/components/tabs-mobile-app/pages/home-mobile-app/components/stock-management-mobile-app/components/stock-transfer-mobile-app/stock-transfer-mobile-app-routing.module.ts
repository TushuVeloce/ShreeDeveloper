import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockTransferMobileAppPage } from './stock-transfer-mobile-app.page';
import { StockTransferViewMobileAppComponent } from './components/stock-transfer-view-mobile-app/stock-transfer-view-mobile-app.component';
import { StockTransferDetailsMobileAppComponent } from './components/stock-transfer-details-mobile-app/stock-transfer-details-mobile-app.component';

const routes: Routes = [
  {
    path: '',
    component: StockTransferMobileAppPage,
    children: [
      // { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '', component: StockTransferViewMobileAppComponent },
      { path: 'add', component: StockTransferDetailsMobileAppComponent },
      { path: 'edit', component: StockTransferDetailsMobileAppComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockTransferMobileAppPageRoutingModule {}
