import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExpensesMobileAppPageRoutingModule } from './expenses-mobile-app-routing.module';

import { ExpensesMobileAppPage } from './expenses-mobile-app.page';
import { ExpensesViewMobileAppComponent } from './components/expenses-view-mobile-app/expenses-view-mobile-app.component';
import { ExpensesDetailsMobileAppComponent } from './components/expenses-details-mobile-app/expenses-details-mobile-app.component';
import { SharedModule } from "src/app/views/mobile-app/components/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExpensesMobileAppPageRoutingModule,
    SharedModule
],
  declarations: [ExpensesMobileAppPage,ExpensesViewMobileAppComponent,ExpensesDetailsMobileAppComponent]
})
export class ExpensesMobileAppPageModule {}
