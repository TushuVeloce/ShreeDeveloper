import { Injector, NgModule } from '@angular/core';
import { WebRoutingModule } from './web-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModule, DatePipe } from '@angular/common';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
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
import { StockOrderComponent } from './stock management/stock_order/stock-order/stock-order.component';
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

import { NzStepsModule } from 'ng-zorro-antd/steps';

import { OfficeDutyTimeComponent } from './hr_payroll_management/office_duty_time/office-duty-time/office-duty-time.component';
import { SiteWorkGroupMasterComponent } from './government_office_masters/site_work_group/site-work-group-master/site-work-group-master.component';
import { SiteWorkGroupMasterDetailsComponent } from './government_office_masters/site_work_group/site-work-group-master-details/site-work-group-master-details.component';
import { ProgressReportComponent } from './government_office_masters/progress_report/progress-report.component';
import { GovernmentOfficeComponent } from './government_office_masters/government-office/government-office.component';
import { DocumentListComponent } from './government_office_masters/document/document-list/document-list.component';
import { DocumentDetailsComponent } from './government_office_masters/document/document-details/document-details.component';
import { SiteWorkMasterDetailComponent } from './government_office_masters/siteworkmaster/site-work-master-detail/site-work-master-detail.component';
import { SiteWorkMasterComponent } from './government_office_masters/siteworkmaster/site-work-master/site-work-master.component';
import { SiteWorkDoneMasterDetailsComponent } from './government_office_masters/site_work_done/site-work-done-master-details/site-work-done-master-details.component';
import { SiteWorkDoneMasterComponent } from './government_office_masters/site_work_done/site-work-done-master/site-work-done-master.component';
import { GovernmentTransactionDetailsComponent } from './government_transaction/government-transaction-details/government-transaction-details.component';
import { GovernmentTransactionMasterComponent } from './government_transaction/government-transaction-master/government-transaction-master.component';
import { TpOfficeDetailsComponent } from './government_transaction/child component/tp-office-details/tp-office-details.component';
import { NaLetterDetailsComponent } from './government_transaction/child component/na-letter-details/na-letter-details.component';
import { MojaniDetailsComponent } from './government_transaction/child component/mojani-details/mojani-details.component';
import { UlcDetailsComponent } from './government_transaction/child component/ulc-details/ulc-details.component';
import { FinalLayoutDetailsComponent } from './government_transaction/child component/final-layout-details/final-layout-details.component';
import { KJaPaDetailsComponent } from './government_transaction/child component/k-ja-pa-details/k-ja-pa-details.component';
import { RespectedChildComponentComponent } from './government_transaction/respected-child-component/respected-child-component.component';
import { SalaryGenerationComponent } from './hr_payroll_management/salary_generation/salary-generation/salary-generation.component';
import { SalaryGenerationDetailsComponent } from './hr_payroll_management/salary_generation/salary-generation-details/salary-generation-details.component';
import { LeaveApprovalComponent } from './hr_payroll_management/leave-approval/leave-approval.component';
import { SalarySlipApprovalComponent } from './hr_payroll_management/salary-slip-approval/salary-slip-approval.component';
import { AttendanceLogsComponent } from './hr_payroll_management/attendance_logs/attendance-logs/attendance-logs.component';
import { OfficeDutyTimeDetailsComponent } from './hr_payroll_management/office_duty_time/office-duty-time-details/office-duty-time-details.component';
import { LeaveRequestComponent } from './employee_request/leave_request/leave-request/leave-request.component';
import { LeaveRequestDetailsComponent } from './employee_request/leave_request/leave-request-details/leave-request-details.component';
import { SalarySlipRequestComponent } from './employee_request/salary_slip_request/salary-slip-request/salary-slip-request.component';
import { SalarySlipRequestDetailsComponent } from './employee_request/salary_slip_request/salary-slip-request-details/salary-slip-request-details.component';
import { EmployeeAttendanceLogsComponent } from './employee_request/employee_attendance_logs/employee-attendance-logs/employee-attendance-logs.component';
import { ValidationMessageComponent } from './Helpers/Validation-Message/validation-message.component';
import { PaginationComponent } from './Helpers/pagination/pagination';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzCardModule } from 'ng-zorro-antd/card';
import { SubStageMasterComponent } from './Masters/sub_stage/sub-stage-master/sub-stage-master.component';
import { SubStageMasterDetailsComponent } from './Masters/sub_stage/sub-stage-master-details/sub-stage-master-details.component';
import { ExpenseTypeMasterComponent } from './Masters/expense _type/expense-type-master/expense-type-master.component';
import { ExpenseTypeMasterDetailsComponent } from './Masters/expense _type/expense-type-master-details/expense-type-master-details.component';
import { MarketingManagementMasterComponent } from './marketing_management/marketing-management/marketing-management-master/marketing-management-master.component';
import { MarketingManagementMasterDetailsComponent } from './marketing_management/marketing-management/marketing-management-master-details/marketing-management-master-details.component';
import { ActualStagePrintComponent } from './site-management/actual-stage-print/actual-stage-print.component';
import { CustomerPendingFollowupComponent } from './customer_management/presale/customer_followup/customer_pendingfollowup/customer-pendingfollowup.component';
import { SharedFilterComponent } from './Helpers/shared-filter/shared-filter.component';
import { EmployeeOvertime } from 'src/app/classes/domain/entities/website/HR_and_Payroll/Employee_Overtime/employeeovertime';
import { EmployeeOvertimeComponent } from './hr_payroll_management/employee_overtime/employee-overtime/employee-overtime.component';
import { EmployeeOvertimeDetailsComponent } from './hr_payroll_management/employee_overtime/employee-overtime-details/employee-overtime-details.component';
import { CompanyHolidays } from 'src/app/classes/domain/entities/website/HR_and_Payroll/company_holidays/companyholidays';
import { CompanyHolidaysComponent } from './hr_payroll_management/company_holidays/company-holidays/company-holidays.component';
import { CompanyHolidaysDetailsComponent } from './hr_payroll_management/company_holidays/company-holidays-details/company-holidays-details.component';
import { AttendanceDetailsComponent } from './hr_payroll_management/attendance_logs/attendance-details/attendance-details.component';
import { ForgotPasswordComponent } from '../sidebarlayout/forgot_password/forgot-password/forgot-password.component';
import { MaterialRequisitionComponent } from './stock management/material_requisition/material-requisition/material-requisition.component';
import { MaterialRequisitionDetailsComponent } from './stock management/material_requisition/material-requisition-details/material-requisition-details.component';
import { QuotationComponent } from './stock management/Quotation/quotation/quotation.component';
import { QuotationDetailsComponent } from './stock management/Quotation/quotation-details/quotation-details.component';
import { StockInwardComponent } from './stock management/stock_inward/stock_inward/stock-inward.component';
import { StockInwardDetailsComponent } from './stock management/stock_inward/stock-inward-details/stock-inward-details.component';
import { QuotationApprovalComponent } from './stock management/Quotation/quotation-approval/quotation-approval.component';
import { StockOrderDetailsComponent } from './stock management/stock_order/stock-order-details/stock-order-details.component';
import { StockTransferComponent } from './stock management/stock_transfer/stock-transfer/stock-transfer.component';
import { StockConsumeComponent } from './stock management/stock_consume/stock-consume/stock-consume.component';
import { StockTransferDetailsComponent } from './stock management/stock_transfer/stock-transfer-details/stock-transfer-details.component';
import { StockConsumeDetailsComponent } from './stock management/stock_consume/stock-consume-details/stock-consume-details.component';
import { YourProfileComponent } from './profile/your_profile/your-profile.component';
import { OrderApprovalComponent } from './stock management/stock_order/order-approval/order-approval.component';
import { StockOrderPrintComponent } from './stock management/stock_order/stock-order-print/stock-order-print.component';
import { StockInwardPrintComponent } from './stock management/stock_inward/stock-inward-print/stock-inward-print.component';
import { AddStockOrderComponent } from './stock management/stock_order/add-stock-order/add-stock-order.component';
import { InvoiceComponent } from './accounting/invoice/invoice/invoice.component';
import { InvoiceDetailsComponent } from './accounting/invoice/invoice-details/invoice-details.component';
import { ExpenseComponent } from './accounting/expense/expense/expense.component';
import { ExpenseDetailsComponent } from './accounting/expense/expense-details/expense-details.component';
import { IncomeComponent } from './accounting/income/income/income.component';
import { IncomeDetailsComponent } from './accounting/income/income-details/income-details.component';
import { TitleCasePipe } from 'src/app/services/title-case.pipe';
import { RecipientMasterComponent } from './Masters/recipient_name/recipient-name-master/recipient-name-master.component';
import { RecipientMasterDetailsComponent } from './Masters/recipient_name/recipient-name-master-details/recipient-name-master-details.component';
import { PayerComponent } from './Masters/payer/payer/payer.component';
import { PayerDetailsComponent } from './Masters/payer/payer-details/payer-details.component';
import { AccountingReportComponent } from './accounting/accounting_report/accounting-report/accounting-report.component';
import { InvoicePrintComponent } from './accounting/invoice/invoice-print/invoice-print.component';
import { OpeningBalanceComponent } from './Masters/opening_balance/opening-balance/opening-balance.component';
import { OpeningBalanceDetailsComponent } from './Masters/opening_balance/opening-balance-details/opening-balance-details.component';

