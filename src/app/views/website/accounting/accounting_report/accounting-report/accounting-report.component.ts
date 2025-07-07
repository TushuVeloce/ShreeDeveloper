import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountingReports, DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
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
   AccountingReportList = DomainEnums.AccountingReportList();
   AccountingReport = AccountingReports;
   SearchString: string = '';
   SelectedAccountingReport: AccountingReport = AccountingReport.CreateNewInstance();
   CustomerRef: number = 0;
   pageSize = 6; // Items per page
   currentPage = 1; // Initialize current page
   total = 0;
   
   companyRef = this.companystatemanagement.SelectedCompanyRef;
 
   headers: string[] = ['Sr.No.','Date','Payer Name','Recipient Name','Site Name','Reason','Income','Expense','Shree Bal.','Mode of Payment','Narration',];
   constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
     private companystatemanagement: CompanyStateManagement, private DateconversionService: DateconversionService,
   ) {
     effect(async () => {
       this.Entity.p.AccountingReport = AccountingReports.CurrentFinancialYear
      //  await this.getAccountingReportListByCompanyRef();
       await this.FetchEntireListByStartDateandEndDate();
       this.Entity.p.StartDate = ''
       this.Entity.p.EndDate = ''
     });
   }
   
   async ngOnInit() {
     this.appStateManage.setDropdownDisabled();
     this.loadPaginationData();
     const pageSize = this.screenSizeService.getPageSize('withDropdown');
     console.log('AccountingReportList :', this.AccountingReportList);
    this.pageSize = pageSize - 1
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

   FetchEntireListByStartDateandEndDate = async () => {
     this.MasterList = [];
     this.DisplayMasterList = [];
     if (this.companyRef() <= 0) {
       await this.uiUtils.showErrorToster('Company not Selected');
       return;
     }
     console.log('this.Entity.p.AccountingReport, :', this.Entity.p.AccountingReport,);
    //  if(this.Entity.p.AccountingReport == AccountingReports.All){
    //  this.getAccountingReportListByCompanyRef()
    //  return
    //  }
     let lst = await AccountingReport.FetchEntireListByStartDateandEndDate(this.Entity.p.StartDate, this.Entity.p.EndDate, this.Entity.p.AccountingReport, this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
     this.MasterList = lst;
     this.DisplayMasterList = this.MasterList;
     this.loadPaginationData();
   }

printReport(): void {
  const printContents = document.getElementById('print-section')?.innerHTML;
  if (printContents) {
    const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin?.document.write(`
      <html>
        <head>
          <title>Office Report</title>
         <style>
         * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-family: sans-serif;
           }
            table {
              border-collapse: collapse;
              width: 100%;
            }

            th, td {
              border: 1px solid  rgb(169, 167, 167);
              text-align: center;
              padding: 15px;
            }
          </style>
        </head>
        <body onload="window.print();window.close()">
          ${printContents}
        </body>
      </html>
    `);
    popupWin?.document.close();
  }
}
 
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
