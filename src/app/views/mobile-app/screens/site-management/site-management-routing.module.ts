import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SiteManagementPage } from './site-management.page';

const routes: Routes = [
  {
    path: '',
    component: SiteManagementPage
  },
  {
    path: 'actual-stage',
    loadChildren: () => import('./actual-stage/actual-stage.module').then( m => m.ActualStagePageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiteManagementPageRoutingModule {}
