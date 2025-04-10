import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActualStagePage } from './actual-stage.page';
import { AddEditActualStageComponent } from './add-edit-actual-stage/add-edit-actual-stage.component';

const routes: Routes = [
  {
    path: '',
    component: ActualStagePage
  },
  { path: 'add', component: AddEditActualStageComponent }, // Add Page
  { path: 'edit/:id', component: AddEditActualStageComponent }, // Edit Page with ID
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActualStagePageRoutingModule { }
