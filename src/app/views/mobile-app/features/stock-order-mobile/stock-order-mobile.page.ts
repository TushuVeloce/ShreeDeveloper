import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MaterialRequisitionStatuses } from 'src/app/classes/domain/domainenums/domainenums';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Order } from 'src/app/classes/domain/entities/website/stock_management/stock_order/order';
import { FileTransferObject } from 'src/app/classes/infrastructure/filetransferobject';
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
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-stock-order-mobile',
  templateUrl: './stock-order-mobile.page.html',
  styleUrls: ['./stock-order-mobile.page.scss'],
  standalone: false,
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        display: 'none',
        height: '0px',
        opacity: 0,
        padding: '0px',
        overflow: 'hidden',
      })),
      state('expanded', style({
        height: '*',
        opacity: 1,
        padding: '*',
        overflow: 'hidden',
      })),
      transition('collapsed <=> expanded', [
        animate('300ms ease')
      ]),
    ])
  ]
})
export class StockOrderMobilePage implements OnInit {
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
  ) {
  }

  ngOnInit = async () => {
    await this.loadMaterialRequisitionIfEmployeeExists();

  }
  ionViewWillEnter = async () => {
    await this.loadMaterialRequisitionIfEmployeeExists();
  }
  ngOnDestroy() {
    // Cleanup if needed
  }

  async handleRefresh(event: CustomEvent) {
    await this.loadMaterialRequisitionIfEmployeeExists();
    (event.target as HTMLIonRefresherElement).complete();
  }

  getStatusClass(status: any): string {
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

  getStatusText(status: any): string {
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

  toggleItemDetails(requisitionId: number) {
    if (this.expandedRequisitions.has(requisitionId)) {
      this.expandedRequisitions.delete(requisitionId);
    } else {
      this.expandedRequisitions.add(requisitionId);
    }
  }

  prepareInvoiceUrl(path: string) {
    this.showInvoicePreview = !this.showInvoicePreview
    const ImageBaseUrl = this.baseUrl.GenerateImageBaseUrl();
    const LoginToken = this.appStateManage.localStorage.getItem('LoginToken');
    // const path = this.SelectedQuotation.p.InvoicePath;


    if (!path) return;

    const TimeStamp = Date.now();
    const fileUrl = `${ImageBaseUrl}${path}/${LoginToken}?${TimeStamp}`;
    console.log('Invoice Preview URL:', fileUrl);

    this.sanitizedInvoiceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
  }

  isPDF(filePath: string): boolean {
    return filePath?.toLowerCase().endsWith('.pdf');
  }


  private async loadMaterialRequisitionIfEmployeeExists() {
    try {
      await this.loadingService.show();
      this.companyRef = Number(this.appStateManage.localStorage.getItem('SelectedCompanyRef'));

      if (this.companyRef > 0) {
        await this.getSiteListByCompanyRef();
        await this.getOrderListByCompanyRef();
        // this.prepareInvoiceUrl();
      } else {
        await this.toastService.present('company not selected', 1000, 'danger');
        await this.haptic.error();
      }
    } catch (error) {
      console.error('Error loading Vendor Quotation:', error);
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
      // await this.uiUtils.showErrorToster('Company not Selected');
      await this.toastService.present('Company not Selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      // await this.uiUtils.showErrorMessage('Error', errMsg)
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.SiteList = lst;
  }

  private getOrderListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      // await this.uiUtils.showErrorToster('Company not Selected');
      await this.toastService.present('Company not Selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    let lst = await Order.FetchEntireListByCompanyRef(this.companyRef,
      async (errMsg) => {
        // await this.uiUtils.showErrorMessage('Error', errMsg)
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error()
      }
    );
    console.log('lst :', lst);
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
        // await this.uiUtils.showErrorMessage('Error', errMsg)
        await this.toastService.present(errMsg, 1000, 'danger')
        await this.haptic.error()
      }
    );
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
  };

  onEditClicked = async (item: Order) => {
    this.SelectedOrder = item.GetEditableVersion();
    Order.SetCurrentInstance(this.SelectedOrder);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/stock-order/edit']);
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
                console.error('Error deleting Stock Order:', err);
                await this.toastService.present('Failed to delete Stock Order', 1000, 'danger');
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

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  navigateToPrint = async (item: Order) => {
    this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/stock-order/print'], {
      state: { printData: item.GetEditableVersion() }
    });
  }

  AddOrder = async () => {
    if (this.companyRef <= 0) {
      // await this.uiUtils.showErrorToster('Company not Selected');
      await this.toastService.present('Company not Selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/stock-order/add']);
  }

  openModal(requisition: any) {
    console.log('requisition: any:', requisition);
    this.SelectedOrder = requisition;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.SelectedOrder = Order.CreateNewInstance();
  }
  // SaveOrder = async (status: number) => {
  //   let lstFTO: FileTransferObject[] = [];
  //   this.Entity.p.CreatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
  //   this.Entity.p.UpdatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
  //   this.EntityOfOrder.p.MaterialPurchaseOrderStatus = status;
  //   let entityToSave = this.EntityOfOrder.GetEditableVersion();
  //   let entitiesToSave = [entityToSave];
  //   console.log('entitiesToSave :', entitiesToSave);

  //   // if (this.InvoiceFile) {
  //   //   lstFTO.push(
  //   //     FileTransferObject.FromFile(
  //   //       "InvoiceFile",
  //   //       this.InvoiceFile,
  //   //       this.InvoiceFile.name
  //   //     )
  //   //   );
  //   // }
  //   let tr = await this.utils.SavePersistableEntities(entitiesToSave, lstFTO);
  //   if (!tr.Successful) {
  //     await this.toastService.present(tr.Message, 1000, 'danger');
  //     await this.haptic.error();
  //     return;
  //   } else {
  //     await this.toastService.present('Order Status Updated successfully', 1000, 'success');
  //     await this.haptic.success();
  //     this.EntityOfOrder = Order.CreateNewInstance();
  //   }
  // };

  // SaveOrder = async (status: number) => {
  //   let lstFTO: FileTransferObject[] = [];
  //   this.Entity.p.CreatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
  //   this.Entity.p.UpdatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
  //   this.Entity.p.MaterialPurchaseOrderStatus = status;
  //   let entityToSave = this.Entity.GetEditableVersion();
  //   let entitiesToSave = [entityToSave];
  //   console.log('entitiesToSave :', entitiesToSave);

  //   // if (this.InvoiceFile) {
  //   //   lstFTO.push(
  //   //     FileTransferObject.FromFile(
  //   //       "InvoiceFile",
  //   //       this.InvoiceFile,
  //   //       this.InvoiceFile.name
  //   //     )
  //   //   );
  //   // }
  //   let tr = await this.utils.SavePersistableEntities(entitiesToSave, lstFTO);
  //   if (!tr.Successful) {
  //     // this.isSaveDisabled = false;
  //     // this.uiUtils.showErrorMessage('Error', tr.Message)
  //     await this.toastService.present(tr.Message, 1000, 'danger');
  //     await this.haptic.error();
  //     return;
  //   } else {
  //     // this.isSaveDisabled = false;
  //     // if (this.IsNewEntity) {
  //     //   // await this.uiUtils.showSuccessToster('Order saved successfully');
  //     //   await this.toastService.present('Order saved successfully', 1000, 'success');
  //     //   await this.haptic.success();
  //     //   this.Entity = Order.CreateNewInstance();
  //     // } else {
  //     //   // await this.uiUtils.showSuccessToster('Order Status Updated successfully');
  //     //   await this.toastService.present('Order Status Updated successfully', 1000, 'success');
  //     //   await this.haptic.success();
  //     // }
  //     // await this.router.navigate(['/homepage/Website/Stock_Order']);
  //     await this.toastService.present('Order saved successfully', 1000, 'success');
  //     await this.haptic.success();
  //     this.Entity = Order.CreateNewInstance();
  //   }
  // };
  SaveOrder = async (status: number) => {
    let lstFTO: FileTransferObject[] = [];

    this.EntityOfOrder = this.SelectedOrder;
    this.EntityOfOrder.p.CreatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
    this.EntityOfOrder.p.UpdatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
    this.EntityOfOrder.p.MaterialPurchaseOrderStatus = status;
    console.log('this.EntityOfApprove :', this.EntityOfOrder);

    let entityToSave = this.EntityOfOrder.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    console.log('entitiesToSave :', entitiesToSave);

    // if (this.InvoiceFile) {
    //   lstFTO.push(
    //     FileTransferObject.FromFile(
    //       "InvoiceFile",
    //       this.InvoiceFile,
    //       this.InvoiceFile.name
    //     )
    //   );
    // }
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
