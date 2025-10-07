import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MasterMobileAppPage } from './master-mobile-app.page';
import { MastersViewMobileAppComponent } from './components/masters-view-mobile-app/masters-view-mobile-app.component';

const routes: Routes = [
  {
    path: '',
    component: MasterMobileAppPage,
    children: [
      { path: '', component: MastersViewMobileAppComponent },
      {
        path: 'vendor-master',
        loadChildren: () =>
          import(
            './components/vendor-master-mobile-app/vendor-master-mobile-app.module'
          ).then((m) => m.VendorMasterMobileAppPageModule),
      },
      {
        path: 'vendor-service-master',
        loadChildren: () =>
          import(
            './components/vendor-service-master-mobile-app/vendor-service-master-mobile-app.module'
          ).then((m) => m.VendorServiceMasterMobileAppPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterMobileAppPageRoutingModule {}
