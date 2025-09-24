import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HolidaysMobileAppPage } from './holidays-mobile-app.page';
import { HolidaysViewMobileAppComponent } from './components/holidays-view-mobile-app/holidays-view-mobile-app.component';
import { HolidaysDetailsMobileAppComponent } from './components/holidays-details-mobile-app/holidays-details-mobile-app.component';

const routes: Routes = [
  {
    path: '',
    component: HolidaysMobileAppPage,
    children: [
      { path: '', component: HolidaysViewMobileAppComponent },
      { path: 'add', component: HolidaysDetailsMobileAppComponent },
      { path: 'edit  ', component: HolidaysDetailsMobileAppComponent },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HolidaysMobileAppPageRoutingModule {}
