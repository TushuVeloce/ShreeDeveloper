import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaterialRequisitionMobileAppPage } from './material-requisition-mobile-app.page';
import { MaterialRequisitionViewMobileAppComponent } from './components/material-requisition-view-mobile-app/material-requisition-view-mobile-app.component';
import { MaterialRequisitionDetailsMobileAppComponent } from './components/material-requisition-details-mobile-app/material-requisition-details-mobile-app.component';

const routes: Routes = [
  {
    path: '',
    component: MaterialRequisitionMobileAppPage,
    children: [
      // { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '', component: MaterialRequisitionViewMobileAppComponent },
      { path: 'add', component: MaterialRequisitionDetailsMobileAppComponent },
      { path: 'edit', component: MaterialRequisitionDetailsMobileAppComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaterialRequisitionMobileAppPageRoutingModule {}
