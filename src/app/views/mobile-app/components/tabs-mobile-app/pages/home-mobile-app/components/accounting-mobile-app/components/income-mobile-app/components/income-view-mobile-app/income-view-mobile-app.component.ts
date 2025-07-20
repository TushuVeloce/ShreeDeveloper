import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Share } from '@capacitor/share';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Income } from 'src/app/classes/domain/entities/website/accounting/income/income';
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
import { PDFService } from 'src/app/views/mobile-app/components/core/pdf.service';
import { FilterItem } from 'src/app/views/mobile-app/components/shared/chip-filter-mobile-app/chip-filter-mobile-app.component';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { Ledger } from 'src/app/classes/domain/entities/website/masters/ledgermaster/ledger';
import { SubLedger } from 'src/app/classes/domain/entities/website/masters/subledgermaster/subledger';

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
  printheaders: string[] = ['Sr.No.', 'Date', 'Site Name', 'Ledger', 'Sub Ledger', 'Reason', 'Income Amount', 'Shree Balance', 'Mode of Payment'];

  filters: FilterItem[] = [];
  SiteList: Site[] = [];
  ModeofPaymentList = DomainEnums.ModeOfPaymentsList();
  ReasonList: Income[] = [];
  LedgerList: Ledger[] = [];
  SubLedgerList: SubLedger[] = [];

  // Store current selected values here to preserve selections on filter reload
  selectedFilterValues: Record<string, any> = {};


  constructor(
    private router: Router,
    private appStateManage: AppStateManageService,
    private companystatemanagement: CompanyStateManagement,
    private DateconversionService: DateconversionService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private pdfService: PDFService
  ) { }

  ngOnInit = async () => {
    // await this.loadIncomeIfEmployeeExists();
  };

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
          this.Entity.p.IncomeModeOfPayment = selectedValue ?? 0;
          break;
      }
    }
    await this.FetchEntireListByFilters();
    this.loadFilters(); // Reload filters with updated options & preserve selections
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
      console.error('Error in loadIncomeIfEmployeeExists:', error);
      await this.toastService.present('Failed to load Stock Inward', 1000, 'danger');
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
    let lst = await Income.FetchEntireListByFilters(this.Entity.p.SiteRef, this.Entity.p.LedgerRef, this.Entity.p.SubLedgerRef, this.Entity.p.IncomeModeOfPayment, this.Entity.p.Ref, this.companyRef, async errMsg => {
      // await this.uiUtils.showErrorMessage('Error', errMsg)
       await this.toastService.present('Error ' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
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


  getIncomeListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      // await this.uiUtils.showErrorToster('Company not Selected');
      await this.toastService.present('Company not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await Income.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      // await this.uiUtils.showErrorMessage('Error', errMsg)
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    console.log('lst :', lst);
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
              console.log('Deletion cancelled.');
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
                console.error('Error deleting Income:', err);
                await this.toastService.present('Failed to delete Income', 1000, 'danger');
                await this.haptic.error();
              }
            }
          }
        ]
      });
    } catch (error) {
      console.error('Error showing delete confirmation:', error);
      await this.toastService.present('Something went wrong', 1000, 'danger');
      await this.haptic.error();
    }
  }

  AddIncome = () => {
    if (this.companyRef <= 0) {
      //  this.uiUtils.showWarningToster('Please select company');
      this.toastService.present('Please select company', 1000, 'warning');
      this.haptic.warning();
      return;
    }
    this.router.navigate(['/mobile-app/tabs/dashboard/accounting/income/add']);
  }

  openModal(Income: any) {
    // console.log('Income: any, IncomeItem: any :', Income, IncomeItem);
    this.SelectedIncome = Income;
    // this.SelectedIncome = IncomeItem;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.SelectedIncome = Income.CreateNewInstance();
  }
}
