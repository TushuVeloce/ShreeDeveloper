import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Income } from 'src/app/classes/domain/entities/website/accounting/income/income';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { PDFService } from 'src/app/views/mobile-app/components/core/pdf.service';
import { FilterItem } from 'src/app/views/mobile-app/components/shared/chip-filter-mobile-app/chip-filter-mobile-app.component';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { DomainEnums, ModeOfPayments, OpeningBalanceModeOfPayments, PayerTypes } from 'src/app/classes/domain/domainenums/domainenums';
import { Ledger } from 'src/app/classes/domain/entities/website/masters/ledgermaster/ledger';
import { SubLedger } from 'src/app/classes/domain/entities/website/masters/subledgermaster/subledger';
import { OpeningBalance } from 'src/app/classes/domain/entities/website/masters/openingbalance/openingbalance';

@Component({
  selector: 'app-income-view-mobile-app',
  templateUrl: './income-view-mobile-app.component.html',
  styleUrls: ['./income-view-mobile-app.component.scss'],
  standalone: false
})
export class IncomeViewMobileAppComponent implements OnInit {

  Entity: Income = Income.CreateNewInstance();
  MasterList: Income[] = [];
  DisplayMasterList: Income[] = [];
  SearchString: string = '';
  SelectedIncome: Income = Income.CreateNewInstance();
  CustomerRef: number = 0;

  companyRef = 0;
  modalOpen = false;
  printheaders: string[] = ['Sr.No.', 'Date', 'Site Name', 'Ledger', 'Sub Ledger', 'Received By', 'Reason', 'Income Amount', 'Shree Balance', 'Mode of Payment'];

  filters: FilterItem[] = [];
  SiteList: Site[] = [];
  ReasonList: Income[] = [];
  LedgerList: Ledger[] = [];
  SubLedgerList: SubLedger[] = [];
  AllList: Income[] = [];

  // Store current selected values here to preserve selections on filter reload
  selectedFilterValues: Record<string, any> = {};
  Cash = OpeningBalanceModeOfPayments.Cash
  BankList: OpeningBalance[] = [];
  Bill = ModeOfPayments.Bill;
  ModeofPaymentList = DomainEnums.ModeOfPaymentsList().filter(item => item.Ref != this.Bill);
  ModeOfPayments = ModeOfPayments

  PayerList: Income[] = [];
  PayerTypesList = DomainEnums.PayerTypesList();
  DealDoneCustomer = PayerTypes.DealDoneCustomer;
  PayerPlotNo: string = '';


  constructor(
    private router: Router,
    private appStateManage: AppStateManageService,
    private DateconversionService: DateconversionService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    public loadingService: LoadingService,
    private pdfService: PDFService
  ) { }

  ngOnInit = async () => {
    // await this.loadIncomeIfEmployeeExists();
  };

