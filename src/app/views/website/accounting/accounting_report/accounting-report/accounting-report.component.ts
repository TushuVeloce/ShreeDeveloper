import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountingReport } from 'src/app/classes/domain/entities/website/accounting/accountingreport/accoiuntingreport';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-accounting-report',
  standalone: false,
  templateUrl: './accounting-report.component.html',
  styleUrls: ['./accounting-report.component.scss'],
})
export class AccountingReportComponent  implements OnInit {
Entity: AccountingReport = AccountingReport.CreateNewInstance();
   MasterList: AccountingReport[] = [];
   DisplayMasterList: AccountingReport[] = [];
   SearchString: string = '';
   SelectedAccountingReport: AccountingReport = AccountingReport.CreateNewInstance();
   CustomerRef: number = 0;
   pageSize = 10; // Items per page
   currentPage = 1; // Initialize current page
   total = 0;
 
   companyRef = this.companystatemanagement.SelectedCompanyRef;
 
   headers: string[] = ['Sr.No.','Date','Site Name','Ledger','Sub Ledger','Description','Recipient Name','Bill Amount','Action'];
   constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
     private companystatemanagement: CompanyStateManagement, private DateconversionService: DateconversionService,
   ) {
     effect(async () => {
       await this.getAccountingReportListByCompanyRef();
     });
   }
 
   async ngOnInit() {
     this.appStateManage.setDropdownDisabled();
     this.loadPaginationData();
     this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
   }
 
   getAccountingReportListByCompanyRef = async () => {
     this.MasterList = [];
     this.DisplayMasterList = [];
     if (this.companyRef() <= 0) {
       await this.uiUtils.showErrorToster('Company not Selected');
       return;
     }
     let lst = await AccountingReport.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
     this.MasterList = lst;
     this.DisplayMasterList = this.MasterList;
     this.loadPaginationData();
   }
 
  //  onEditClicked = async (item: AccountingReport) => {
  //    this.SelectedAccountingReport = item.GetEditableVersion();
  //    AccountingReport.SetCurrentInstance(this.SelectedAccountingReport);
  //    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
  //    await this.router.navigate(['/homepage/Website/AccountingReport_Details']);
  //  };
 
  //  onDeleteClicked = async (AccountingReport: AccountingReport) => {
  //    await this.uiUtils.showConfirmationMessage(
  //      'Delete',
  //      `This process is <strong>IRREVERSIBLE!</strong> <br/>
  //    Are you sure that you want to DELETE this AccountingReport?`,
  //      async () => {
  //        await AccountingReport.DeleteInstance(async () => {
  //          await this.uiUtils.showSuccessToster(
  //            `AccountingReport ${AccountingReport.p.RecipientName} has been deleted!`
  //          );
  //          await this.getAccountingReportListByCompanyRef();
  //          this.SearchString = '';
  //          this.loadPaginationData();
  //        });
  //      }
  //    );
  //  };
 
   // For Pagination  start ----
   loadPaginationData = () => {
     this.total = this.DisplayMasterList.length; // Update total based on loaded data
   };
 
   paginatedList = () => {
     const start = (this.currentPage - 1) * this.pageSize;
     return this.DisplayMasterList.slice(start, start + this.pageSize);
   }
 
   onPageChange = (pageIndex: number): void => {
     this.currentPage = pageIndex; // Update the current page
   };

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

 }
