import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockInwardMobileAppPage } from './stock-inward-mobile-app.page';
import { StockInwardViewMobileAppComponent } from './components/stock-inward-view-mobile-app/stock-inward-view-mobile-app.component';
import { StockInwardDetailsMobileAppComponent } from './components/stock-inward-details-mobile-app/stock-inward-details-mobile-app.component';
import { StockInwardPrintMobileAppComponent } from './components/stock-inward-print-mobile-app/stock-inward-print-mobile-app.component';

const routes: Routes = [
  {
    path: '',
    component: StockInwardMobileAppPage,
    children: [
      // { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '', component: StockInwardViewMobileAppComponent },
      { path: 'add', component: StockInwardDetailsMobileAppComponent },
      { path: 'edit', component: StockInwardDetailsMobileAppComponent },
      { path: 'print', component: StockInwardPrintMobileAppComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockInwardMobileAppPageRoutingModule {}
