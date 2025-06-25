import { animate, state, style, transition, trigger } from '@angular/animations';
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
  standalone:false,
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
export class StockInwardMobilePage implements OnInit {
  Entity: StockInward = StockInward.CreateNewInstance();
  MasterList: StockInward[] = [];
  DisplayMasterList: StockInward[] = [];
  list: [] = []
  SiteList: Site[] = [];
  SearchString: string = '';
  SelectedStockInward: StockInward = StockInward.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10;
  currentPage = 1;
  total = 0;
  // MaterialStockOrderStatus = MaterialRequisitionStatuses;

  // EntityOfOrder: Order = Order.CreateNewInstance();

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

  // getStatusClass(status: any): string {
  //   switch (status) {
  //     case this.MaterialStockOrderStatus.Pending:
  //       return 'pending';
  //     case this.MaterialStockOrderStatus.Rejected:
  //       return 'rejected';
  //     case this.MaterialStockOrderStatus.Approved:
  //       return 'approved';
  //     case this.MaterialStockOrderStatus.Ordered:
  //       return 'ordered';
  //     case this.MaterialStockOrderStatus.Incomplete:
  //       return 'incomplete';
  //     case this.MaterialStockOrderStatus.Completed:
  //       return 'completed';
  //     default:
  //       return 'default';
  //   }
  // }

  // getStatusText(status: any): string {
  //   switch (status) {
  //     case this.ma.Pending:
  //       return 'Pending';
  //     case this.MaterialStockOrderStatus.Rejected:
  //       return 'Rejected';
  //     case this.MaterialStockOrderStatus.Approved:
  //       return 'Approved';
  //     case this.MaterialStockOrderStatus.Ordered:
  //       return 'Ordered';
  //     case this.MaterialStockOrderStatus.Incomplete:
  //       return 'Incomplete';
  //     case this.MaterialStockOrderStatus.Completed:
  //       return 'Completed';
  //     default:
  //       return '-';
  //   }
  // }

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
        await this.getSiteListByCompanyRef()
        await this.getStockInwardListByCompanyRef();
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
    if (this.companyRef <= 0) {
      // await this.uiUtils.showErrorToster('Company not Selected');
      await this.toastService.present('Company not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    this.Entity.p.SiteRef = 0
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      // await this.uiUtils.showErrorMessage('Error', errMsg)
      await this.toastService.present('error'+errMsg, 1000, 'danger');});
      await this.haptic.error();
    this.SiteList = lst;
    if (this.SiteList.length > 0) {
      this.Entity.p.SiteRef = 0
    }
    // this.getInwardListByAllFilters()
  }

  getStockInwardListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      // await this.uiUtils.showErrorToster('Company not Selected');
      await this.toastService.present('Company not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await StockInward.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      // await this.uiUtils.showErrorMessage('Error', errMsg)
      await this.toastService.present('error'+errMsg, 1000, 'danger'); 
      await this.haptic.error();
    });
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
  }

  onSiteChange = async () => {
    // this.getInwardListByAllFilters()
  }

  AddStockInward = async () => {
    if (this.companyRef <= 0) {
      // await this.uiUtils.showErrorToster('Company not Selected');
      await this.toastService.present('Company not Selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/stock-inward/add']);
  }

  onEditClicked = async (item: StockInward) => {
    this.SelectedStockInward = item.GetEditableVersion();
    StockInward.SetCurrentInstance(this.SelectedStockInward);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/stock-order/edit']);
  };

  onDeleteClicked = async (StockInward: StockInward) => {
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
            }
          },
          {
            text: 'Yes, Delete',
            cssClass: 'custom-confirm',
            handler: async () => {
              try {
                await StockInward.DeleteInstance(async () => {
                  await this.toastService.present(
                    `Stock Inward on ${this.formatDate(StockInward.p.OrderedDate)} has been deleted!`,
                    1000,
                    'success'
                  );
                  await this.haptic.success();
                });
              } catch (err) {
                console.error('Error deleting Stock Inward:', err);
                await this.toastService.present('Failed to delete Stock Inward', 1000, 'danger');
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

  navigateToPrint = async (item: StockInward) => {
    this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/stock-order/print'], {
      state: { printData: item.GetEditableVersion() }
    });
  }

  // openModal(requisition: any) {
  //   console.log('requisition: any:', requisition);
  //   this.SelectedOrder = requisition;
  //   this.modalOpen = true;
  // }

  // closeModal() {
  //   this.modalOpen = false;
  //   this.SelectedOrder = Order.CreateNewInstance();
  // }
  //  SaveOrder = async (status: number) => {
  //   let lstFTO: FileTransferObject[] = [];

  //   this.EntityOfOrder = this.SelectedOrder;
  //   this.EntityOfOrder.p.CreatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
  //   this.EntityOfOrder.p.UpdatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
  //   this.EntityOfOrder.p.MaterialStockOrderStatus = status;
  //   console.log('this.EntityOfApprove :', this.EntityOfOrder);

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
  //     await this.toastService.present(status == this.MaterialStockOrderStatus.Ordered ? 'Order is Approved' : status == this.MaterialStockOrderStatus.Rejected ? 'Order is Rejected' : 'N/A', 1000, 'success');
  //     await this.haptic.success();
  //     this.EntityOfOrder = Order.CreateNewInstance();
  //     this.closeModal();
  //   }
  // };
}
