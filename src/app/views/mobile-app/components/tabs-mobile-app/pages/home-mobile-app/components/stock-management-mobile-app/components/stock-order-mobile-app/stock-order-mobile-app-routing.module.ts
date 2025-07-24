import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockOrderMobileAppPage } from './stock-order-mobile-app.page';
import { StockOrderViewMobileAppComponent } from './components/stock-order-view-mobile-app/stock-order-view-mobile-app.component';
import { StockOrderDetailsMobileAppComponent } from './components/stock-order-details-mobile-app/stock-order-details-mobile-app.component';
import { StockOrderPrintMobileAppComponent } from './components/stock-order-print-mobile-app/stock-order-print-mobile-app.component';

const routes: Routes = [
  {
    path: '',
    component: StockOrderMobileAppPage,
    children: [
      // { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '', component: StockOrderViewMobileAppComponent },
      { path: 'add', component: StockOrderDetailsMobileAppComponent },
      { path: 'edit', component: StockOrderDetailsMobileAppComponent },
      { path: 'print', component: StockOrderPrintMobileAppComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockOrderMobileAppPageRoutingModule {}
