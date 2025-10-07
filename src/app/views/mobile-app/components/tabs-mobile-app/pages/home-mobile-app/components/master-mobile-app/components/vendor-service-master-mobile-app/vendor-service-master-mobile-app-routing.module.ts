import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VendorServiceMasterMobileAppPage } from './vendor-service-master-mobile-app.page';
import { VendorServiceMasterViewMobileAppComponent } from './components/vendor-service-master-view-mobile-app/vendor-service-master-view-mobile-app.component';
import { VendorServiceMasterDetailsMobileAppComponent } from './components/vendor-service-master-details-mobile-app/vendor-service-master-details-mobile-app.component';
const routes: Routes = [
  {
    path: '',
    component: VendorServiceMasterMobileAppPage,
    children: [
      { path: '', component: VendorServiceMasterViewMobileAppComponent },
      { path: 'add', component: VendorServiceMasterDetailsMobileAppComponent },
      { path: 'edit', component: VendorServiceMasterDetailsMobileAppComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorServiceMasterMobileAppPageRoutingModule {}
