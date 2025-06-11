import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaterialRequisitionDetailsMobilePage } from './material-requisition-details-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: MaterialRequisitionDetailsMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaterialRequisitionDetailsMobilePageRoutingModule {}
