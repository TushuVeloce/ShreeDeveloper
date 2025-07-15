import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Invoice } from 'src/app/classes/domain/entities/website/accounting/billing/invoice';
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

@Component({
  selector: 'app-invoice-view-mobile-app',
  templateUrl: './invoice-view-mobile-app.component.html',
  styleUrls: ['./invoice-view-mobile-app.component.scss'],
  standalone:false
})
export class InvoiceViewMobileAppComponent  implements OnInit {
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

  filters = [
      {
        key: 'category',
        label: 'Category',
        multi: true,
        options: [
          { Ref: 1, Name: 'Electronics' },
          { Ref: 2, Name: 'Clothing' },
          { Ref: 3, Name: 'Books' },
        ],
        selected: [],
      },
      {
        key: 'price',
        label: 'Price',
        multi: false,
        options: [
          { Ref: 'low', Name: 'Low to High' },
          { Ref: 'high', Name: 'High to Low' },
        ],
        selected: null,
      },
    ];
  
    onFiltersChanged(updatedFilters: any[]) {
      console.log('Updated Filters:', updatedFilters);
      // Make API call or update list
    }
  
    
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
      await this.toastService.present('Failed to load Billing', 1000, 'danger');
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
    await this.router.navigate(['/mobile-app/tabs/dashboard/accounting/invoice/edit']);
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
              } catch (err) {
                // console.error('Error deleting In voice:', err);
                // await this.toastService.present('Failed to delete Bill', 1000, 'danger');
                // await this.haptic.error();
              }finally{
                await this.loadingService.hide();
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
    this.router.navigate(['/mobile-app/tabs/dashboard/accounting/invoice/print'], {
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
    this.router.navigate(['mobile-app/tabs/dashboard/accounting/invoice/add']);
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
