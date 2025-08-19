import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MaterialRequisitionStatuses } from 'src/app/classes/domain/domainenums/domainenums';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Order } from 'src/app/classes/domain/entities/website/stock_management/stock_order/order';
import { OrderMaterialDetailProps } from 'src/app/classes/domain/entities/website/stock_management/stock_order/OrderMaterial/ordermaterial';
import { FileTransferObject } from 'src/app/classes/infrastructure/filetransferobject';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { Utils } from 'src/app/services/utils.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { FilterItem } from 'src/app/views/mobile-app/components/shared/chip-filter-mobile-app/chip-filter-mobile-app.component';

@Component({
  selector: 'app-stock-order-view-mobile-app',
  templateUrl: './stock-order-view-mobile-app.component.html',
  styleUrls: ['./stock-order-view-mobile-app.component.scss'],
  standalone: false
})
export class StockOrderViewMobileAppComponent implements OnInit {

  Entity: Order = Order.CreateNewInstance();
  MasterList: Order[] = [];
  DisplayMasterList: Order[] = [];
  SearchString: string = '';
  SiteList: Site[] = [];
  SelectedOrder: Order = Order.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  MaterialPurchaseOrderStatus = MaterialRequisitionStatuses;

  EntityOfOrder: Order = Order.CreateNewInstance();

  companyRef = 0;
  modalOpen = false;
  showItemDetails = false;
  tableHeaderData = ['Material', 'Unit', 'Required Qty', 'Ordered Qty', 'Required Remaining Qty', 'Rate', 'Discount Rate', 'GST', 'Delivery Charges', 'Expected Delivery Date', 'Net Amount', 'Total Amount']
  showInvoicePreview = false;
  sanitizedInvoiceUrl: SafeResourceUrl | null = null;
  filters: FilterItem[] = [];

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
    private sanitizer: DomSanitizer,
    private baseUrl: BaseUrlService,
    private utils: Utils,
  ) {
  }

  ngOnInit = async () => {
    // await this.loadMaterialRequisitionIfEmployeeExists();

  }
  ionViewWillEnter = async () => {
    await this.loadMaterialRequisitionIfEmployeeExists();
    this.loadFilters();
  }
  ngOnDestroy() {
    // Cleanup if needed
  }

  handleRefresh = async (event: CustomEvent) => {
    await this.loadMaterialRequisitionIfEmployeeExists();
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
      }
    }
    await this.getOrderListByCompanyRefAndSiteRef();
    this.loadFilters(); // Reload filters with updated options & preserve selections
  }


  getStatusClass = (status: any): string => {
    switch (status) {
      case this.MaterialPurchaseOrderStatus.Pending:
        return 'pending';
      case this.MaterialPurchaseOrderStatus.Rejected:
        return 'rejected';
      case this.MaterialPurchaseOrderStatus.Approved:
        return 'approved';
      case this.MaterialPurchaseOrderStatus.Ordered:
        return 'ordered';
      case this.MaterialPurchaseOrderStatus.Incomplete:
        return 'incomplete';
      case this.MaterialPurchaseOrderStatus.Completed:
        return 'completed';
      default:
        return 'default';
    }
  }

  getStatusText = (status: any): string => {
    switch (status) {
      case this.MaterialPurchaseOrderStatus.Pending:
        return 'Pending';
      case this.MaterialPurchaseOrderStatus.Rejected:
        return 'Rejected';
      case this.MaterialPurchaseOrderStatus.Approved:
        return 'Approved';
      case this.MaterialPurchaseOrderStatus.Ordered:
        return 'Ordered';
      case this.MaterialPurchaseOrderStatus.Incomplete:
        return 'Incomplete';
      case this.MaterialPurchaseOrderStatus.Completed:
        return 'Completed';
      default:
        return '-';
    }
  }

  expandedRequisitions: Set<number> = new Set();

  toggleItemDetails = (requisitionId: number) => {
    if (this.expandedRequisitions.has(requisitionId)) {
      this.expandedRequisitions.delete(requisitionId);
    } else {
      this.expandedRequisitions.add(requisitionId);
    }
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

  fileNavigation = (filePath: string) => {
    const ImageBaseUrl = this.baseUrl.GenerateImageBaseUrl();
    const LoginToken = this.appStateManage.localStorage.getItem('LoginToken');

    if (!filePath) return;

    const TimeStamp = Date.now();
    const fileUrl = `${ImageBaseUrl}${filePath}/${LoginToken}?${TimeStamp}`;
    window.open(fileUrl, '_blank');
  }


  private loadMaterialRequisitionIfEmployeeExists = async () => {
    try {
      await this.loadingService.show();
      this.companyRef = Number(this.appStateManage.localStorage.getItem('SelectedCompanyRef'));

      if (this.companyRef > 0) {
        await this.getSiteListByCompanyRef();
        await this.getOrderListByCompanyRef();
      } else {
        await this.toastService.present('company not selected', 1000, 'danger');
        await this.haptic.error();
      }
    } catch (error) {
      await this.toastService.present('Failed to load Vendor Quotation', 1000, 'danger');
      await this.haptic.error();
    } finally {
      await this.loadingService.hide();
    }
  }

  getSiteListByCompanyRef = async () => {
    this.Entity.p.SiteRef = 0
    this.Entity.p.SiteName = ''
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not Selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.SiteList = lst;
  }

  private getOrderListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not Selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    let lst = await Order.FetchEntireListByCompanyRef(this.companyRef,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error()
      }
    );
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
  };

  getOrderListByCompanyRefAndSiteRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.Entity.p.SiteRef <= 0) {
      this.getOrderListByCompanyRef();
      return;
    }
    let lst = await Order.FetchEntireListByCompanyRefAndSiteRef(this.companyRef, this.Entity.p.SiteRef,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger')
        await this.haptic.error()
      }
    );
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
  };

  checkIsEnable = (data: OrderMaterialDetailProps[]): boolean => {
    // Collect boolean values based on the condition
    const booleanValues = data.map(item => item.RequisitionQty <= item.TotalOrderedQty);

    // If ANY entry fails (QuotationOrderedQty <= OrderedQty), return false
    const status = booleanValues.every(value => value);
    return status;
  };

  onEditClicked = async (item: Order) => {
    this.SelectedOrder = item.GetEditableVersion();
    Order.SetCurrentInstance(this.SelectedOrder);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/mobile-app/tabs/dashboard/stock-management/stock-order/edit'], { replaceUrl: true });
  };

  onDeleteClicked = async (Order: Order) => {
    try {
      this.alertService.presentDynamicAlert({
        header: 'Delete',
        subHeader: 'Confirmation needed',
        message: 'Are you sure you want to delete this Vendor Quotation?',
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
                await Order.DeleteInstance(async () => {
                  await this.toastService.present(
                    `Stock Order on ${this.formatDate(Order.p.PurchaseOrderDate)} has been deleted!`,
                    1000,
                    'success'
                  );
                  await this.haptic.success();
                });
                if (this.Entity.p.SiteRef <= 0) {
                  this.getOrderListByCompanyRef();
                } else {
                  this.getOrderListByCompanyRefAndSiteRef();
                }
              } catch (err) {
                await this.toastService.present('Failed to delete Stock Order', 1000, 'danger');
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

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  navigateToPrint = async (item: Order) => {
    await this.router.navigate(['/mobile-app/tabs/dashboard/stock-management/stock-order/print'], {
      state: { printData: item.GetEditableVersion() }
    });
  }

  AddOrder = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not Selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    await this.router.navigate(['/mobile-app/tabs/dashboard/stock-management/stock-order/add'], { replaceUrl: true });
  }

  openModal = (requisition: any) => {
    this.SelectedOrder = requisition;
    this.modalOpen = true;
  }

  closeModal = () => {
    this.modalOpen = false;
    this.SelectedOrder = Order.CreateNewInstance();
  }

  SaveOrder = async (status: number) => {
    let lstFTO: FileTransferObject[] = [];

    this.EntityOfOrder = this.SelectedOrder;
    this.EntityOfOrder.p.CreatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
    this.EntityOfOrder.p.UpdatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
    this.EntityOfOrder.p.MaterialPurchaseOrderStatus = status;

    let entityToSave = this.EntityOfOrder.GetEditableVersion();
    let entitiesToSave = [entityToSave];

    let tr = await this.utils.SavePersistableEntities(entitiesToSave, lstFTO);
    if (!tr.Successful) {
      await this.toastService.present(tr.Message, 1000, 'danger');
      await this.haptic.error();
      return;
    } else {
      await this.toastService.present(status == this.MaterialPurchaseOrderStatus.Ordered ? 'Order is Approved' : status == this.MaterialPurchaseOrderStatus.Rejected ? 'Order is Rejected' : 'N/A', 1000, 'success');
      await this.haptic.success();
      this.EntityOfOrder = Order.CreateNewInstance();
      this.closeModal();
    }
  };
}
