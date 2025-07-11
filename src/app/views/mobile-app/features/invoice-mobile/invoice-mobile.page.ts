import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Invoice } from 'src/app/classes/domain/entities/website/accounting/billing/invoice';
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
  selector: 'app-invoice-mobile',
  templateUrl: './invoice-mobile.page.html',
  styleUrls: ['./invoice-mobile.page.scss'],
  standalone: false
})
export class InvoiceMobilePage implements OnInit {

  Entity: Invoice = Invoice.CreateNewInstance();
  MasterList: Invoice[] = [];
  DisplayMasterList: Invoice[] = [];
  SearchString: string = '';
  SelectedInvoice: Invoice = Invoice.CreateNewInstance();
  CustomerRef: number = 0;

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
    await this.loadInvoiceIfEmployeeExists();
  };

  ionViewWillEnter = async () => {
    await this.loadInvoiceIfEmployeeExists();
  };

  async handleRefresh(event: CustomEvent) {
    await this.loadInvoiceIfEmployeeExists();
    (event.target as HTMLIonRefresherElement).complete();
  }

  private async loadInvoiceIfEmployeeExists() {
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
    } catch (error) {
      console.error('Error in loadInvoiceIfEmployeeExists:', error);
      await this.toastService.present('Failed to load Stock Inward', 1000, 'danger');
      await this.haptic.error();
    } finally {
      await this.loadingService.hide();
    }
  }

  getInvoiceListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      // await this.uiUtils.showErrorToster('Company not Selected');
      await this.toastService.present('Company not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await Invoice.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      // await this.uiUtils.showErrorMessage('Error', errMsg)
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
  }

  onEditClicked = async (item: Invoice) => {
    this.SelectedInvoice = item.GetEditableVersion();
    Invoice.SetCurrentInstance(this.SelectedInvoice);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/mobileapp/tabs/dashboard/accounting/invoice/edit']);
  };

  async onDeleteClicked(item: Invoice) {
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
                await item.DeleteInstance(async () => {
                  await this.toastService.present(
                    `Bill ${item.p.RecipientName} has been deleted!`,
                    1000,
                    'success'
                  );
                  await this.haptic.success();
                });
                await this.getInvoiceListByCompanyRef();
              } catch (err) {
                console.error('Error deleting Invoice:', err);
                await this.toastService.present('Failed to delete Bill', 1000, 'danger');
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


  navigateToPrint = async (item: Invoice) => {
    this.router.navigate(['/mobileapp/tabs/dashboard/accounting/invoice/print'], {
      state: { printData: item.GetEditableVersion() }
    });
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  AddInvoice = () => {
    if (this.companyRef <= 0) {
      //  this.uiUtils.showWarningToster('Please select company');
      this.toastService.present('Please select company', 1000, 'warning');
      this.haptic.warning();
      return;
    }
    this.router.navigate(['mobileapp/tabs/dashboard/accounting/invoice/add']);
  }
  openModal(Invoice: any) {
    // console.log('Invoice: any, InvoiceItem: any :', Invoice, InvoiceItem);
    this.SelectedInvoice = Invoice;
    // this.SelectedInvoice = InvoiceItem;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.SelectedInvoice = Invoice.CreateNewInstance();
  }
}