  async handlePrintOrShare() {
    if (this.DisplayMasterList.length == 0) {
      await this.toastService.present('No Income Records Found', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    const headers = this.printheaders;
    const data = this.DisplayMasterList.map((m, index) => [
      index + 1,
      this.formatDate(m.p.Date),
      m.p.SiteName ? (m.p.SiteName) : '--',
      m.p.LedgerName ? (m.p.LedgerName) : '--',
      m.p.SubLedgerName ? (m.p.SubLedgerName) : '--',
      m.p.PayerName ? (m.p.PayerName) : '--',
      (m.p.Reason && m.p.Reason != '') ? (m.p.Reason) : '--',
      (m.p.IncomeAmount && m.p.IncomeAmount != 0) ? (m.p.IncomeAmount) : '--',
      (m.p.ShreesBalance && m.p.ShreesBalance != 0) ? (m.p.ShreesBalance) : '--',
      (m.p.ModeOfPaymentName && m.p.ModeOfPaymentName != '') ? (m.p.ModeOfPaymentName) : '--',
    ]);

    await this.pdfService.generatePdfAndHandleAction(null, 'Income-Report.pdf', { headers, data }, false, 'l', [7], 'Income Report');
  }

  ionViewWillEnter = async () => {
    await this.loadIncomeIfEmployeeExists();
    this.loadFilters()
  };

  async handleRefresh(event: CustomEvent) {
    await this.loadIncomeIfEmployeeExists();
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
        key: 'payerType',
        label: 'From Whom Type',
        multi: false,
        options: this.PayerTypesList,
        selected: this.selectedFilterValues['payerType'] > 0 ? this.selectedFilterValues['payerType'] : null,
      },
      {
        key: 'payer',
        label: 'Received By',
        multi: false,
        options: this.PayerList.map(item => ({
          Ref: this.Entity.p.PayerType === this.DealDoneCustomer ? item.p.PlotName : item.p.Ref,
          Name: this.Entity.p.PayerType === this.DealDoneCustomer
            ? `${item.p.PayerName} - ${item.p.PlotName}`
            : item.p.PayerName,
        })),
        selected: this.Entity.p.PayerType === this.DealDoneCustomer
          ? (this.PayerPlotNo || null) // keep PlotName
          : (this.selectedFilterValues['payer'] > 0 ? this.selectedFilterValues['payer'] : null),
      },
      {
        key: 'reason',
        label: 'Reason',
        multi: false,
        options: this.ReasonList.map(item => ({
          Ref: item.p.Ref,
          Name: item.p.Reason,
        })),
        selected: this.selectedFilterValues['reason'] > 0 ? this.selectedFilterValues['reason'] : null,
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
    ];

    // Bank filter only when modeOfPayment = Cheque / RTGS / GPayPhonePay
    if (
      this.selectedFilterValues['modeOfPayment'] &&
      (this.selectedFilterValues['modeOfPayment'] === this.ModeOfPayments.Cheque ||
        this.selectedFilterValues['modeOfPayment'] === this.ModeOfPayments.RTGS ||
        this.selectedFilterValues['modeOfPayment'] === this.ModeOfPayments.GpayPhonePay)
    ) {
      this.filters.push({
        key: 'bank',
        label: 'Bank',
        multi: false,
        options: this.BankList.map(item => ({
          Ref: item.p.BankAccountRef,
          Name: item.p.BankName,
        })),
        selected: this.selectedFilterValues['bank'] > 0 ? this.selectedFilterValues['bank'] : null,
      });
    }
  }

  async onFiltersChanged(updatedFilters: any[]) {
    for (const filter of updatedFilters) {
      const selected = filter.selected;
      const selectedValue = (selected === null || selected === undefined) ? null : selected;
      this.selectedFilterValues[filter.key] = selectedValue ?? null;

      switch (filter.key) {
        case 'site':
          this.Entity.p.SiteRef = selectedValue ?? 0;
          break;

        case 'ledger':
          this.Entity.p.LedgerRef = selectedValue ?? 0;
          if (selectedValue != null) await this.getSubLedgerListByLedgerRef(selectedValue);
          break;

        case 'subledger':
          this.Entity.p.SubLedgerRef = selectedValue ?? 0;
          break;

        // case 'payerType':
        //   this.Entity.p.PayerType = selectedValue ?? 0;
        //   this.Entity.p.PayerRef = 0;
        //   this.PayerPlotNo = '';
        //   this.selectedFilterValues['payer'] = null; // reset payer properly
        //   if (selectedValue != null) await this.getPayerListBySiteAndPayerType();
        //   break;

        case 'payerType':
          this.Entity.p.PayerType = selectedValue ?? 0;
          this.Entity.p.PayerRef = 0;
          this.PayerPlotNo = '';
          this.selectedFilterValues['payer'] = null; // reset payer filter
          await this.getPayerListBySiteAndPayerType();
          this.loadFilters(); // refresh filters immediately so UI clears payer
          break;
        case 'payer':
          if (this.Entity.p.PayerType === this.DealDoneCustomer) {
            // store plot no instead of Ref
            this.PayerPlotNo = selectedValue || '';
            this.onPayerChange(); // maps PlotNo -> PayerRef
          } else {
            this.Entity.p.PayerRef = selectedValue ?? 0;
            this.onPayerChange();
          }
          break;

        case 'reason':
          this.Entity.p.Ref = selectedValue ?? 0; // ✅ FIXED
          break;

        case 'modeOfPayment':
          this.Entity.p.IncomeModeOfPayment = selectedValue ?? 0;
          this.Entity.p.BankAccountRef = 0;
          if (selectedValue != null && this.Entity.p.IncomeModeOfPayment !== this.ModeOfPayments.Cash) {
            await this.FormulateBankList();
          }
          break;

        case 'bank':
          this.Entity.p.BankAccountRef = selectedValue ?? 0;
          break;
      }
    }

    await this.FetchEntireListByFilters();
    this.loadFilters(); // refresh filters with new data
  }



  private async loadIncomeIfEmployeeExists() {
    try {
      await this.loadingService.show();

      const company = this.appStateManage.localStorage.getItem('SelectedCompanyRef');
      this.companyRef = Number(company || 0);

      if (this.companyRef <= 0) {
        await this.toastService.present('Company not selected', 1000, 'danger');
        await this.haptic.error();
        return;
      }
      await this.getIncomeListByCompanyRef();
      await this.getSiteListByCompanyRef();
      await this.getLedgerListByCompanyRef();
    } catch (error) {
      await this.toastService.present('Failed to load Stock Inward', 1000, 'danger');
      await this.haptic.error();
    } finally {
      await this.loadingService.hide();
    }
  }

  // FetchEntireListByFilters = async () => {
  //   this.MasterList = [];
  //   this.DisplayMasterList = [];
  //   if (this.companyRef <= 0) {
  //     await this.toastService.present('Company not selected', 1000, 'danger');
  //     await this.haptic.error();
  //     return;
  //   }
  //   let lst = await Income.FetchEntireListByFilters(
  //     this.companyRef,
  //     this.Entity.p.StartDate,
  //     this.Entity.p.EndDate,
  //     this.Entity.p.SiteRef,
  //     this.Entity.p.LedgerRef,
  //     this.Entity.p.SubLedgerRef,
  //     this.Entity.p.ExpenseModeOfPayment,
  //     this.Entity.p.BankAccountRef,
  //     this.Entity.p.PayerRef, async errMsg => {
  //       await this.toastService.present('Error ' + errMsg, 1000, 'danger');
  //       await this.haptic.error();
  //     });
  //   this.MasterList = lst;
  //   this.DisplayMasterList = this.MasterList;
  // }
  FetchEntireListByFilters = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }

    this.Entity.p.StartDate = '';
    this.Entity.p.EndDate = '';

    let lst = await Income.FetchEntireListByFilters(
      this.companyRef,
      this.Entity.p.StartDate,
      this.Entity.p.EndDate,
      this.Entity.p.SiteRef,
      this.Entity.p.LedgerRef,
      this.Entity.p.SubLedgerRef,
      this.Entity.p.IncomeModeOfPayment,
      this.Entity.p.BankAccountRef,
      this.Entity.p.PayerType,
      this.Entity.p.PayerRef,
      this.Entity.p.PlotRef,
      async errMsg => {
        await this.toastService.present('Error ' + errMsg, 1000, 'danger');
        await this.haptic.error();
      });
    this.AllList = lst.filter((item) => item.p.Reason != '');
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
  }

  onPayerChange = () => {
    let SingleRecord;
    try {
      if (this.Entity.p.PayerType == this.DealDoneCustomer) {
        SingleRecord = this.PayerList.find((data) => data.p.PlotName == this.PayerPlotNo);
      } else {
        SingleRecord = this.PayerList.find((data) => data.p.Ref == this.Entity.p.PayerRef);
      }
      if (SingleRecord?.p) {
        this.Entity.p.IsRegisterCustomerRef = SingleRecord.p.IsRegisterCustomerRef;
        this.Entity.p.PayerRef = SingleRecord.p.Ref;
        if (this.Entity.p.PayerType == this.DealDoneCustomer) {
          this.Entity.p.PlotName = SingleRecord.p.PlotName;
          this.Entity.p.PlotRef = SingleRecord.p.PlotRef;
        }
      }
      this.FetchEntireListByFilters();
    } catch (error) {
    }
  }

  public FormulateBankList = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    let lst = await OpeningBalance.FetchEntireListByCompanyRef(this.companyRef, async (errMsg) => {
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.BankList = lst.filter((item) => item.p.BankAccountRef > 0 && (item.p.OpeningBalanceAmount > 0 || item.p.InitialBalance > 0));
  };
  getPayerListBySiteAndPayerType = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'danger');
      await this.haptic.error();
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
    this.loadFilters();
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


  getIncomeListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await Income.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.ReasonList = lst.filter((item) => item.p.Reason != '');
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  onEditClicked = async (item: Income) => {
    this.SelectedIncome = item.GetEditableVersion();
    Income.SetCurrentInstance(this.SelectedIncome);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/mobile-app/tabs/dashboard/accounting/income/edit']);
  };

  async onDeleteClicked(item: Income) {
    try {
      this.alertService.presentDynamicAlert({
        header: 'Delete',
        subHeader: 'Confirmation needed',
        message: 'Are you sure you want to delete this Income?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'custom-cancel',
            handler: () => {
            }
          },
          {
            text: 'Yes, Delete',
            cssClass: 'custom-confirm',
            handler: async () => {
              try {
                await item.DeleteInstance(async () => {
                  await this.toastService.present(
                    `Income ${item.p.SubLedgerRef} has been deleted!`,
                    1000,
                    'success'
                  );
                  await this.haptic.success();
                });
                await this.getIncomeListByCompanyRef();
              } catch (err) {
                await this.toastService.present('Failed to delete Income', 1000, 'danger');
                await this.haptic.error();
              }
            }
          }
        ]
      });
    } catch (error) {
      await this.toastService.present('Something went wrong', 1000, 'danger');
      await this.haptic.error();
    }
  }

  AddIncome = () => {
    if (this.companyRef <= 0) {
      this.toastService.present('Please select company', 1000, 'warning');
      this.haptic.warning();
      return;
    }
    this.router.navigate(['/mobile-app/tabs/dashboard/accounting/income/add']);
  }

  openModal(Income: any) {
    this.SelectedIncome = Income;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.SelectedIncome = Income.CreateNewInstance();
  }
}
