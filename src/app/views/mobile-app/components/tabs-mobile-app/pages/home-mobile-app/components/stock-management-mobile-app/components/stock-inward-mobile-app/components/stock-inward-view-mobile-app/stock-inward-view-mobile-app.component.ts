import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { StockInward } from 'src/app/classes/domain/entities/website/stock_management/stock_inward/stockinward';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { FilterItem } from 'src/app/views/mobile-app/components/shared/chip-filter-mobile-app/chip-filter-mobile-app.component';

@Component({
  selector: 'app-stock-inward-view-mobile-app',
  templateUrl: './stock-inward-view-mobile-app.component.html',
  styleUrls: ['./stock-inward-view-mobile-app.component.scss'],
  standalone: false
})
export class StockInwardViewMobileAppComponent implements OnInit {
  Entity: StockInward = StockInward.CreateNewInstance();
  MasterList: StockInward[] = [];
  DisplayMasterList: StockInward[] = [];
  list: [] = []
  SiteList: Site[] = [];
  VendorList: Vendor[] = [];
  SearchString: string = '';
  SelectedStockInward: StockInward = StockInward.CreateNewInstance();
  CustomerRef: number = 0;

  modalOpen = false;
  tableHeaderData = ['Material', 'Unit', 'Ordered Qty.', 'Inward Qty.', 'Remaining Qty.'];
  filters: FilterItem[] = [];
  companyRef: number = 0;
  // Store current selected values here to preserve selections on filter reload
  selectedFilterValues: Record<string, any> = {};

  showInvoicePreview = false;
  sanitizedInvoiceUrl: SafeResourceUrl | null = null;

  constructor(
    private router: Router,
    private appStateManage: AppStateManageService,
    private DateconversionService: DateconversionService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    public loadingService: LoadingService,
    private sanitizer: DomSanitizer,
    private baseUrl: BaseUrlService,
  ) { }

  ngOnInit = async () => {
    // await this.loadStockInwordsIfEmployeeExists();
  };

  ionViewWillEnter = async () => {
    await this.loadStockInwordsIfEmployeeExists();
    this.loadFilters();
  };

  handleRefresh = async (event: CustomEvent) => {
    await this.loadStockInwordsIfEmployeeExists();
    this.loadFilters();
    (event.target as HTMLIonRefresherElement).complete();
  }

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
        key: 'vendor',
        label: 'Vendor',
        multi: false,
        options: this.VendorList.map(item => ({
          Ref: item.p.Ref,
          Name: item.p.Name,
        })),
        selected: this.selectedFilterValues['vendor'] > 0 ? this.selectedFilterValues['vendor'] : null,
      }
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
        case 'vendor':
          this.Entity.p.VendorRef = selectedValue ?? 0;
          break;
      }
    }
    await this.getInwardListByCompanySiteAndVendorRef();
    this.loadFilters(); // Reload filters with updated options & preserve selections
  }

  prepareInvoiceUrl = (path: string) => {
    this.showInvoicePreview = !this.showInvoicePreview
    const ImageBaseUrl = this.baseUrl.GenerateImageBaseUrl();
    const LoginToken = this.appStateManage.localStorage.getItem('LoginToken');

    if (!path) return;

    const TimeStamp = Date.now();
    const fileUrl = `${ImageBaseUrl}${path}/${LoginToken}?${TimeStamp}`;
    this.sanitizedInvoiceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
  }

  isPDF = (filePath: string): boolean => {
    return filePath?.toLowerCase().endsWith('.pdf');
  }

  fileNavigation(filePath: string) {
    const ImageBaseUrl = this.baseUrl.GenerateImageBaseUrl();
    const LoginToken = this.appStateManage.localStorage.getItem('LoginToken');

    if (!filePath) return;

    const TimeStamp = Date.now();
    const fileUrl = `${ImageBaseUrl}${filePath}/${LoginToken}?${TimeStamp}`;
    window.open(fileUrl, '_blank');
  }

  private loadStockInwordsIfEmployeeExists = async () => {
    try {
      await this.loadingService.show();

      const company = this.appStateManage.localStorage.getItem('SelectedCompanyRef');
      this.companyRef = Number(company || 0);

      if (this.companyRef <= 0) {
        await this.toastService.present('Company not selected', 1000, 'warning');
        await this.haptic.warning();
        return;
      }

      await this.getSiteListByCompanyRef();
      await this.getVendorListByCompanyRef();
      await this.getInwardListByCompanySiteAndVendorRef();
    } catch (error) {
      await this.toastService.present('Failed to load Stock Inward', 1000, 'danger');
      await this.haptic.error();
    } finally {
      await this.loadingService.hide();
    }
  }
  getSiteListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    this.Entity.p.SiteRef = 0
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.SiteList = lst;
    if (this.SiteList.length > 0) {
      this.Entity.p.SiteRef = 0
    }
  }

  getVendorListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    this.Entity.p.VendorRef = 0
    let lst = await Vendor.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.VendorList = lst;
    if (this.VendorList.length > 0) {
      this.Entity.p.VendorRef = 0
    }
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  getInwardListByCompanySiteAndVendorRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    let lst = await StockInward.FetchEntireListByCompanyRefSiteAndVendorRef(this.companyRef, this.Entity.p.SiteRef, this.Entity.p.VendorRef,
      async (errMsg) => {
         await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
   };

  AddStockInward = async () => {
    if (this.companyRef <= 0) {
       await this.toastService.present('Please select company', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    await this.router.navigate(['mobile-app/tabs/dashboard/stock-management/stock-inward/add'], { replaceUrl: true });
  }

  onEditClicked = async (item: StockInward) => {
    this.SelectedStockInward = item.GetEditableVersion();
    StockInward.SetCurrentInstance(this.SelectedStockInward);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['mobile-app/tabs/dashboard/stock-management/stock-inward/edit'], { replaceUrl: true });
  };

  navigateToPrint = async (item: StockInward) => {
    this.router.navigate(['mobile-app/tabs/dashboard/stock-management/stock-inward/print'], {
      state: { inwardref: item.p.Ref }
    });
  }

  onDeleteClicked = async (StockInward: StockInward) => {
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
           
          }
        },
        {
          text: 'Yes, Delete',
          cssClass: 'custom-confirm',
          handler: async () => {
            try {
              this.loadingService.show();
              await StockInward.DeleteInstance(async () => {
                await this.toastService.present(
                  `Stock Inward oF ${StockInward.p.ChalanNo} has been deleted!`,
                  1000,
                  'success'
                );
              });
              await this.haptic.success();
              await this.getInwardListByCompanySiteAndVendorRef();
            } catch (err) {
              await this.toastService.present('Failed to delete Stock Inward', 1000, 'danger');
              await this.haptic.error();
            }
            finally {
              this.loadingService.hide();
            }
          }
        }
      ]
    });
  };

  openModal(stockInward: StockInward) {
    this.SelectedStockInward = stockInward;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.SelectedStockInward = StockInward.CreateNewInstance();
  }
}
