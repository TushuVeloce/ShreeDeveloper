import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccountingReports, DomainEnums, OpeningBalanceModeOfPayments } from 'src/app/classes/domain/domainenums/domainenums';
import { AccountingReport } from 'src/app/classes/domain/entities/website/accounting/accountingreport/accoiuntingreport';
import { Expense } from 'src/app/classes/domain/entities/website/accounting/expense/expense';
import { OpeningBalance } from 'src/app/classes/domain/entities/website/masters/openingbalance/openingbalance';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { Utils } from 'src/app/services/utils.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { FilterItem } from 'src/app/views/mobile-app/components/shared/chip-filter-mobile-app/chip-filter-mobile-app.component';

@Component({
  selector: 'app-office-view-mobile-app',
  templateUrl: './office-view-mobile-app.component.html',
  styleUrls: ['./office-view-mobile-app.component.scss'],
  standalone: false
})
export class OfficeViewMobileAppComponent implements OnInit {

  Entity: AccountingReport = AccountingReport.CreateNewInstance();
  MasterList: AccountingReport[] = [];
  DisplayMasterList: AccountingReport[] = [];
  OpeningBalanceList: OpeningBalance[] = [];
  AccountingReportList = DomainEnums.AccountingReportList();
  AccountingReport = AccountingReports;
  BankRef: number = 0;
  NetBalance: number = 0;
  SearchString: string = '';
  SelectedAccountingReport: AccountingReport = AccountingReport.CreateNewInstance();
  CustomerRef: number = 0;
  Cash = OpeningBalanceModeOfPayments.Cash
  filters: FilterItem[] = [];
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
    // await this.loadAccountingReportIfEmployeeExists();
  };

  ionViewWillEnter = async () => {
    await this.loadAccountingReportIfEmployeeExists();
    await this.loadFilters();
  };

  async handleRefresh(event: CustomEvent) {
    await this.loadAccountingReportIfEmployeeExists();
    (event.target as HTMLIonRefresherElement).complete();
  }

  loadFilters() {
    if (this.AccountingReportList && this.OpeningBalanceList) {
      this.filters = [
        {
          key: 'bank',
          label: 'Bank',
          multi: false,
          options: this.OpeningBalanceList.map(item => ({
            Ref: item.p.Ref,
            Name: item.p.ModeOfPayment == this.Cash ? 'Cash' : item.p.BankName,
          })),
          selected: null,
        },
        {
          key: 'mode',
          label: 'Accounting Report',
          multi: false,
          options: this.AccountingReportList.map(mode => ({
            Ref: mode.Ref,
            Name: mode.Name,
          })),
          selected: 200,
        },
      ];

    }
  }
  onFiltersChanged(updatedFilters: any[]) {
    console.log('Updated Filters:', updatedFilters);
    // this.Entity.p.AccountingReport = updatedFilters.selected;
    // this.selectedFilters = updatedFilters;

    this.Entity.p.StartDate = '';
    this.Entity.p.EndDate = '';
    this.Entity.p.AccountingReport = 0;

    for (const filter of updatedFilters) {
      const selected = filter.selected;
      if (!selected) { this.FetchEntireListByStartDateandEndDate(); this.Entity.p.AccountingReport = selected; continue } ;

      switch (filter.key) {
        case 'bank':
          this.BankRef = selected;
          this.getBalanceByBank()
          break;
        case 'mode':
          this.Entity.p.AccountingReport = selected;
          this.FetchEntireListByStartDateandEndDate()
          break;
      }
    }
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
      this.Entity.p.AccountingReport = AccountingReports.CurrentFinancialYear
      //  await this.getAccountingReportListByCompanyRef();
      await this.FetchEntireListByStartDateandEndDate();
      await this.getOpeningBalanceListByCompanyRef();
      await this.getCurrentBalanceByCompanyRef()
      this.Entity.p.StartDate = ''
      this.Entity.p.EndDate = ''
    } catch (error) {
      // console.error('Error in loadAccountingReportIfEmployeeExists:', error);
      await this.toastService.present('Failed to load Office', 1000, 'danger');
      await this.haptic.error();
    } finally {
      await this.loadingService.hide();
    }
  }

  getAccountingReportListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await AccountingReport.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present('Error' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
  }

  FetchEntireListByStartDateandEndDate = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await AccountingReport.FetchEntireListByStartDateandEndDate(this.Entity.p.StartDate, this.Entity.p.EndDate, this.Entity.p.AccountingReport,this.Entity.p.SiteRef,this.Entity.p.ModeOfPaymentName, this.companyRef, async errMsg => {
      await this.toastService.present('Error' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
  }

  getOpeningBalanceListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await OpeningBalance.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present('Error' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.OpeningBalanceList = lst;
    if (this.OpeningBalanceList.length > 0) {
      this.BankRef = this.OpeningBalanceList[0].p.Ref;
      this.getBalanceByBank();
    }
  }

  getBalanceByBank = () => {
    let SingleRecord = this.OpeningBalanceList.find((data) => data.p.Ref == this.BankRef);
    console.log('SingleRecord :', SingleRecord);
    if (SingleRecord) {
      this.NetBalance = SingleRecord?.p.NetBalance;
    }
  }

  get totalTotalIncome(): number {
    return this.DisplayMasterList.reduce((sum, item) => sum + (item.p.IncomeAmount || 0), 0);
  }

  get totalTotalExpense(): number {
    return this.DisplayMasterList.reduce((sum, item) => sum + (item.p.GivenAmount || 0), 0);
  }

  getCurrentBalanceByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await Expense.FetchCurrentBalanceByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present('Error' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    if (lst.length > 0) {
      this.Entity.p.ShreesBalance = lst[0].p.ShreesBalance;
    }
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
