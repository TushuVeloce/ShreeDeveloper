import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeOvertimeMobileAppPage } from './employee-overtime-mobile-app.page';
import { EmployeeOvertimeViewMobileAppComponent } from './components/employee-overtime-view-mobile-app/employee-overtime-view-mobile-app.component';
import { EmployeeOvertimeDetailsMobileAppComponent } from './components/employee-overtime-details-mobile-app/employee-overtime-details-mobile-app.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeOvertimeMobileAppPage,
    children: [
      // { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '', component: EmployeeOvertimeViewMobileAppComponent },
      {
        path: 'add',
        component: EmployeeOvertimeDetailsMobileAppComponent,
      },
       {
        path: 'edit',
        component: EmployeeOvertimeDetailsMobileAppComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeOvertimeMobileAppPageRoutingModule {}
