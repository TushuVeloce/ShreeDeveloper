import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActualStagePage } from './actual-stage.page';
import { AddEditActualStageComponent } from './add-edit-actual-stage/add-edit-actual-stage.component';
import { PreviewPrintComponent } from './preview-print/preview-print.component';

const routes: Routes = [
  {
    path: '',
    component: ActualStagePage
  },
  { path: 'add', component: AddEditActualStageComponent }, // Add Page
  { path: 'edit', component: AddEditActualStageComponent }, // Edit Page with ID
  { path: 'print', component: PreviewPrintComponent }, // Edit Page with ID
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActualStagePageRoutingModule { }
