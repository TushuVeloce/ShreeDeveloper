import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaterialRequisitionPage } from './material-requisition.page';
import { AddEditMaterialRequisitionComponent } from './add-edit-material-requisition/add-edit-material-requisition.component';

const routes: Routes = [
  {
    path: '',
    component: MaterialRequisitionPage
  },
    { path: 'add', component: AddEditMaterialRequisitionComponent }, // Add Page
    { path: 'edit/:id', component: AddEditMaterialRequisitionComponent }, // Edit Page with ID
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaterialRequisitionPageRoutingModule {}
