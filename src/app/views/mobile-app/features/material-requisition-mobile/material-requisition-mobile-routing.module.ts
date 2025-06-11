import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaterialRequisitionMobilePage } from './material-requisition-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: MaterialRequisitionMobilePage
  },
  {
    path: 'add',
    loadChildren: () => import('../material-requisition-details-mobile/material-requisition-details-mobile.module').then(m => m.MaterialRequisitionDetailsMobilePageModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('../material-requisition-details-mobile/material-requisition-details-mobile.module').then(m => m.MaterialRequisitionDetailsMobilePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaterialRequisitionMobilePageRoutingModule {}
