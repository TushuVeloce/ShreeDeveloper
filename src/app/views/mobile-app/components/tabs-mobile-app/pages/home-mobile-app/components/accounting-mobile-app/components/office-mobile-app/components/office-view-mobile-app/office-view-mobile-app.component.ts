import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccountingReports, DomainEnums, OpeningBalanceModeOfPayments } from 'src/app/classes/domain/domainenums/domainenums';
import { AccountingReport } from 'src/app/classes/domain/entities/website/accounting/accountingreport/accoiuntingreport';
import { Expense } from 'src/app/classes/domain/entities/website/accounting/expense/expense';
import { Ledger } from 'src/app/classes/domain/entities/website/masters/ledgermaster/ledger';
import { OpeningBalance } from 'src/app/classes/domain/entities/website/masters/openingbalance/openingbalance';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { SubLedger } from 'src/app/classes/domain/entities/website/masters/subledgermaster/subledger';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { Utils } from 'src/app/services/utils.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { PDFService } from 'src/app/views/mobile-app/components/core/pdf.service';
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
  SiteList: Site[] = [];
  ModeofPaymentList = DomainEnums.ModeOfPaymentsList();
  ReasonList: any[] = [];
  LedgerList: Ledger[] = [];
  SubLedgerList: SubLedger[] = [];
  Printheaders: string[] = ['Sr.No.', 'Date', 'Payer Name', 'Recipient Name', 'Site Name', 'Reason', 'Income', 'Expense', 'Shree Bal.', 'Mode of Payment', 'Narration',];


  // Store current selected values here to preserve selections on filter reload
  selectedFilterValues: Record<string, any> = {};


  constructor(
    private router: Router,
    private appStateManage: AppStateManageService,
    private companystatemanagement: CompanyStateManagement,
    private DateconversionService: DateconversionService,
    private dtu: DTU,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    public loadingService: LoadingService,
    private sanitizer: DomSanitizer,
    private baseUrl: BaseUrlService,
    private utils: Utils,
    private pdfService: PDFService
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
    this.filters = [
      {
        key: 'site',
        label: 'Site',
        multi: false,
        options: this.SiteList.map(item => ({
          Ref: item.p.Ref,
          Name: item.p.Name,
        })),
        selected: this.selectedFilterValues['site'] > 0 ? this.selectedFilterValues['site'] : null,
      },
      {
        key: 'modeOfPayment',
        label: 'Mode of Payment',
        multi: false,
        options: this.ModeofPaymentList.map(item => ({
          Ref: item.Ref,
          Name: item.Name,
        })),
        selected: this.selectedFilterValues['modeOfPayment'] > 0 ? this.selectedFilterValues['modeOfPayment'] : null,
      },
      {
        key: 'ledger',
        label: 'Ledger',
        multi: false,
        options: this.LedgerList.map(item => ({
          Ref: item.p.Ref,
          Name: item.p.Name,
        })),
        selected: this.selectedFilterValues['ledger'] > 0 ? this.selectedFilterValues['ledger'] : null,
      },
      {
        key: 'subledger',
        label: 'Sub Ledger',
        multi: false,
        options: this.SubLedgerList.map(item => ({
          Ref: item.p.Ref,
          Name: item.p.Name,
        })),
        selected: this.selectedFilterValues['subledger'] > 0 ? this.selectedFilterValues['subledger'] : null,
      },
      {
        key: 'payertype',
        label: 'Payer Type',
        multi: false,
        options: this.LedgerList.map(item => ({
          Ref: item.p.Ref,
          Name: item.p.Name,
        })),
        selected: this.selectedFilterValues['payertype'] > 0 ? this.selectedFilterValues['payertype'] : null,
      },
      {
        key: 'payertypelist',
        label: 'Payer',
        multi: false,
        options: this.SubLedgerList.map(item => ({
          Ref: item.p.Ref,
          Name: item.p.Name,
        })),
        selected: this.selectedFilterValues['payertypelist'] > 0 ? this.selectedFilterValues['payertypelist'] : null,
      },
      {
        key: 'recipienttype',
        label: 'Recipient Type',
        multi: false,
        options: this.LedgerList.map(item => ({
          Ref: item.p.Ref,
          Name: item.p.Name,
        })),
        selected: this.selectedFilterValues['recipienttype'] > 0 ? this.selectedFilterValues['recipienttype'] : null,
      },
      {
        key: 'recipienttypelist',
        label: 'Recipient',
        multi: false,
        options: this.SubLedgerList.map(item => ({
          Ref: item.p.Ref,
          Name: item.p.Name,
        })),
        selected: this.selectedFilterValues['recipienttypelist'] > 0 ? this.selectedFilterValues['recipienttypelist'] : null,
      },
      {
        key: 'accountingReport',
        label: 'Accounting Report',
        multi: false,
        options: this.AccountingReportList.map(item => ({
          Ref: item.Ref,
          Name: item.Name,
        })),
        selected: this.selectedFilterValues['accountingReport'] > 0 ? this.selectedFilterValues['accountingReport'] : 200,
      }
    ];
  }

  async onFiltersChanged(updatedFilters: any[]) {
    // debugger
    console.log('Updated Filters:', updatedFilters);

    for (const filter of updatedFilters) {
      const selected = filter.selected;
      const selectedValue = (selected === null || selected === undefined) ? null : selected;

      // Save selected value to preserve after reload
      this.selectedFilterValues[filter.key] = selectedValue ?? null;

      switch (filter.key) {
        case 'site':
          this.Entity.p.SiteRef = selectedValue ?? 0;
          break;

        case 'reason':
          this.Entity.p.Reason = selectedValue ?? 0;
          break;
          
        case 'subledger':
          this.Entity.p.SubLedgerRef = selectedValue ?? 0;
          break;

        case 'ledger':
          this.Entity.p.LedgerRef = selectedValue ?? 0;
          if (selectedValue != null) {await this.getSubLedgerListByLedgerRef(selectedValue);}else {this.SubLedgerList = []};  // Updates SubLedgerList
          break;
        
        case 'payertype':
          this.Entity.p.SubLedgerRef = selectedValue ?? 0;
          break;

        case 'payertypelist':
          this.Entity.p.LedgerRef = selectedValue ?? 0;
          if (selectedValue != null) {await this.getSubLedgerListByLedgerRef(selectedValue);} else {this.SubLedgerList = []};   // Updates SubLedgerList
          break;

        case 'recipienttype':
          this.Entity.p.SubLedgerRef = selectedValue ?? 0;
          break;

        case 'recipienttypelist':
          this.Entity.p.LedgerRef = selectedValue ?? 0;
          if (selectedValue != null) {await this.getSubLedgerListByLedgerRef(selectedValue);} else {this.SubLedgerList = []};   // Updates SubLedgerList
          break;
        case 'accountingReport':
          this.Entity.p.AccountingReport = selectedValue ?? 0;
          break;

        case 'modeOfPayment':
          this.Entity.p.ModeOfPayment = selectedValue ?? 0;
          break;
      }
    }
    if (this.Entity.p.AccountingReport===0){
      this.Entity.p.AccountingReport = AccountingReports.CurrentFinancialYear;
    }
    await this.FetchEntireListByFilters();
    this.loadFilters(); // Reload filters with updated options & preserve selections
  }

    @ViewChild('PrintContainer')
    PrintContainer!: ElementRef;
  
    async handlePrintOrShare() {
      if (this.DisplayMasterList.length == 0) {
        await this.toastService.present('No Income Records Found', 1000, 'warning');
        await this.haptic.warning();
        return;
      }
      if (!this.PrintContainer) return;
      await this.pdfService.generatePdfAndHandleAction(this.PrintContainer.nativeElement, `Receipt_${this.Entity.p.Ref}.pdf`);
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
      await this.getOpeningBalanceListByCompanyRef();
      await this.getCurrentBalanceByCompanyRef();
      await this.getSiteListByCompanyRef();
      await this.FetchEntireListByFilters();
      await this.getLedgerListByCompanyRef();
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

  FetchEntireListByFilters = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await AccountingReport.FetchEntireListByFilters(this.Entity.p.StartDate, this.Entity.p.EndDate, this.Entity.p.AccountingReport, this.Entity.p.SiteRef, this.Entity.p.ModeOfPayment, this.companyRef, async errMsg => {
      // await this.uiUtils.showErrorMessage('Error', errMsg)
      await this.toastService.present('Error' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
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
    let lst = await AccountingReport.FetchEntireListByFilters(this.Entity.p.StartDate, this.Entity.p.EndDate, this.Entity.p.AccountingReport, this.Entity.p.SiteRef, this.Entity.p.ModeOfPayment, this.companyRef, async errMsg => {
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

  getSiteListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    const lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.SiteList = lst;
    this.loadFilters();
  }

  getLedgerListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    const lst = await Ledger.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.LedgerList = lst;
    this.loadFilters();
  };

  getSubLedgerListByLedgerRef = async (ledgerref: number) => {
    console.log('ledgerref :', ledgerref);

    if (ledgerref <= 0) {
      await this.toastService.present('Ledger not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    const lst = await SubLedger.FetchEntireListByLedgerRef(ledgerref, async errMsg => {
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.SubLedgerList = lst;
    this.loadFilters();
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
