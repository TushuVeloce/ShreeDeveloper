import { Injector, NgModule } from '@angular/core';
import { WebRoutingModule } from './web-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModule, DatePipe } from '@angular/common';
import { ServiceInjector } from 'src/app/classes/infrastructure/injector';
import { SiteManagementMasterComponent } from './site-management/site-management-master/site-management-master.component';
import { SiteManagementActualStagesComponent } from './site-management/site-management-actual-stages/site-management-actual-stages.component';
import { IonicModule } from '@ionic/angular';
import { CompanyMasterComponent } from './Masters/company/company-master/company-master.component';
import { CompanyMasterDetailsComponent } from './Masters/company/company-master-details/company-master-details.component';
import { VendorMasterComponent } from './Masters/vendor/vendor-master/vendor-master.component';
import { VehicleMasterComponent } from './Masters/vehicle/vehicle-master/vehicle-master.component';
import { VendorMasterDetailsComponent } from './Masters/vendor/vendor-master-details/vendor-master-details.component';
import { MaterialMasterComponent } from './Masters/material/material-master/material-master.component';
import { MaterialMasterDetailsComponent } from './Masters/material/material-master-details/material-master-details.component';
import { StageMasterComponent } from './Masters/stage/stage-master/stage-master.component';
import { StageMasterDetailsComponent } from './Masters/stage/stage-master-details/stage-master-details.component';
import { AccountMainLedgerComponent } from './Masters/account_main_ledger/account-main-ledger/account-main-ledger.component';
import { AccountMainLedgerDetailsComponent } from './Masters/account_main_ledger/account-main-ledger-details/account-main-ledger-details.component';
import { AccountSubLedgerComponent } from './Masters/account_sub_ledger/account-sub-ledger/account-sub-ledger.component';
import { AccountSubLedgerDetailsComponent } from './Masters/account_sub_ledger/account-sub-ledger-details/account-sub-ledger-details.component';
import { MarketingMasterComponent } from './Masters/marketing/marketing-master/marketing-master.component';
import { MarketingMasterDetailsComponent } from './Masters/marketing/marketing-master-details/marketing-master-details.component';
import { BankMasterComponent } from './Masters/bank/bank-master/bank-master.component';
import { BankMasterDetailsComponent } from './Masters/bank/bank-master-details/bank-master-details.component';
import { UserMasterComponent } from './Masters/user/user-master/user-master.component';
import { UserMasterDetailsComponent } from './Masters/user/user-master-details/user-master-details.component';
import { DepartmentMasterComponent } from './Masters/department/department-master/department-master.component';
import { DepartmentMasterDetailsComponent } from './Masters/department/department-master-details/department-master-details.component';
import { UserRoleMasterComponent } from './Masters/user_role/user-role-master/user-role-master.component';
import { UserRoleMasterDetailsComponent } from './Masters/user_role/user-role-master-details/user-role-master-details.component';
import { EmployeeMasterComponent } from './Masters/employee/employee-master/employee-master.component';
import { EmployeeMasterDetailsComponent } from './Masters/employee/employee-master-details/employee-master-details.component';
import { SiteManagementActualStagesDetailsComponent } from './site-management/site-management-actual-stages-details/site-management-actual-stages-details.component';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { EstimateStagesDetailsComponent } from './estimate_stages/estimate-stages-details/estimate-stages-details.component';
import { EstimateStagesComponent } from './estimate_stages/estimate-stages/estimate-stages.component';
import { MaterialRequisitionComponent } from './stock management/material-requisition/material-requisition.component';
import { StockConsumeComponent } from './stock management/stock-consume/stock-consume.component';
import { StockInwardComponent } from './stock management/stock-inward/stock-inward.component';
import { StockOrderComponent } from './stock management/stock-order/stock-order.component';
import { StockTransferComponent } from './stock management/stock-transfer/stock-transfer.component';
import { CountryComponent } from './Masters/country/country.component';
import { StateComponent } from './Masters/state/state.component';
import { CityComponent } from './Masters/city/city.component';
import { UnitMasterComponent } from './Masters/unit/unit-master/unit-master.component';
import { UnitMasterDetailsComponent } from './Masters/unit/unit-master-details/unit-master-details.component';

@NgModule({
  declarations: [MaterialMasterComponent, MaterialMasterDetailsComponent  ,StageMasterComponent,StageMasterDetailsComponent, AccountMainLedgerComponent,AccountMainLedgerDetailsComponent, AccountSubLedgerComponent, AccountSubLedgerDetailsComponent, MarketingMasterComponent,MarketingMasterDetailsComponent,
    VendorMasterComponent,VehicleMasterComponent,VendorMasterDetailsComponent, BankMasterComponent,BankMasterDetailsComponent, UserMasterComponent,UserMasterDetailsComponent, CompanyMasterComponent,CompanyMasterDetailsComponent, DepartmentMasterComponent,DepartmentMasterDetailsComponent, UserRoleMasterComponent,UserRoleMasterDetailsComponent, EmployeeMasterComponent,EmployeeMasterDetailsComponent,
    SiteManagementMasterComponent,SiteManagementActualStagesComponent,SiteManagementActualStagesDetailsComponent,EstimateStagesDetailsComponent,EstimateStagesComponent,
    MaterialRequisitionComponent,StockConsumeComponent,StockInwardComponent,StockOrderComponent,StockTransferComponent , CountryComponent, StateComponent,CityComponent,UnitMasterComponent,UnitMasterDetailsComponent],
  imports: [
    CommonModule,WebRoutingModule,FormsModule,NzDropDownModule,NzTableModule,IonicModule.forRoot(),
    NzPaginationModule, NzUploadModule, NzModalModule,
    CommonModule, NzTableModule, NzIconModule, NzLayoutModule, NzMenuModule, ReactiveFormsModule, NzButtonModule, NzSelectModule,
  ],
  providers: [DatePipe]
})
export class WebModule {
  constructor(private injector: Injector) {
    ServiceInjector.AppInjector = this.injector;
  }
 }
