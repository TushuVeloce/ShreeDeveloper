import { Component, effect, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { MaterialRequisitionStatuses } from 'src/app/classes/domain/domainenums/domainenums';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { RequiredMaterial } from 'src/app/classes/domain/entities/website/stock_management/material_requisition/requiredmaterial/requiredmaterial';
import { Order } from 'src/app/classes/domain/entities/website/stock_management/stock_order/order';
import { OrderMaterial, OrderMaterialDetailProps } from 'src/app/classes/domain/entities/website/stock_management/stock_order/OrderMaterial/ordermaterial';
import { FileTransferObject } from 'src/app/classes/infrastructure/filetransferobject';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-stock-order-details',
  standalone: false,
  templateUrl: './stock-order-details.component.html',
  styleUrls: ['./stock-order-details.component.scss'],
})
export class StockOrderDetailsComponent implements OnInit {

  Entity: Order = Order.CreateNewInstance();
  IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Order' | 'Edit Order' = 'New Order';
  IsDropdownDisabled: boolean = false;
  InitialEntity: Order = null as any;
  SiteList: Site[] = [];
  VendorList: Vendor[] = [];
  MaterialRequisitionList: OrderMaterial[] = [];
  AllMaterialRequisitionList: OrderMaterial[] = [];
  OrderDate: string = '';
  CurrentDate: string = '';
  ModalEditable: boolean = false;
  ExpectedDeliveryDate: string = '';
  OrderMaterialheaders: string[] = ['Sr.No.', 'Material ', 'Unit', 'Requisition Quantity', 'Ordered Quantity', 'Requisition Remaining Quantity', 'Rate', 'Discount Rate', 'GST', 'Delivery Charges', 'Expected Delivery Date', 'Net Amount', 'Total Amount', 'Action'];
  isOrderMaterialModalOpen: boolean = false;
  newOrderMaterial: OrderMaterialDetailProps = OrderMaterialDetailProps.Blank();
  editingIndex: null | undefined | number
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  strCDT: string = '';
  MaterialOrderStatus = MaterialRequisitionStatuses;
  TotalOrderedQty: number = 0;


  errors: string = "";
  InvoiceFile: File = null as any
  ImageBaseUrl: string = "";
  TimeStamp = Date.now()
  LoginToken = '';

  imagePreView: string | null = '';
  imagePostView: string = '';
  imagePostViewUrl: string = '';
  selectedFileName: string = '';

  NameWithoutNos: string = ValidationPatterns.NameWithoutNos

  NameWithoutNosMsg: string = ValidationMessages.NameWithoutNosMsg
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg;

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement,
    private DateconversionService: DateconversionService,
    private dtu: DTU,
    private baseUrl: BaseUrlService,

  ) {
    effect(async () => {
      await this.getVendorListByCompanyRef(); await this.getSiteListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.ImageBaseUrl = this.baseUrl.GenerateImageBaseUrl();

    this.LoginToken = this.appStateManage.getLoginToken();
    this.appStateManage.setDropdownDisabled(true);
    await this.getSiteListByCompanyRef();
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Order' : 'Edit Order';
      this.Entity = Order.GetCurrentInstance();
      this.imagePostView = `${this.ImageBaseUrl}${this.Entity.p.MaterialPurchaseInvoicePath}/${this.LoginToken}?${this.TimeStamp}`;
      this.selectedFileName = this.Entity.p.MaterialPurchaseInvoicePath;

      this.OrderDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.PurchaseOrderDate);
      this.appStateManage.StorageKey.removeItem('Editable');
    } else {
      this.Entity = Order.CreateNewInstance();
      Order.SetCurrentInstance(this.Entity);
      this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
      let parts = this.strCDT.substring(0, 16).split('-');
      // Construct the new date format
      this.OrderDate = `${parts[0]}-${parts[1]}-${parts[2]}`;
      this.CurrentDate = `${parts[0]}-${parts[1]}-${parts[2]}`;
    }
    this.InitialEntity = Object.assign(Order.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as Order;
  }

  getSiteListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
  }

  getVendorListByCompanyRef = async () => {
    this.Entity.p.VendorRef = 0
    this.Entity.p.VendorName = ''
    this.Entity.p.VendorTradeName = ''
    this.Entity.p.AddressLine1 = ''
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Vendor.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.VendorList = lst;
  }

  getOrderedMaterialList = async () => {
    if (this.Entity.p.VendorRef <= 0) {
      await this.uiUtils.showErrorToster('Vendor not Selected');
      return;
    }
    if (this.Entity.p.SiteRef <= 0) {
      await this.uiUtils.showErrorToster('Site not Selected');
      return;
    }
    let lst = await OrderMaterial.FetchEntireListByCompanyRefAndSiteRef(this.companyRef(), this.Entity.p.SiteRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    console.log('lst :', lst);
    this.AllMaterialRequisitionList = lst;
    this.filterMaterialList();
  }

  filterMaterialList() {
    this.MaterialRequisitionList = this.AllMaterialRequisitionList.filter(material => material.p.IsRequisitionMaterial == 1)
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  onVendorSelection = (VendorRef: number) => {
    const SingleRecord = this.VendorList.filter(data => data.p.Ref == VendorRef);
    this.Entity.p.VendorTradeName = SingleRecord[0].p.TradeName
    this.Entity.p.AddressLine1 = SingleRecord[0].p.AddressLine1
  }

  onMaterialSelection = (MaterialRef: number) => {
    const SingleRecord = this.MaterialRequisitionList.filter(data => data.p.MaterialRef == MaterialRef);
    this.newOrderMaterial.UnitName = SingleRecord[0].p.UnitName
    this.newOrderMaterial.MaterialName = SingleRecord[0].p.MaterialName
    this.newOrderMaterial.RequisitionQty = SingleRecord[0].p.RequisitionQty
    this.newOrderMaterial.MaterialQuotationDetailRef = SingleRecord[0].p.Ref
    this.TotalOrderedQty = SingleRecord[0].p.TotalOrderedQty
    this.newOrderMaterial.TotalOrderedQty = SingleRecord[0].p.TotalOrderedQty;
  }

  // Trigger file input when clicking the image
  triggerFileInput(): void {
    this.fileInputRef.nativeElement.click();
  }

  isImageFile(filePath: string): boolean {
    if (!filePath) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const ext = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();
    return imageExtensions.includes(ext);
  }

  fileNavigation = (File: string) => {
    if (File) {
      window.open(this.imagePostView, '_blank');
    } else {
      window.open(this.imagePostViewUrl, '_blank');
    }
  }

  // Call this when editing existing data
  loadFileFromBackend(imageUrl: string): void {
    if (imageUrl) {
      this.imagePreView = `${this.ImageBaseUrl}${imageUrl}/${this.LoginToken}?${this.TimeStamp}`;
      this.selectedFileName = imageUrl;
    } else {
      this.imagePreView = null;
    }
  }

  // On file selected

  onFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.InvoiceFile = file;

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      const maxSizeMB = 2;

      if (file) {
        const isPdf = file.type === 'application/pdf';
        const isImage = file.type.startsWith('image/');

        if (isPdf || isImage) {
          this.imagePostViewUrl = URL.createObjectURL(file);
          this.Entity.p.MaterialPurchaseInvoicePath = '';
        } else {
          this.uiUtils.showWarningToster('Only PDF or image files are supported.')
        }
      }

      if (!allowedTypes.includes(file.type)) {
        this.errors = 'Only JPG, PNG, GIF, and PDF files are allowed.';
        return;
      }

      if (file.size / 1024 / 1024 > maxSizeMB) {
        this.errors = 'File size should not exceed 2 MB.';
        return;
      }

      this.errors = '';

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreView = reader.result as string;
        this.selectedFileName = file.name;

      };
      reader.readAsDataURL(file);
    }
  }

  openModal(type: string) {
    if (this.Entity.p.SiteRef <= 0) {
      this.uiUtils.showErrorToster('Site not Selected');
      return;
    }
    if (this.Entity.p.VendorRef <= 0) {
      this.uiUtils.showErrorToster('Vendor not Selected');
      return;
    }
    this.ModalEditable = false;
    this.getOrderedMaterialList();
    if (type === 'OrderMaterial') this.isOrderMaterialModalOpen = true;
  }

  closeModal = async (type: string) => {
    if (type === 'OrderMaterial') {
      const keysToCheck = ['Name', 'MaterialRef ', 'OrderedQty', 'Rate', 'DiscountedRate', 'Gst', 'DeliveryCharges', 'ExpectedDeliveryDate'] as const;

      const hasData = keysToCheck.some(
        key => (this.newOrderMaterial as any)[key]?.toString().trim()
      );

      if (hasData) {
        await this.uiUtils.showConfirmationMessage(
          'Close',
          `This process is <strong>IRREVERSIBLE!</strong><br/>
             Are you sure you want to close this modal?`,
          async () => {
            this.isOrderMaterialModalOpen = false;
            this.newOrderMaterial = OrderMaterialDetailProps.Blank();
          }
        );
      } else {
        this.isOrderMaterialModalOpen = false;
        this.ModalEditable = false;
        this.newOrderMaterial = OrderMaterialDetailProps.Blank();
      }
    }
  };

  async addOrderMaterial() {
    if (this.newOrderMaterial.MaterialQuotationDetailRef == 0) {
      return this.uiUtils.showWarningToster('Material Name cannot be blank.');
    }
    if (this.newOrderMaterial.OrderedQty == 0) {
      return this.uiUtils.showWarningToster('Ordered Quantity cannot be blank.');
    }
    if (this.newOrderMaterial.Rate == 0) {
      return this.uiUtils.showWarningToster('Rate cannot be blank.');
    }

    this.newOrderMaterial.ExpectedDeliveryDate = this.dtu.ConvertStringDateToFullFormat(this.ExpectedDeliveryDate);
    this.ExpectedDeliveryDate = '';
    if (this.editingIndex !== null && this.editingIndex !== undefined && this.editingIndex >= 0) {
      this.Entity.p.MaterialPurchaseOrderDetailsArray[this.editingIndex] = { ...this.newOrderMaterial };
      await this.uiUtils.showSuccessToster('Material updated successfully');
      this.isOrderMaterialModalOpen = false;

    } else {
      let OrderMaterialInstance = new OrderMaterial(this.newOrderMaterial, true);
      let OrderInstance = new Order(this.Entity.p, true);
      await OrderMaterialInstance.EnsurePrimaryKeysWithValidValues();
      await OrderInstance.EnsurePrimaryKeysWithValidValues();

      this.newOrderMaterial.MaterialPurchaseOrderRef = this.Entity.p.Ref;
      this.Entity.p.MaterialPurchaseOrderDetailsArray.push({ ...OrderMaterialInstance.p });
      // this.filterMaterialList();
      await this.uiUtils.showSuccessToster('Material added successfully');
      this.resetMaterialControls()
    }
    this.newOrderMaterial = OrderMaterialDetailProps.Blank();
    this.editingIndex = null;
  }

  editOrderMaterial(index: number) {
    this.isOrderMaterialModalOpen = true
    this.newOrderMaterial = { ...this.Entity.p.MaterialPurchaseOrderDetailsArray[index] }
    if (!this.IsNewEntity) {
      this.newOrderMaterial.TotalOrderedQty = 0;
    }
    this.editingIndex = index;
    this.ModalEditable = true;
    this.ExpectedDeliveryDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.MaterialPurchaseOrderDetailsArray[index].ExpectedDeliveryDate);
  }

  async removeOrderMaterial(index: number) {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
       Are you sure that you want to DELETE this Order Material?`,
      async () => {
        this.Entity.p.MaterialPurchaseOrderDetailsArray.splice(index, 1);
      }
    );
  }

  SaveOrder = async () => {
    let lstFTO: FileTransferObject[] = [];
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.newOrderMaterial.MaterialPurchaseOrderRef = this.Entity.p.Ref
    this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    this.Entity.p.PurchaseOrderDate = this.dtu.ConvertStringDateToFullFormat(this.OrderDate);

    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    console.log('entitiesToSave :', entitiesToSave);

    if (this.InvoiceFile) {
      lstFTO.push(
        FileTransferObject.FromFile(
          "InvoiceFile",
          this.InvoiceFile,
          this.InvoiceFile.name
        )
      );
    }

    if (this.Entity.p.MaterialPurchaseOrderStatus == MaterialRequisitionStatuses.Ordered) {
      this.Entity.p.MaterialPurchaseOrderDetailsArray.map((data) => {
        return data.MaterialPurchaseDetailStatus = MaterialRequisitionStatuses.Ordered;
      })
    }

    let tr = await this.utils.SavePersistableEntities(entitiesToSave, lstFTO);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message)
      return;
    } else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Order saved successfully');
        this.Entity = Order.CreateNewInstance();
        this.resetAllControls()
      } else {
        await this.uiUtils.showSuccessToster('Order Updated successfully');
      }
      await this.router.navigate(['/homepage/Website/Stock_Order']);
    }
  };

  CalculateNetAmountAndTotalAmount = async () => {
    this.newOrderMaterial.TotalOrderedQty = 0;
    this.newOrderMaterial.TotalOrderedQty = this.TotalOrderedQty + this.newOrderMaterial.OrderedQty;

    if (this.newOrderMaterial.TotalOrderedQty > this.newOrderMaterial.RequisitionQty) {
      this.newOrderMaterial.RequisitionRemainingQty = 0;
      this.newOrderMaterial.ExtraOrderedQty = this.newOrderMaterial.TotalOrderedQty - this.newOrderMaterial.RequisitionQty;
    } else {
      this.newOrderMaterial.RequisitionRemainingQty = this.newOrderMaterial.RequisitionQty - this.newOrderMaterial.TotalOrderedQty;
      this.newOrderMaterial.ExtraOrderedQty = 0;
    }



    if (this.newOrderMaterial.DiscountedRate == 0) {
      this.newOrderMaterial.NetAmount = (this.newOrderMaterial.Rate * this.newOrderMaterial.OrderedQty);
    } else {
      this.newOrderMaterial.NetAmount = (this.newOrderMaterial.DiscountedRate * this.newOrderMaterial.OrderedQty);
    }
    let GstAmount = (this.newOrderMaterial.NetAmount / 100) * this.newOrderMaterial.Gst;
    this.newOrderMaterial.TotalAmount = this.newOrderMaterial.NetAmount + GstAmount + this.newOrderMaterial.DeliveryCharges;
  }

  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  getGrandTotal(): number {
    return this.Entity.p.MaterialPurchaseOrderDetailsArray.reduce((total: number, item: any) => {
      return this.Entity.p.GrandTotal = total + Number(item.TotalAmount || 0);
    }, 0);
  }

  BackOrder = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
        <br/>
        Are you sure that you want to Cancel this Order Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Stock_Order']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Stock_Order']);
    }
  }

  resetAllControls = () => {

  }

  resetMaterialControls = () => {
    // this.OwnerNameInputControl.control.markAsUntouched();
    // this.OwnerContactNosInputControl.control.markAsUntouched();
    // this.OwnerAddressInputControl.control.markAsUntouched();
    // this.OwnerPincodeInputControl.control.markAsUntouched();

    // this.OwnerNameInputControl.control.markAsPristine();
    // this.OwnerContactNosInputControl.control.markAsPristine();
    // this.OwnerAddressInputControl.control.markAsPristine();
    // this.OwnerPincodeInputControl.control.markAsPristine();
  }
}


