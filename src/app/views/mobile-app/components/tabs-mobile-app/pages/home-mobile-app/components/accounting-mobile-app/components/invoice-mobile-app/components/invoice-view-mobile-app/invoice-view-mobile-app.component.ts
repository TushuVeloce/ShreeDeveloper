import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { Invoice } from 'src/app/classes/domain/entities/website/accounting/billing/invoice';
import { Ledger } from 'src/app/classes/domain/entities/website/masters/ledgermaster/ledger';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { SubLedger } from 'src/app/classes/domain/entities/website/masters/subledgermaster/subledger';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { FilterItem } from 'src/app/views/mobile-app/components/shared/chip-filter-mobile-app/chip-filter-mobile-app.component';

@Component({
  selector: 'app-invoice-view-mobile-app',
  templateUrl: './invoice-view-mobile-app.component.html',
  styleUrls: ['./invoice-view-mobile-app.component.scss'],
  standalone: false
})
export class InvoiceViewMobileAppComponent implements OnInit {
  Entity: Invoice = Invoice.CreateNewInstance();
  MasterList: Invoice[] = [];
  DisplayMasterList: Invoice[] = [];
  SearchString: string = '';
  SelectedInvoice: Invoice = Invoice.CreateNewInstance();
  CustomerRef: number = 0;
  companyRef = 0;
  modalOpen = false;
  filters: FilterItem[] = [];
  SiteList: Site[] = [];
  ModeofPaymentList = DomainEnums.ModeOfPaymentsList();
  ReasonList: Invoice[] = [];
  LedgerList: Ledger[] = [];
  SubLedgerList: SubLedger[] = [];
  MachineTableHeaderData = ['Machine Start Time', 'Machine End Time', 'Machine Worked Hours'];
  LabourTableHeaderData = ['Labour Type', 'Days', 'Labour Rate', 'Labour Amount'];
  MaterialTableHeaderData: string[] = ['Material', 'Unit', 'Order Quantity', 'Rate', 'Discount Rate', 'GST', 'Delivery Charges', 'Total Amount'];


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
  ) { }

  ngOnInit = async () => {
    // await this.loadInvoiceIfEmployeeExists();
  };

  ionViewWillEnter = async () => {
    await this.loadInvoiceIfEmployeeExists();
    this.loadFilters();
  };

  loadFilters = () => {
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
      // {
      //   key: 'modeOfPayment',
      //   label: 'Mode of Payment',
      //   multi: false,
      //   options: this.ModeofPaymentList.map(item => ({
      //     Ref: item.Ref,
      //     Name: item.Name,
      //   })),
      //   selected: this.selectedFilterValues['modeOfPayment'] > 0 ? this.selectedFilterValues['modeOfPayment'] : null,
      // }
    ];
  }


  onFiltersChanged = async (updatedFilters: any[]) => {

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
          this.Entity.p.InvoiceModeOfPayment = selectedValue ?? 0;
          break;
      }
    }
    await this.FetchEntireListByFilters();
    this.loadFilters(); // Reload filters with updated options & preserve selections
  }

  handleRefresh = async (event: CustomEvent) => {
    await this.loadInvoiceIfEmployeeExists();
    (event.target as HTMLIonRefresherElement).complete();
  }

  convertTo12HourFormat = (time: string): string => {
    const [hourStr, minuteStr] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour === 0 ? 12 : hour;

    return `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  }

  private loadInvoiceIfEmployeeExists = async () => {
    try {
      await this.loadingService.show();

      const company = this.appStateManage.localStorage.getItem('SelectedCompanyRef');
      this.companyRef = Number(company || 0);

      if (this.companyRef <= 0) {
        await this.toastService.present('Company not selected', 1000, 'danger');
        await this.haptic.error();
        return;
      }
      await this.getInvoiceListByCompanyRef();
      await this.getSiteListByCompanyRef();
      await this.getLedgerListByCompanyRef();

      this.loadFilters();
    } catch (error) {
      console.error('Error in loadInvoiceIfEmployeeExists:', error);
      await this.toastService.present('Failed to load Billing', 1000, 'danger');
      await this.haptic.error();
    } finally {
      await this.loadingService.hide();
    }
  }

  FetchEntireListByFilters = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    let lst = await Invoice.FetchEntireListByFilters(
      this.Entity.p.StartDate,
      this.Entity.p.EndDate,
      this.Entity.p.SiteRef,
      this.Entity.p.LedgerRef,
      this.Entity.p.SubLedgerRef,
      this.Entity.p.RecipientRef,
      this.Entity.p.Ref,
      this.companyRef,
      async errMsg => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      });
    console.log('lst :', lst);
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
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

  getInvoiceListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    const lst = await Invoice.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.MasterList = lst;
    this.ReasonList = lst.filter((item) => item.p.Reason != '');
    this.DisplayMasterList = this.MasterList;
  }

  onEditClicked = async (item: Invoice) => {
    this.SelectedInvoice = item.GetEditableVersion();
    Invoice.SetCurrentInstance(this.SelectedInvoice);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/mobile-app/tabs/dashboard/accounting/invoice/edit']);
  };

  onDeleteClicked = async (item: Invoice) => {
    try {
      this.alertService.presentDynamicAlert({
        header: 'Delete',
        subHeader: 'Confirmation needed',
        message: 'Are you sure you want to delete this Bill?',
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
                    `Bill ${item.p.RecipientName} has been deleted!`,
                    1000,
                    'success'
                  );
                  await this.haptic.success();
                });
                await this.getInvoiceListByCompanyRef();
              } finally {
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

  navigateToPrint = async (item: Invoice) => {
    this.router.navigate(['/mobile-app/tabs/dashboard/accounting/invoice/print'], {
      state: { printData: item.GetEditableVersion() }
    });
  }

  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  AddInvoice = () => {
    if (this.companyRef <= 0) {
      this.toastService.present('Please select company', 1000, 'warning');
      this.haptic.warning();
      return;
    }
    this.router.navigate(['mobile-app/tabs/dashboard/accounting/invoice/add']);
  }

  openModal = (Invoice: any) => {
    this.SelectedInvoice = Invoice;
    console.log('this.SelectedInvoice :', this.SelectedInvoice);
    this.modalOpen = true;
  }

  closeModal = () => {
    this.modalOpen = false;
    this.SelectedInvoice = Invoice.CreateNewInstance();
  }
}
