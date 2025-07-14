import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncomeMobileAppPage } from './income-mobile-app.page';
import { IncomeViewMobileAppComponent } from './components/income-view-mobile-app/income-view-mobile-app.component';
import { IncomeDetailsMobileAppComponent } from './components/income-details-mobile-app/income-details-mobile-app.component';


const routes: Routes = [
  {
    path: '',
    component: IncomeMobileAppPage,
    children: [
      // { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '', component: IncomeViewMobileAppComponent },
      { path: 'add', component: IncomeDetailsMobileAppComponent },
      { path: 'edit', component: IncomeDetailsMobileAppComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncomeMobileAppPageRoutingModule {}
