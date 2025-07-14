import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpensesMobileAppPage } from './expenses-mobile-app.page';
import { ExpensesViewMobileAppComponent } from './components/expenses-view-mobile-app/expenses-view-mobile-app.component';
import { ExpensesDetailsMobileAppComponent } from './components/expenses-details-mobile-app/expenses-details-mobile-app.component';

const routes: Routes = [
  {
    path: '',
    component: ExpensesMobileAppPage,
    children: [
      // { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '', component: ExpensesViewMobileAppComponent },
      { path: 'add', component: ExpensesDetailsMobileAppComponent },
      { path: 'edit', component: ExpensesDetailsMobileAppComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpensesMobileAppPageRoutingModule {}
