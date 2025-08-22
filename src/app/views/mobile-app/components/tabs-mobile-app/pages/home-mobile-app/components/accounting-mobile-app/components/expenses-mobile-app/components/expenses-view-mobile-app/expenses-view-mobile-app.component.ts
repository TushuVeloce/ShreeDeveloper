import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { Expense } from 'src/app/classes/domain/entities/website/accounting/expense/expense';
import { Ledger } from 'src/app/classes/domain/entities/website/masters/ledgermaster/ledger';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { SubLedger } from 'src/app/classes/domain/entities/website/masters/subledgermaster/subledger';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { PDFService } from 'src/app/views/mobile-app/components/core/pdf.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { FilterItem } from 'src/app/views/mobile-app/components/shared/chip-filter-mobile-app/chip-filter-mobile-app.component';

@Component({
  selector: 'app-expenses-view-mobile-app',
  templateUrl: './expenses-view-mobile-app.component.html',
  styleUrls: ['./expenses-view-mobile-app.component.scss'],
  standalone: false
})
export class ExpensesViewMobileAppComponent implements OnInit {

  Entity: Expense = Expense.CreateNewInstance();
  MasterList: Expense[] = [];
  DisplayMasterList: Expense[] = [];
  SearchString: string = '';
  SelectedExpense: Expense = Expense.CreateNewInstance();
  CustomerRef: number = 0;
  printheaders: string[] = ['Sr.No.', 'Date', 'Site Name', 'Ledger', 'Sub Ledger', 'Recipient Name', 'Reason', 'Bill Amount', 'Given Amount', 'Remaining Amount', 'Shree Balance', 'Mode of Payment'];

  companyRef = 0;
  modalOpen = false;
  filters: FilterItem[] = [];
  SiteList: Site[] = [];
  ModeofPaymentList = DomainEnums.ModeOfPaymentsList();
  ReasonList: Expense[] = [];
  LedgerList: Ledger[] = [];
  SubLedgerList: SubLedger[] = [];
  AllList: Expense[] = [];
  // Store current selected values here to preserve selections on filter reload
  selectedFilterValues: Record<string, any> = {};

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
    // await this.loadExpenseIfEmployeeExists();
  };

  ionViewWillEnter = async () => {
    await this.loadExpenseIfEmployeeExists();
   this.loadFilters();
  };

  async handleRefresh(event: CustomEvent) {
    await this.loadExpenseIfEmployeeExists();
    this.loadFilters();
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
          this.Entity.p.Ref = selectedValue ?? 0;
          break;

        case 'subledger':
          this.Entity.p.SubLedgerRef = selectedValue ?? 0;
          break;

        case 'ledger':
          this.Entity.p.LedgerRef = selectedValue ?? 0;
          if (selectedValue != null) await this.getSubLedgerListByLedgerRef(selectedValue);  // Updates SubLedgerList
          break;

        case 'modeOfPayment':
          this.Entity.p.ExpenseModeOfPayment = selectedValue ?? 0;
          break;
      }
    }
    await this.FetchEntireListByFilters();
    this.loadFilters(); // Reload filters with updated options & preserve selections
  }


  private async loadExpenseIfEmployeeExists() {
    try {
      await this.loadingService.show();

      const company = this.appStateManage.localStorage.getItem('SelectedCompanyRef');
      this.companyRef = Number(company || 0);

      if (this.companyRef <= 0) {
        await this.toastService.present('Company not selected', 1000, 'warning');
        await this.haptic.warning();
        return;
      }
      await this.getExpenseListByCompanyRef();
      await this.getSiteListByCompanyRef();
      await this.getLedgerListByCompanyRef();
    } catch (error) {
      await this.toastService.present('Failed to load Expense', 1000, 'danger');
      await this.haptic.error();
    } finally {
      await this.loadingService.hide();
    }
  }

  //  FetchEntireListByFilters = async () => {
  //     this.MasterList = [];
  //     this.DisplayMasterList = [];
  //     if (this.companyRef <= 0) {
  //       await this.toastService.present('Company not selected', 1000, 'warning');
  //       await this.haptic.warning();
  //       return;
  //     }
  //     let lst = await Expense.FetchEntireListByFilters(this.Entity.p.SiteRef, this.Entity.p.LedgerRef, this.Entity.p.SubLedgerRef,this.Entity.p.ExpenseModeOfPayment, this.Entity.p.Ref, this.companyRef, async errMsg => {
  //       await this.toastService.present(errMsg, 1000, 'danger');
  //       await this.haptic.error();
  //     });
  //     this.MasterList = lst;
  //     this.DisplayMasterList = this.MasterList;
  //   }
  FetchEntireListByFilters = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      // await this.uiUtils.showErrorToster('Company not Selected');
      await this.toastService.present('Company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }

    // this.Entity.p.StartDate = this.dtu.ConvertStringDateToFullFormat(this.StartDate);
    // this.Entity.p.EndDate = this.dtu.ConvertStringDateToFullFormat(this.EndDate);
    this.Entity.p.StartDate = '';
    this.Entity.p.EndDate ='';

    let lst = await Expense.FetchEntireListByFilters(
      this.companyRef,
      this.Entity.p.StartDate,
      this.Entity.p.EndDate,
      this.Entity.p.SiteRef,
      this.Entity.p.LedgerRef,
      this.Entity.p.SubLedgerRef,
      this.Entity.p.ExpenseModeOfPayment,
      this.Entity.p.Ref,
      this.Entity.p.BankAccountRef,
      this.Entity.p.RecipientRef,
      async errMsg => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      });

    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.AllList = lst.filter((item) => item.p.Reason != '');
  }

  getSiteListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    const lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.SiteList = lst;
    this.loadFilters();
  }

  getLedgerListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'warning');
      await this.haptic.warning();
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
      await this.toastService.present('Ledger not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    const lst = await SubLedger.FetchEntireListByLedgerRef(ledgerref, async errMsg => {
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.SubLedgerList = lst;
    this.loadFilters();
  }

  getExpenseListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await Expense.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.MasterList = lst;
    this.ReasonList = lst.filter((item) => item.p.Reason != '');
    this.DisplayMasterList = this.MasterList;
  }

  onEditClicked = async (item: Expense) => {
    this.SelectedExpense = item.GetEditableVersion();
    Expense.SetCurrentInstance(this.SelectedExpense);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/mobile-app/tabs/dashboard/accounting/expenses/edit']);
  };

  async onDeleteClicked(item: Expense) {
    try {
      this.alertService.presentDynamicAlert({
        header: 'Delete',
        subHeader: 'Confirmation needed',
        message: 'Are you sure you want to delete this Expense?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'custom-cancel',
            handler: () => {
              console.log('Deletion cancelled.');
            }
          },
          {
            text: 'Yes, Delete',
            cssClass: 'custom-confirm',
            handler: async () => {
              try {
                await this.loadingService.show();
                await item.DeleteInstance(async () => {
                  await this.toastService.present(
                    `Expense ${item.p.RecipientName} has been deleted!`,
                    1000,
                    'success'
                  );
                  await this.haptic.success();
                });
              } catch (err) {
                await this.toastService.present('Failed to delete Expense', 1000, 'danger');
                await this.haptic.error();
              }
              finally {
                await this.getExpenseListByCompanyRef();
                await this.loadingService.hide();
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

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  AddExpense = () => {
    if (this.companyRef <= 0) {
      this.toastService.present('Please select company', 1000, 'warning');
      this.haptic.warning();
      return;
    }
    this.router.navigate(['/mobile-app/tabs/dashboard/accounting/expenses/add']);
  }

  // @ViewChild('PrintContainer')
  // PrintContainer!: ElementRef;

  // async handlePrintOrShare() {
  //   if (this.DisplayMasterList.length == 0) {
  //     await this.toastService.present('No Expenses Records Found', 1000, 'warning');
  //     await this.haptic.warning();
  //     return;
  //   }
  //   if (!this.PrintContainer) return;
  //   await this.pdfService.generatePdfAndHandleAction(this.PrintContainer.nativeElement, `Receipt_${this.Entity.p.Ref}.pdf`);
  // }
  async handlePrintOrShare() {
    if (this.DisplayMasterList.length == 0) {
      await this.toastService.present('No Expenses Records Found', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    // if (!this.PrintContainer) return;
    // await this.pdfService.generatePdfAndHandleAction(this.PrintContainer.nativeElement, `Receipt_${this.Entity.p.Ref}.pdf`);
    const headers = this.printheaders;
    const data = this.DisplayMasterList.map((m, index) => [
      index + 1,
      this.formatDate(m.p.Date),
      m.p.SiteName ? (m.p.SiteName) : '--',
      m.p.LedgerName ? (m.p.LedgerName) : '--',
      m.p.SubLedgerName ? (m.p.SubLedgerName) : '--',
      m.p.RecipientName ? (m.p.RecipientName) : '--',
      (m.p.Reason && m.p.Reason != '') ? (m.p.Reason) : '--',
      (m.p.InvoiceAmount && m.p.InvoiceAmount != 0) ? (m.p.InvoiceAmount) : '--',
      (m.p.GivenAmount && m.p.GivenAmount != 0) ? (m.p.GivenAmount) : '--',
      (m.p.RemainingAmount && m.p.RemainingAmount != 0) ? (m.p.RemainingAmount) : '--',
      (m.p.ShreesBalance && m.p.ShreesBalance != 0) ? (m.p.ShreesBalance) : '--',
      (m.p.ModeOfPaymentName && m.p.ModeOfPaymentName != '') ? (m.p.ModeOfPaymentName) : '--',
    ]);

    await this.pdfService.generatePdfAndHandleAction(null, 'Expenses-Report.pdf', { headers, data }, false, 'l', [7,8], 'Expenses Report');
  }
  openModal(Expense: any) {
    this.SelectedExpense = Expense;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.SelectedExpense = Expense.CreateNewInstance();
  }
}
