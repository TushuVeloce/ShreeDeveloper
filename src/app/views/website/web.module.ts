import { Injector, NgModule } from '@angular/core';
import { WebRoutingModule } from './web-routing.module';
import { FormsModule } from '@angular/forms';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModule, DatePipe } from '@angular/common';
import { ServiceInjector } from 'src/app/classes/infrastructure/injector';
import { StageMasterComponent } from './Masters/stage-master/stage-master.component';
import { AccountMainLedgerComponent } from './Masters/account-main-ledger/account-main-ledger.component';
import { AccountSubLedgerComponent } from './Masters/account-sub-ledger/account-sub-ledger.component';
import { MarketingMasterComponent } from './Masters/marketing-master/marketing-master.component';
import { VehicleMasterComponent } from './Masters/vehicle-master/vehicle-master.component';
import { BankMasterComponent } from './Masters/bank-master/bank-master.component';
import { UserMasterComponent } from './Masters/user-master/user-master.component';
import { SiteManagementMasterComponent } from './site-management/site-management-master/site-management-master.component';
import { SiteManagementActualStagesComponent } from './site-management/site-management-actual-stages/site-management-actual-stages.component';
import { IonicModule } from '@ionic/angular';
import { DepartmentMasterComponent } from './Masters/department-master/department-master.component';
import { UserRoleMasterComponent } from './Masters/user-role-master/user-role-master.component';
import { EmployeeMasterComponent } from './Masters/employee-master/employee-master.component';
import { CompanyMasterComponent } from './Masters/company/company-master/company-master.component';
import { CompanyMasterDetailsComponent } from './Masters/company/company-master-details/company-master-details.component';
import { MaterialMasterComponent } from './Masters/material_master/material-master/material-master.component';
import { MaterialMasterDetailsComponent } from './Masters/material_master/material-master-details/material-master-details.component';

@NgModule({
  declarations: [MaterialMasterComponent, MaterialMasterDetailsComponent  ,StageMasterComponent,AccountMainLedgerComponent,AccountSubLedgerComponent,MarketingMasterComponent,
    VendorMasterComponent,VehicleMasterComponent,BankMasterComponent,UserMasterComponent,CompanyMasterComponent,CompanyMasterDetailsComponent, DepartmentMasterComponent,UserRoleMasterComponent,EmployeeMasterComponent,
    SiteManagementMasterComponent,SiteManagementActualStagesComponent],
  imports: [
    CommonModule,WebRoutingModule,FormsModule,NzDropDownModule,NzTableModule,IonicModule.forRoot()
  ],
  providers: [DatePipe]
})
export class WebModule {
  constructor(private injector: Injector) {
    ServiceInjector.AppInjector = this.injector;
  }
 }
