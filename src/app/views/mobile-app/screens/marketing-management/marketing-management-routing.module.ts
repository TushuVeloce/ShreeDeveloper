import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarketingManagementPage } from './marketing-management.page';
import { AddEditMarketingManagementComponent } from './add-edit-marketing-management/add-edit-marketing-management.component';

const routes: Routes = [
  {
    path: '',
    component: MarketingManagementPage
  },
  { path: 'add', component: AddEditMarketingManagementComponent }, // Add Page
  { path: 'edit/:id', component: AddEditMarketingManagementComponent }, // Edit Page with ID
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketingManagementPageRoutingModule { }
