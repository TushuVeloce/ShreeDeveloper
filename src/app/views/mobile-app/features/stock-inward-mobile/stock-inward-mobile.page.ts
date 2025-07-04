import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { StockInward } from 'src/app/classes/domain/entities/website/stock_management/stock_inward/stockinward';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { ToastService } from '../../core/toast.service';
import { HapticService } from '../../core/haptic.service';
import { AlertService } from '../../core/alert.service';
import { LoadingService } from '../../core/loading.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-stock-inward-mobile',
  templateUrl: './stock-inward-mobile.page.html',
  styleUrls: ['./stock-inward-mobile.page.scss'],
  standalone: false,
})
export class StockInwardMobilePage implements OnInit {
  Entity: StockInward = StockInward.CreateNewInstance();
  MasterList: StockInward[] = [];
  DisplayMasterList: StockInward[] = [];
  SiteList: Site[] = [];
  SelectedStockInward: StockInward = StockInward.CreateNewInstance();

  companyRef = 0;
  modalOpen = false;
  showInvoicePreview = false;
  sanitizedInvoiceUrl: SafeResourceUrl | null = null;

  tableHeaderData = ['Material', 'Unit', 'Ordered Qty.', 'Inward Qty.', 'Remaining Qty.'];

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
    await this.loadMaterialRequisitionIfEmployeeExists();
  };

  ionViewWillEnter = async () => {
    await this.loadMaterialRequisitionIfEmployeeExists();
  };

  async handleRefresh(event: CustomEvent) {
    await this.loadMaterialRequisitionIfEmployeeExists();
    (event.target as HTMLIonRefresherElement).complete();
  }

  private async loadMaterialRequisitionIfEmployeeExists() {
    try {
      await this.loadingService.show();

      const company = this.appStateManage.localStorage.getItem('SelectedCompanyRef');
      this.companyRef = Number(company || 0);

      if (this.companyRef <= 0) {
        await this.toastService.present('Company not selected', 1000, 'danger');
        await this.haptic.error();
        return;
      }

      await this.getSiteListByCompanyRef();
      await this.getStockInwardListByCompanyRef();
    } catch (error) {
      console.error('Error in loadMaterialRequisitionIfEmployeeExists:', error);
      await this.toastService.present('Failed to load Stock Inward', 1000, 'danger');
      await this.haptic.error();
    } finally {
      await this.loadingService.hide();
    }
  }

  private async getSiteListByCompanyRef() {
    try {
      if (this.companyRef <= 0) return;

      const lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async (errMsg) => {
        await this.toastService.present('Error: ' + errMsg, 1000, 'danger');
        await this.haptic.error();
      });

      this.SiteList = lst || [];

      this.Entity.p.SiteRef = 0; // Default selection
    } catch (err) {
      console.error('Error fetching site list:', err);
    }
  }

  private async getStockInwardListByCompanyRef() {
    try {
      this.MasterList = [];
      this.DisplayMasterList = [];

      const lst = await StockInward.FetchEntireListByCompanyRef(this.companyRef, async (errMsg) => {
        await this.toastService.present('Error: ' + errMsg, 1000, 'danger');
        await this.haptic.error();
      });

      this.MasterList = lst || [];
      this.DisplayMasterList = [...this.MasterList];
    } catch (err) {
      console.error('Error fetching stock inward list:', err);
    }
  }

  private async getInwardListByCompanyRefAndSiteRef() {
    try {
      this.MasterList = [];
      this.DisplayMasterList = [];

      const lst = await StockInward.FetchEntireListByCompanyRefAndSiteRef(this.companyRef, this.Entity.p.SiteRef, async (errMsg) => {
        await this.toastService.present('Error: ' + errMsg, 1000, 'danger');
        await this.haptic.error();
      });

      this.MasterList = lst || [];
      this.DisplayMasterList = [...this.MasterList];
    } catch (err) {
      console.error('Error fetching stock inward list:', err);
    }
  }

  prepareInvoiceUrl(path: string) {
    this.showInvoicePreview = !this.showInvoicePreview;

    if (!path) return;

    const ImageBaseUrl = this.baseUrl.GenerateImageBaseUrl();
    const LoginToken = this.appStateManage.localStorage.getItem('LoginToken');
    const TimeStamp = Date.now();

    const fileUrl = `${ImageBaseUrl}${path}/${LoginToken}?${TimeStamp}`;
    console.log('Invoice Preview URL:', fileUrl);

    this.sanitizedInvoiceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
  }

  isPDF(filePath: string): boolean {
    return filePath?.toLowerCase().endsWith('.pdf');
  }

  openModal(stockInward: StockInward) {
    this.SelectedStockInward = stockInward;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.SelectedStockInward = StockInward.CreateNewInstance();
    this.showInvoicePreview = false;
  }

  AddStockInward = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }

    this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/stock-inward/add']);
  };

  onEditClicked = async (item: StockInward) => {
    this.SelectedStockInward = item.GetEditableVersion();
    StockInward.SetCurrentInstance(this.SelectedStockInward);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/stock-inward/edit']);
  };

  onDeleteClicked = async (stockInward: StockInward) => {
    try {
      this.alertService.presentDynamicAlert({
        header: 'Delete',
        subHeader: 'Confirmation needed',
        message: 'Are you sure you want to delete this Stock Inward?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'custom-cancel',
            handler: () => {
              console.log('Deletion cancelled.');
            },
          },
          {
            text: 'Yes, Delete',
            cssClass: 'custom-confirm',
            handler: async () => {
              try {
                // await stockInward.DeleteInstance(async () => {
                //   await this.toastService.present(
                //     `Deleted Stock Inward on ${this.formatDate(stockInward.p.PurchaseOrderDate)}!`,
                //     1000,
                //     'success'
                //   );
                //   await this.haptic.success();
                //   await this.loadMaterialRequisitionIfEmployeeExists();
                // });
                await stockInward.DeleteInstance(async () => {
                  await this.toastService.present(
                    `Deleted Stock Inward on ${this.formatDate(stockInward.p.PurchaseOrderDate)}!`,
                    1000,
                    'success'
                  );
                  await this.haptic.success();
                  if (this.Entity.p.SiteRef <= 0) {
                    this.getStockInwardListByCompanyRef();
                  } else {
                    this.getInwardListByCompanyRefAndSiteRef();
                  }
                });
              } catch (err) {
                console.error('Error deleting Stock Inward:', err);
                await this.toastService.present('Failed to delete Stock Inward', 1000, 'danger');
                await this.haptic.error();
              }
            },
          },
        ],
      });
    } catch (error) {
      console.error('Delete Alert Error:', error);
      await this.toastService.present('Something went wrong', 1000, 'danger');
      await this.haptic.error();
    }
  };

  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  };

  navigateToPrint = async (item: StockInward) => {
    this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/stock-inward/print'], {
      state: { printData: item.GetEditableVersion() },
    });
  };
}
