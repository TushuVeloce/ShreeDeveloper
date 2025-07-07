import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountingReport } from 'src/app/classes/domain/entities/website/accounting/accountingreport/accoiuntingreport';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { ToastService } from '../../core/toast.service';
import { HapticService } from '../../core/haptic.service';
import { AlertService } from '../../core/alert.service';
import { LoadingService } from '../../core/loading.service';
import { DomSanitizer } from '@angular/platform-browser';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-accounting-report-mobile',
  templateUrl: './accounting-report-mobile.page.html',
  styleUrls: ['./accounting-report-mobile.page.scss'],
  standalone:false
})
export class AccountingReportMobilePage implements OnInit {
Entity: AccountingReport = AccountingReport.CreateNewInstance();
   MasterList: AccountingReport[] = [];
  DisplayMasterList: AccountingReport[] = []; 
   SearchString: string = '';
   SelectedAccountingReport: AccountingReport = AccountingReport.CreateNewInstance();
   CustomerRef: number = 0;
   pageSize = 6; // Items per page
   currentPage = 1; // Initialize current page
   total = 0;

  companyRef = 0;
  modalOpen = false;

  constructor(
    private router: Router,
    private appStateManage: AppStateManageService,
    private companystatemanagement: CompanyStateManagement,
    private DateconversionService: DateconversionService,
    private dtu: DTU,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private sanitizer: DomSanitizer,
    private baseUrl: BaseUrlService,
    private utils: Utils,
  ) { }

  ngOnInit = async () => {
    await this.loadAccountingReportIfEmployeeExists();
  };

  ionViewWillEnter = async () => {
    await this.loadAccountingReportIfEmployeeExists();
  };

  async handleRefresh(event: CustomEvent) {
    await this.loadAccountingReportIfEmployeeExists();
    (event.target as HTMLIonRefresherElement).complete();
  }

  private async loadAccountingReportIfEmployeeExists() {
    try {
      await this.loadingService.show();

      const company = this.appStateManage.localStorage.getItem('SelectedCompanyRef');
      this.companyRef = Number(company || 0);

      if (this.companyRef <= 0) {
        await this.toastService.present('Company not selected', 1000, 'warning');
        await this.haptic.warning();
        return;
      }
      await this.getAccountingReportListByCompanyRef();
    } catch (error) {
      console.error('Error in loadAccountingReportIfEmployeeExists:', error);
      await this.toastService.present('Failed to load Stock Inward', 1000, 'danger');
      await this.haptic.error();
    } finally {
      await this.loadingService.hide();
    }
  }

  
     getAccountingReportListByCompanyRef = async () => {
       this.MasterList = [];
       this.DisplayMasterList = [];
       if (this.companyRef <= 0) {
        //  await this.uiUtils.showErrorToster('Company not Selected');
         await this.toastService.present('Company not selected', 1000, 'warning');
         await this.haptic.warning();
         return;
       }
       let lst = await AccountingReport.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
        // await this.uiUtils.showErrorMessage('Error', errMsg)
         await this.toastService.present('Error'+errMsg, 1000, 'warning');
        await this.haptic.error();
      });
       console.log('lst :', lst);
       this.MasterList = lst;
       this.DisplayMasterList = this.MasterList;
     }
  
     FetchEntireListByStartDateandEndDate = async () => {
       this.MasterList = [];
       this.DisplayMasterList = [];
       if (this.companyRef <= 0) {
        //  await this.uiUtils.showErrorToster('Company not Selected');
         await this.toastService.present('Company not selected', 1000, 'warning');
         await this.haptic.warning();
         return;
       }
       if(this.Entity.p.StartDate == '' && this.Entity.p.EndDate == ''){
          this.getAccountingReportListByCompanyRef()
       }
       let lst = await AccountingReport.FetchEntireListByStartDateandEndDate(this.Entity.p.StartDate, this.Entity.p.EndDate, this.companyRef, async errMsg => {
        // await this.uiUtils.showErrorMessage('Error', errMsg)
         await this.toastService.present('Error' + errMsg, 1000, 'warning');
         await this.haptic.error();
      });
       this.MasterList = lst;
       this.DisplayMasterList = this.MasterList;
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
  
    // Extracted from services date conversion //
    formatDate = (date: string | Date): string => {
      return this.DateconversionService.formatDate(date);
    }
  
  // AddAccountingReport = () => {
  //   if (this.companyRef <= 0) {
  //     //  this.uiUtils.showWarningToster('Please select company');
  //     this.toastService.present('Please select company', 1000, 'warning');
  //     this.haptic.warning();
  //     return;
  //   }
  //   this.router.navigate(['mobileapp/tabs/dashboard/accounting/AccountingReport/add']);
  // }
  openModal(AccountingReport: any) {
    // console.log('AccountingReport: any, AccountingReportItem: any :', AccountingReport, AccountingReportItem);
    this.SelectedAccountingReport = AccountingReport;
    // this.SelectedAccountingReport = AccountingReportItem;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.SelectedAccountingReport = AccountingReport.CreateNewInstance();
  }
}
