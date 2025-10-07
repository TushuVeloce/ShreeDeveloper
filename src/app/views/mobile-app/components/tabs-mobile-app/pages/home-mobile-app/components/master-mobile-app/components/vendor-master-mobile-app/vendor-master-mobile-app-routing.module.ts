import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorMasterMobileAppPage } from './vendor-master-mobile-app.page';
import { VendorMasterViewMobileAppComponent } from './components/vendor-master-view-mobile-app/vendor-master-view-mobile-app.component';
import { VendorMasterDetailsMobileAppComponent } from './components/vendor-master-details-mobile-app/vendor-master-details-mobile-app.component';
const routes: Routes = [
  {
    path: '',
    component: VendorMasterMobileAppPage,
    children: [
      { path: '', component: VendorMasterViewMobileAppComponent },
      { path: 'add', component: VendorMasterDetailsMobileAppComponent },
      { path: 'edit', component: VendorMasterDetailsMobileAppComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorMasterMobileAppPageRoutingModule {}
