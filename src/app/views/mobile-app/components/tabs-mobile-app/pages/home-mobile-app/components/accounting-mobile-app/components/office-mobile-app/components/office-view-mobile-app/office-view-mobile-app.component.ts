import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccountingReports, DomainEnums, OpeningBalanceModeOfPayments, PayerTypes } from 'src/app/classes/domain/domainenums/domainenums';
import { AccountingReport } from 'src/app/classes/domain/entities/website/accounting/accountingreport/accoiuntingreport';
import { Invoice } from 'src/app/classes/domain/entities/website/accounting/billing/invoice';
import { Expense } from 'src/app/classes/domain/entities/website/accounting/expense/expense';
import { Income } from 'src/app/classes/domain/entities/website/accounting/income/income';
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
  Printheaders: any[] = ['Sr.No.', 'Date', 'Payer Name', 'Recipient Name', 'Site Name', 'Reason', 'Income', 'Expense', 'Shree Bal.', 'Mode of Payment', 'Narration',];
  RecipientList: Invoice[] = [];
  RecipientTypesList = DomainEnums.RecipientTypesList();

  PayerList: Income[] = [];
  PayerTypesList = DomainEnums.PayerTypesList();
  DealDoneCustomer = PayerTypes.DealDoneCustomer;
  PayerPlotNo: string = '';

  // Store current selected values here to preserve selections on filter reload
  selectedFilterValues: Record<string, any> = {};


  constructor(
    private appStateManage: AppStateManageService,
    private DateconversionService: DateconversionService,
    private toastService: ToastService,
    private haptic: HapticService,
    public loadingService: LoadingService,
    private pdfService: PDFService
  ) { }

  ngOnInit = async () => {
    // await this.loadAccountingReportIfEmployeeExists();
  };

  ionViewWillEnter = async () => {
    await this.loadAccountingReportIfEmployeeExists();
    this.loadFilters();
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
        selected: this.SiteList.find(item => item.p.Ref === this.selectedFilterValues['site'])
          ? this.selectedFilterValues['site']
          : null,
      },
      {
        key: 'modeOfPayment',
        label: 'Mode of Payment',
        multi: false,
        options: this.ModeofPaymentList.map(item => ({
          Ref: item.Ref,
          Name: item.Name,
        })),
        selected: this.ModeofPaymentList.find(item => item.Ref === this.selectedFilterValues['modeOfPayment'])
          ? this.selectedFilterValues['modeOfPayment']
          : null,
      },
      {
        key: 'ledger',
        label: 'Ledger',
        multi: false,
        options: this.LedgerList.map(item => ({
          Ref: item.p.Ref,
          Name: item.p.Name,
        })),
        selected: this.LedgerList.find(item => item.p.Ref === this.selectedFilterValues['ledger'])
          ? this.selectedFilterValues['ledger']
          : null,
      },
      {
        key: 'subledger',
        label: 'Sub Ledger',
        multi: false,
        options: this.SubLedgerList.map(item => ({
          Ref: item.p.Ref,
          Name: item.p.Name,
        })),
        selected: this.SubLedgerList.find(item => item.p.Ref === this.selectedFilterValues['subledger'])
          ? this.selectedFilterValues['subledger']
          : null,
      },
      {
        key: 'payertype',
        label: 'Payer Type',
        multi: false,
        options: this.PayerTypesList.map(item => ({
          Ref: item.Ref,
          Name: item.Name,
        })),
        selected: this.PayerTypesList.find(item => item.Ref === this.selectedFilterValues['payertype'])
          ? this.selectedFilterValues['payertype']
          : null,
      },
      {
        key: 'payertypelist',
        label: 'Payer',
        multi: false,
        options: this.PayerList.map(item => ({
          Ref: item.p.Ref,
          Name: item.p.PayerName,
        })),
        selected: this.PayerList.find(item => item.p.Ref === this.selectedFilterValues['payertypelist'])
          ? this.selectedFilterValues['payertypelist']
          : null,
      },
      {
        key: 'recipienttype',
        label: 'Recipient Type',
        multi: false,
        options: this.RecipientTypesList.map(item => ({
          Ref: item.Ref,
          Name: item.Name,
        })),
        selected: this.RecipientTypesList.find(item => item.Ref === this.selectedFilterValues['recipienttype'])
          ? this.selectedFilterValues['recipienttype']
          : null,
      },
      {
        key: 'recipienttypelist',
        label: 'Recipient',
        multi: false,
        options: this.RecipientList.map(item => ({
          Ref: item.p.Ref,
          Name: item.p.RecipientName,
        })),
        selected: this.RecipientList.find(item => item.p.Ref === this.selectedFilterValues['recipienttypelist'])
          ? this.selectedFilterValues['recipienttypelist']
          : null,
      },
      {
        key: 'accountingReport',
        label: 'Accounting Report',
        multi: false,
        options: this.AccountingReportList.map(item => ({
          Ref: item.Ref,
          Name: item.Name,
        })),
        selected: this.AccountingReportList.find(item => item.Ref === this.selectedFilterValues['accountingReport'])
          ? this.selectedFilterValues['accountingReport']
          : AccountingReports.CurrentFinancialYear,
      }
    ];
  }

  async onFiltersChanged(updatedFilters: any[]) {
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

        case 'ledger':
          this.Entity.p.LedgerRef = selectedValue ?? 0;

          // Reset sub-ledger when ledger changes
          this.SubLedgerList = [];
          this.selectedFilterValues['subledger'] = null;
          this.Entity.p.SubLedgerRef = 0;

          if (selectedValue != null) {
            await this.getSubLedgerListByLedgerRef(selectedValue);
          }
          break;

        case 'subledger':
          this.Entity.p.SubLedgerRef = selectedValue ?? 0;
          break;

        case 'payertype':
          this.Entity.p.PayerType = selectedValue ?? 0;

          // Reset payer list when payer type changes
          this.PayerList = [];
          this.selectedFilterValues['payertypelist'] = null;
          this.Entity.p.PayerRef = 0;

          if (selectedValue != null) {
            await this.getPayerListBySiteAndPayerType();
          }
          break;

        case 'payertypelist':
          this.Entity.p.PayerRef = selectedValue ?? 0;
          break;

        case 'recipienttype':
          this.Entity.p.RecipientType = selectedValue ?? 0;

          // Reset recipient list when recipient type changes
          this.RecipientList = [];
          this.selectedFilterValues['recipienttypelist'] = null;
          this.Entity.p.RecipientRef = 0;

          if (selectedValue != null) {
            await this.getRecipientListByRecipientTypeRef();
          }
          break;

        case 'recipienttypelist':
          this.Entity.p.RecipientRef = selectedValue ?? 0;
          break;

        case 'accountingReport':
          this.Entity.p.AccountingReport = selectedValue ?? 0;
          break;

        case 'modeOfPayment':
          this.Entity.p.ModeOfPayment = selectedValue ?? 0;
          break;
      }
    }

    if (this.Entity.p.AccountingReport === 0) {
      this.Entity.p.AccountingReport = AccountingReports.CurrentFinancialYear;
    }

    await this.FetchEntireListByFilters();
    this.loadFilters(); // Reload filters with updated options & preserve selections
  }


  // @ViewChild('PrintContainer')
  // PrintContainer!: ElementRef;

  async handlePrintOrShare() {
    if (this.DisplayMasterList.length == 0) {
      await this.toastService.present('No Income Records Found', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    // if (!this.PrintContainer) return;
    // await this.pdfService.generatePdfAndHandleAction(this.PrintContainer.nativeElement, `Receipt_${this.Entity.p.Ref}.pdf`);
    const headers = this.Printheaders;
    const data = this.DisplayMasterList.map((m, index) => [
      index + 1,
      this.formatDate(m.p.TransDateTime),
      m.p.PayerName ? (m.p.PayerName) : '--',
      m.p.RecipientName ? (m.p.RecipientName) : '--',
      m.p.SiteName ? (m.p.SiteName) : '--',
      m.p.Reason ? (m.p.Reason) : '--',
      (m.p.IncomeAmount && m.p.IncomeAmount != 0) ? (m.p.IncomeAmount) : '--',
      (m.p.GivenAmount && m.p.GivenAmount != 0) ? (m.p.GivenAmount) : '--',
      (m.p.ShreesBalance && m.p.ShreesBalance != 0) ? (m.p.ShreesBalance) : '--',
      (m.p.ModeOfPaymentName && m.p.ModeOfPaymentName != '') ? (m.p.ModeOfPaymentName) : '--',
      (m.p.Narration && m.p.Narration != '') ? (m.p.Narration) : '--'
    ]);

    await this.pdfService.generatePdfAndHandleAction(null, 'Office-Report.pdf', { headers, data },false,'l',[6,7],'Office Report');
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
      await this.getOpeningBalanceListByCompanyRef();
      await this.getCurrentBalanceByCompanyRef();
      await this.getSiteListByCompanyRef();
      await this.FetchEntireListByFilters();
      await this.getLedgerListByCompanyRef();
      this.Entity.p.StartDate = ''
      this.Entity.p.EndDate = ''
    } catch (error) {
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
    let lst = await AccountingReport.FetchEntireListByFilters(
      this.Entity.p.StartDate,
      this.Entity.p.EndDate,
      this.Entity.p.AccountingReport,
      this.Entity.p.SiteRef,
      this.Entity.p.ModeOfPayment,
      this.companyRef,
      this.Entity.p.LedgerRef,
      this.Entity.p.SubLedgerRef,
      this.Entity.p.RecipientRef,
      this.Entity.p.PayerRef, async errMsg => {
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
    let lst = await AccountingReport.FetchEntireListByFilters(
      this.Entity.p.StartDate,
      this.Entity.p.EndDate,
      this.Entity.p.AccountingReport,
      this.Entity.p.SiteRef,
      this.Entity.p.ModeOfPayment,
      this.companyRef,
      this.Entity.p.LedgerRef,
      this.Entity.p.SubLedgerRef,
      this.Entity.p.RecipientRef,
      this.Entity.p.PayerRef, async errMsg => {
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

  onPayerChange = () => {
    try {
      let SingleRecord = this.PayerList.find((data) => data.p.PlotName == this.PayerPlotNo);
      if (SingleRecord?.p) {
        this.Entity.p.IsRegisterCustomerRef = SingleRecord.p.IsRegisterCustomerRef;
        this.Entity.p.PayerRef = SingleRecord.p.Ref;
        if (this.Entity.p.PayerType == this.DealDoneCustomer) {
          this.Entity.p.PlotName = SingleRecord.p.PlotName;
        }
      }
    } catch (error) {
    }
  }

  getPayerListBySiteAndPayerType = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    if (this.Entity.p.PayerType <= 0) {
      return;
    }
    let lst = await Income.FetchPayerNameByPayerTypeRef(this.Entity.p.SiteRef, this.companyRef, this.Entity.p.PayerType, async errMsg => {
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.PayerList = lst;
    this.loadFilters(); // Reload filters with updated options & preserve selections
  }

  getRecipientListByRecipientTypeRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    if (this.Entity.p.RecipientType <= 0) {
      await this.toastService.present('To Whom not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }

    this.RecipientList = [];
    let lst = await Invoice.FetchRecipientByRecipientTypeRef(this.companyRef, this.Entity.p.SiteRef, this.Entity.p.RecipientType, async errMsg => {
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.RecipientList = lst;
    this.loadFilters(); // Reload filters with updated options & preserve selections
  }


  getBalanceByBank = () => {
    let SingleRecord = this.OpeningBalanceList.find((data) => data.p.Ref == this.BankRef);
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
    this.SelectedAccountingReport = AccountingReport;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.SelectedAccountingReport = AccountingReport.CreateNewInstance();
  }
}
