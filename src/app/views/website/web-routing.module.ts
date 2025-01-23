import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebComponent } from './web.component';
import { MaterialMasterComponent } from './Masters/material-master/material-master.component';
import { StageMasterComponent } from './Masters/stage-master/stage-master.component';
import { AccountMainLedgerComponent } from './Masters/account-main-ledger/account-main-ledger.component';
import { AccountSubLedgerComponent } from './Masters/account-sub-ledger/account-sub-ledger.component';
import { MarketingMasterComponent } from './Masters/marketing-master/marketing-master.component';
import { VendorMasterComponent } from './Masters/vendor-master/vendor-master.component';
import { VehicleMasterComponent } from './Masters/vehicle-master/vehicle-master.component';
import { BankMasterComponent } from './Masters/bank-master/bank-master.component';
import { UserMasterComponent } from './Masters/user-master/user-master.component';
import { DashboardComponent } from './Dashboard/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '', component: WebComponent,
    children: [
      // {path: 'Dashboard', component: DashboardComponent},
      {path: 'Material_Master', component: MaterialMasterComponent},
      {path: 'Stage_Master', component: StageMasterComponent},
      {path: 'Account_Main_Ledger', component: AccountMainLedgerComponent},
      {path: 'Account_Sub_Ledger', component: AccountSubLedgerComponent},
      {path: 'Marketing_Master', component: MarketingMasterComponent},
      {path: 'Vendor_Master', component: VendorMasterComponent},
      {path: 'Vehicle_Master', component: VehicleMasterComponent},
      {path: 'Bank_Master', component: BankMasterComponent},
      {path: 'User_Master', component: UserMasterComponent},
    
  ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebRoutingModule { }
