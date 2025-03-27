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
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
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
import { DeleteIconComponent } from './Helpers/delete-icon/delete-icon.component';
import { EditIconComponent } from './Helpers/edit-icon/edit-icon.component';
import { DataNotFoundComponent } from './Helpers/data-not-found/data-not-found.component';
import { VehicleMasterDetailsComponent } from './Masters/vehicle/vehicle-master-details/vehicle-master-details.component';
import { UserrolerightsComponent } from './Masters/userrolerights/userrolerights.component';
import { FinancialYearMasterComponent } from './Masters/financial-year-master/financial-year-master.component';
import { VendorServicesMasterComponent } from './Masters/vendor_services/vendor-services-master/vendor-services-master.component';
import { VendorServicesMasterDetailsComponent } from './Masters/vendor_services/vendor-services-master-details/vendor-services-master-details.component';
import { BankAccountMasterComponent } from './Masters/bank_account/bank-account-master/bank-account-master.component';
import { BankAccountMasterDetailsComponent } from './Masters/bank_account/bank-account-master-details/bank-account-master-details.component';
import { MarketingTypeMasterComponent } from './Masters/marketing_type/marketing-type-master/marketing-type-master.component';
import { MarketingTypeMasterDetailsComponent } from './Masters/marketing_type/marketing-type-master-details/marketing-type-master-details.component';
import { ExternalUsersComponent } from './Masters/external_users/external-users/external-users.component';
import { ExternalUsersMasterDetailsComponent } from './Masters/external_users/external-users-details/external-users-details.component';
import { DesignationMasterComponent } from './Masters/designation/designation-master/designation-master.component';
import { DesignationMasterDetailsComponent } from './Masters/designation/designation-master-details/designation-master-details.component';
import { SiteManagementDetailsComponent } from './site-management/site-management-details/site-management-details.component';
import { EmployeeAppraisalDetailsComponent } from './Masters/employee_appraisal/employee-appraisal-details/employee-appraisal-details.component';
import { EmployeeAppraisalMasterComponent } from './Masters/employee_appraisal/employee-appraisal-master/employee-appraisal-master.component';
import { EmployeeExitDetailsComponent } from './Masters/employee_exit/employee-exit-details/employee-exit-details.component';
import { EmployeeExitMasterComponent } from './Masters/employee_exit/employee-exit-master/employee-exit-master.component';
import { PlotMasterComponent } from './site-management/plot_details/plot-master/plot-master.component';
import { PlotMasterDetailsComponent } from './site-management/plot_details/plot-master-details/plot-master-details.component';
import { CustomerEnquiryComponent } from './customer_management/presale/customer_enquiry/customer-enquiry/customer-enquiry.component';
import { CustomerEnquiryDetailsComponent } from './customer_management/presale/customer_enquiry/customer-enquiry-details/customer-enquiry-details.component';
import { CustomerFollowupDetailsComponent } from './customer_management/presale/customer_followup/customer-followup-details/customer-followup-details.component';
import { CustomerFollowupComponent } from './customer_management/presale/customer_followup/customer-followup/customer-followup.component';
import { RegisteredCustomerComponent } from './customer_management/presale/registered_customer/registered-customer/registered-customer.component';
import { RegisteredCustomerDetailsComponent } from './customer_management/presale/registered_customer/registered-customer-details/registered-customer-details.component';
import { RegistrarOfficeComponent } from './registrar_office/registrar-office/registrar-office.component';
import { RegistrarOfficeDetailComponent } from './registrar_office/registrar-office-detail/registrar-office-detail.component';
import { DocumentListComponent } from './government_office/document/document-list/document-list.component';
import { DocumentDetailsComponent } from './government_office/document/document-details/document-details.component';

@NgModule({
  declarations: [MaterialMasterComponent, MaterialMasterDetailsComponent  ,StageMasterComponent,StageMasterDetailsComponent, AccountMainLedgerComponent,AccountMainLedgerDetailsComponent, AccountSubLedgerComponent, AccountSubLedgerDetailsComponent, MarketingTypeMasterComponent,MarketingTypeMasterDetailsComponent,
    VendorMasterComponent,VehicleMasterComponent,VendorMasterDetailsComponent, BankAccountMasterComponent,BankAccountMasterDetailsComponent, ExternalUsersComponent,ExternalUsersMasterDetailsComponent, CompanyMasterComponent,CompanyMasterDetailsComponent, DepartmentMasterComponent,DepartmentMasterDetailsComponent,DesignationMasterComponent,DesignationMasterDetailsComponent, UserRoleMasterComponent,UserRoleMasterDetailsComponent, EmployeeMasterComponent,EmployeeMasterDetailsComponent,
    SiteManagementMasterComponent,SiteManagementActualStagesComponent,SiteManagementActualStagesDetailsComponent,EstimateStagesDetailsComponent,EstimateStagesComponent,
    MaterialRequisitionComponent,StockConsumeComponent,StockInwardComponent,StockOrderComponent,StockTransferComponent , CountryComponent, StateComponent,CityComponent,UnitMasterComponent,UnitMasterDetailsComponent,
    DeleteIconComponent,EditIconComponent, DataNotFoundComponent,VehicleMasterDetailsComponent,UserrolerightsComponent,FinancialYearMasterComponent,
    VendorServicesMasterComponent,VendorServicesMasterDetailsComponent,SiteManagementDetailsComponent,EmployeeAppraisalDetailsComponent,
    EmployeeAppraisalMasterComponent,EmployeeExitDetailsComponent,EmployeeExitMasterComponent,PlotMasterComponent, DocumentListComponent, DocumentDetailsComponent,
    PlotMasterDetailsComponent,CustomerEnquiryComponent,CustomerEnquiryDetailsComponent,CustomerFollowupComponent, CustomerFollowupDetailsComponent,RegisteredCustomerComponent,RegisteredCustomerDetailsComponent,RegistrarOfficeComponent,RegistrarOfficeDetailComponent],
  imports: [
    CommonModule,WebRoutingModule,FormsModule,NzDropDownModule,NzTableModule,IonicModule.forRoot(),
    NzPaginationModule, NzUploadModule, NzModalModule,NzCheckboxModule,
    CommonModule, NzTableModule, NzIconModule, NzLayoutModule, NzMenuModule, ReactiveFormsModule, NzButtonModule, NzSelectModule,
  ],
  providers: [DatePipe]
})
export class WebModule {
  constructor(private injector: Injector) {
    ServiceInjector.AppInjector = this.injector;
  }
 }
