import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums, MaterialRequisitionStatuses } from 'src/app/classes/domain/domainenums/domainenums';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { MaterialRequisition } from 'src/app/classes/domain/entities/website/stock_management/material_requisition/materialrequisition';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { ToastService } from '../../core/toast.service';
import { HapticService } from '../../core/haptic.service';
import { AlertService } from '../../core/alert.service';
import { LoadingService } from '../../core/loading.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Quotation } from 'src/app/classes/domain/entities/website/stock_management/Quotation/quotation';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { FileTransferObject } from 'src/app/classes/infrastructure/filetransferobject';
import { Order } from 'src/app/classes/domain/entities/website/stock_management/stock_order/order';
import { Utils } from 'src/app/services/utils.service';
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';

@Component({
  selector: 'app-vendor-quotation-mobile',
  templateUrl: './vendor-quotation-mobile.page.html',
  styleUrls: ['./vendor-quotation-mobile.page.scss'],
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
export class VendorQuotationMobilePage implements OnInit {

  Entity: Quotation = Quotation.CreateNewInstance();
  MasterList: Quotation[] = [];
  DisplayMasterList: Quotation[] = [];
  SearchString: string = '';
  SiteList: Site[] = [];
  SelectedQuotation: Quotation = Quotation.CreateNewInstance();
  SelectedQuotationItem: any = null;
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  MaterialQuotationStatus = MaterialRequisitionStatuses

  EntityOfApprove: Quotation = Quotation.CreateNewInstance();
  expandedRequisitions: Set<number> = new Set();



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
  ) { }

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
      case this.MaterialQuotationStatus.Pending:
        return 'pending';
      case this.MaterialQuotationStatus.Rejected:
        return 'rejected';
      case this.MaterialQuotationStatus.Approved:
        return 'approved';
      case this.MaterialQuotationStatus.Ordered:
        return 'ordered';
      case this.MaterialQuotationStatus.Incomplete:
        return 'incomplete';
      case this.MaterialQuotationStatus.Completed:
        return 'completed';
      default:
        return 'default';
    }
  }

  getStatusText(status: any): string {
    switch (status) {
      case this.MaterialQuotationStatus.Pending:
        return 'Pending';
      case this.MaterialQuotationStatus.Rejected:
        return 'Rejected';
      case this.MaterialQuotationStatus.Approved:
        return 'Approved';
      case this.MaterialQuotationStatus.Ordered:
        return 'Ordered';
      case this.MaterialQuotationStatus.Incomplete:
        return 'Incomplete';
      case this.MaterialQuotationStatus.Completed:
        return 'Completed';
      default:
        return '-';
    }
  }

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
        await this.getQuotationListByCompanyRef();
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
      await this.toastService.present('Company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    this.Entity.p.SiteRef = 0
    this.Entity.p.SiteName = ''
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.SiteList = lst;
  }


  private getQuotationListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      this.toastService.present('Company not Selected', 1000, 'danger');
      this.haptic.error();
      return;
    }
    let lst = await Quotation.FetchEntireListByCompanyRef(this.companyRef,
      async (errMsg) => {
        this.toastService.present(errMsg, 1000, 'danger');
        this.haptic.error();
      }
    );
    console.log('lst :', lst);
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
  };

  getVendorQuotationListByCompanyRefAndSiteRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.Entity.p.SiteRef <= 0) {
      this.getQuotationListByCompanyRef();
      return;
    }
    let lst = await Quotation.FetchEntireListByCompanyRefAndSiteRef(this.companyRef, this.Entity.p.SiteRef,
      async (errMsg) => {
        this.toastService.present(errMsg, 1000, 'danger');
        this.haptic.error();
      }
    );
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
  };

  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  AddVendorQuotation = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not Selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    await this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/vendor-quotation/add']);
  }

  onEditClicked = async (item: Quotation) => {
    this.SelectedQuotation = item.GetEditableVersion();
    Quotation.SetCurrentInstance(this.SelectedQuotation);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/vendor-quotation/edit']);
  }

  async onDeleteClicked(item: Quotation) {
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
                await item.DeleteInstance(async () => {
                  this.loadingService.show();
                  await this.toastService.present(
                    `Vendor Quotation of ${item.p.VendorName},${this.formatDate(item.p.Date)} has been deleted!`,
                    1000,
                    'success'
                  );
                  await this.haptic.success();
                });
                await this.getQuotationListByCompanyRef();
                this.loadingService.hide();
              } catch (err) {
                console.error('Error deleting Vendor Quotation:', err);
                await this.toastService.present('Failed to delete Vendor Quotation', 1000, 'danger');
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

  openModal(requisition: any) {
    console.log('requisition: any:', requisition);
    this.SelectedQuotation = requisition;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.SelectedQuotation = Quotation.CreateNewInstance();
  }


  SaveOrder = async (status: number) => {
    let lstFTO: FileTransferObject[] = [];
    
    this.EntityOfApprove= this.SelectedQuotation;
    this.EntityOfApprove.p.CreatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
    this.EntityOfApprove.p.UpdatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
    this.EntityOfApprove.p.MaterialQuotationStatus = status;
    console.log('this.EntityOfApprove :', this.EntityOfApprove);

    let entityToSave = this.EntityOfApprove.GetEditableVersion();
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
      await this.toastService.present(status == this.MaterialQuotationStatus.Approved ? 'Order is Approved' : status == this.MaterialQuotationStatus.Rejected ?'Order is Rejected':'N/A', 1000, 'success');
      await this.haptic.success();
      this.EntityOfApprove = Quotation.CreateNewInstance();
      this.closeModal();
    }
  };
}