@NgModule({
  declarations: [MaterialMasterComponent, MaterialMasterDetailsComponent, StageMasterComponent, StageMasterDetailsComponent, AccountMainLedgerComponent, AccountMainLedgerDetailsComponent, AccountSubLedgerComponent, AccountSubLedgerDetailsComponent, MarketingTypeMasterComponent, MarketingTypeMasterDetailsComponent, VendorMasterComponent, VehicleMasterComponent, VendorMasterDetailsComponent, BankAccountMasterComponent, BankAccountMasterDetailsComponent, ExternalUsersComponent, ExternalUsersMasterDetailsComponent, CompanyMasterComponent, CompanyMasterDetailsComponent, DepartmentMasterComponent, DepartmentMasterDetailsComponent, DesignationMasterComponent, DesignationMasterDetailsComponent, UserRoleMasterComponent, UserRoleMasterDetailsComponent, EmployeeMasterComponent, EmployeeMasterDetailsComponent,
    SiteManagementMasterComponent, SiteManagementActualStagesComponent, SiteManagementActualStagesDetailsComponent, EstimateStagesDetailsComponent, EstimateStagesComponent, MaterialRequisitionComponent, MaterialRequisitionDetailsComponent, StockConsumeComponent, StockConsumeDetailsComponent, StockInwardComponent, StockInwardDetailsComponent, StockOrderComponent, StockTransferComponent, StockTransferDetailsComponent, CountryComponent, StateComponent, CityComponent, UnitMasterComponent, UnitMasterDetailsComponent, DeleteIconComponent, EditIconComponent, DataNotFoundComponent, VehicleMasterDetailsComponent, UserrolerightsComponent, FinancialYearMasterComponent, SiteWorkGroupMasterComponent, SiteWorkGroupMasterDetailsComponent, VendorServicesMasterComponent, VendorServicesMasterDetailsComponent, SiteManagementDetailsComponent, EmployeeAppraisalDetailsComponent, ProgressReportComponent, GovernmentOfficeComponent, EmployeeAppraisalMasterComponent, EmployeeExitDetailsComponent, EmployeeExitMasterComponent, PlotMasterComponent, DocumentListComponent, DocumentDetailsComponent, ActualStagePrintComponent, PlotMasterDetailsComponent, CustomerEnquiryComponent, CustomerEnquiryDetailsComponent, CustomerFollowupComponent, CustomerFollowupDetailsComponent, RegisteredCustomerComponent, RegisteredCustomerDetailsComponent, RegistrarOfficeComponent, RegistrarOfficeDetailComponent, SiteWorkMasterDetailComponent, SiteWorkMasterComponent,
    OfficeDutyTimeComponent, OfficeDutyTimeDetailsComponent, SiteWorkDoneMasterDetailsComponent, SiteWorkDoneMasterComponent, GovernmentTransactionDetailsComponent, GovernmentTransactionMasterComponent, TpOfficeDetailsComponent, NaLetterDetailsComponent, MojaniDetailsComponent, SalaryGenerationComponent, SalaryGenerationDetailsComponent, LeaveApprovalComponent, LeaveRequestComponent, LeaveRequestDetailsComponent, SalarySlipApprovalComponent, SalarySlipRequestComponent, SalarySlipRequestDetailsComponent, StockOrderPrintComponent, StockInwardPrintComponent, AddStockOrderComponent, RecipientMasterComponent, RecipientMasterDetailsComponent, PayerComponent, PayerDetailsComponent, InvoicePrintComponent,
    UlcDetailsComponent, FinalLayoutDetailsComponent, KJaPaDetailsComponent, RespectedChildComponentComponent, AttendanceLogsComponent, EmployeeAttendanceLogsComponent, ValidationMessageComponent, PaginationComponent, SubStageMasterComponent, SubStageMasterDetailsComponent, ExpenseTypeMasterComponent, ExpenseTypeMasterDetailsComponent, MarketingManagementMasterComponent, MarketingManagementMasterDetailsComponent, CustomerPendingFollowupComponent, EmployeeOvertimeComponent, EmployeeOvertimeDetailsComponent, YourProfileComponent, CompanyHolidaysComponent, CompanyHolidaysDetailsComponent, AttendanceDetailsComponent, QuotationComponent, QuotationDetailsComponent, QuotationApprovalComponent, StockOrderDetailsComponent, OrderApprovalComponent, InvoiceComponent, InvoiceDetailsComponent, ExpenseComponent, ExpenseDetailsComponent, IncomeComponent, IncomeDetailsComponent,AccountingReportComponent,OpeningBalanceComponent,OpeningBalanceDetailsComponent],
  imports: [
    CommonModule, WebRoutingModule, FormsModule, NzDropDownModule, NzTableModule, IonicModule.forRoot(),
    NzPaginationModule, NzUploadModule, NzModalModule, NzCheckboxModule, NzCardModule, NzEmptyModule,
    CommonModule, NzTableModule, NzIconModule, NzLayoutModule, NzMenuModule, ReactiveFormsModule, NzButtonModule, NzSelectModule, NzStepsModule, NzButtonModule, NzToolTipModule, SharedFilterComponent, TitleCasePipe
  ],
  providers: [DatePipe],
  exports: [SharedFilterComponent, TitleCasePipe],
})
export class WebModule {
  constructor(private injector: Injector) {
    ServiceInjector.AppInjector = this.injector;
  }
}
