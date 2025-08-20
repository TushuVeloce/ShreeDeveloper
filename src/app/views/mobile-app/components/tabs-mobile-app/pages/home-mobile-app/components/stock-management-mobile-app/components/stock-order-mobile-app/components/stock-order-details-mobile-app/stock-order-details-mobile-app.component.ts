import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialRequisitionStatuses } from 'src/app/classes/domain/domainenums/domainenums';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { QuotedMaterial } from 'src/app/classes/domain/entities/website/stock_management/Quotation/QuotatedMaterial/quotatedmaterial';
import { Order } from 'src/app/classes/domain/entities/website/stock_management/stock_order/order';
import { OrderMaterial, OrderMaterialDetailProps } from 'src/app/classes/domain/entities/website/stock_management/stock_order/OrderMaterial/ordermaterial';
import { FileTransferObject } from 'src/app/classes/infrastructure/filetransferobject';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { BottomsheetMobileAppService } from 'src/app/services/bottomsheet-mobile-app.service';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { Utils } from 'src/app/services/utils.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { Ledger } from 'src/app/classes/domain/entities/website/masters/ledgermaster/ledger';
import { SubLedger } from 'src/app/classes/domain/entities/website/masters/subledgermaster/subledger';

@Component({
  selector: 'app-stock-order-details-mobile-app',
  templateUrl: './stock-order-details-mobile-app.component.html',
  styleUrls: ['./stock-order-details-mobile-app.component.scss'],
  standalone: false
})
export class StockOrderDetailsMobileAppComponent implements OnInit {
  Entity: Order = Order.CreateNewInstance();
  IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Order' | 'Edit Order' = 'New Order';
  IsDropdownDisabled: boolean = false;
  InitialEntity: Order = null as any;
  SiteList: Site[] = [];
  VendorList: Vendor[] = [];
  StockOrderList: OrderMaterial[] = [];
  AllStockOrderList: OrderMaterial[] = [];
  CurrentDate: string | null = null;
  Date: string | null = null;
  ModalEditable: boolean = false;
  OrderMaterialheaders: string[] = ['Material ', 'Unit', 'Requisition Quantity', 'Ordered Quantity', 'Requisition Remaining Quantity', 'Rate', 'Discount Rate', 'GST', 'Delivery Charges', 'Expected Delivery Date', 'Net Amount', 'Total Amount'];
  isOrderMaterialModalOpen: boolean = false;
  newOrderMaterial: OrderMaterialDetailProps = OrderMaterialDetailProps.Blank();
  editingIndex: null | undefined | number
  companyRef: number = 0;
  strCDT: string = '';
  MaterialOrderStatus = MaterialRequisitionStatuses;
  gstName: string = '';
  selectedGST: any[] = [];
  selectedSite: any[] = [];
  SiteName: string = '';
  selectedVendor: any[] = [];
  VendorName: string = '';
  selectedMaterial: any[] = [];
  TotalOrderedQty: number = 0;
  MaterialName: string = '';
  GSTList: any[] = [
    { Name: "None", Ref: 0 },
    { Name: "5%", Ref: 5 },
    { Name: "9%", Ref: 9 },
    { Name: "18%", Ref: 18 },
    { Name: "27%", Ref: 27 }
  ];
  filesToUpload: FileTransferObject[] = [];

  LedgerList: Ledger[] = [];
  selectedLedger: any[] = [];
  LedgerName: string = '';
  SubLedgerList: SubLedger[] = [];
  selectedsubLedger: any[] = [];
  subLedgerName: string = '';

  errors: string = "";
  InvoiceFile: File = null as any
  ImageBaseUrl: string = "";
  TimeStamp = Date.now()
  LoginToken = '';

  imagePreView: string | null = '';
  imagePostView: string = '';
  imagePostViewUrl: string = '';
  selectedFileName: string = '';

  imagePreviewUrl: string | null = null;
  imageUrl: string | null = null;
  ProfilePicFile: File | null = null;
  PurchaseOrderDate: string | null = null;
  ExpectedDeliveryDate: string | null = null;

  constructor(
    private router: Router,
    private appStateManage: AppStateManageService,
    private dtu: DTU,
    private DateconversionService: DateconversionService,
    private bottomsheetMobileAppService: BottomsheetMobileAppService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private utils: Utils,
    private datePipe: DatePipe,
    private baseUrl: BaseUrlService,
  ) { }

  ngOnInit = async () => {
    // await this.loadStockOrderDetailsIfCompanyExists();

  }
  ionViewWillEnter = async () => {
    await this.loadStockOrderDetailsIfCompanyExists();
  }
  ngOnDestroy() {
    // Cleanup if needed
  }

  private async loadStockOrderDetailsIfCompanyExists() {
    try {
      await this.loadingService.show();
      this.companyRef = Number(this.appStateManage.localStorage.getItem('SelectedCompanyRef'));

      if (this.companyRef > 0) {
        this.ImageBaseUrl = this.baseUrl.GenerateImageBaseUrl();
        this.LoginToken = this.appStateManage.getLoginTokenForMobile();
        this.appStateManage.setDropdownDisabled(true);
        await this.getLedgerListByCompanyRef();
        await this.getSiteListByCompanyRef();
        await this.getVendorListByCompanyRef()
        if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
          this.IsNewEntity = false;
          this.DetailsFormTitle = this.IsNewEntity ? 'New Order' : 'Edit Order';
          this.Entity = Order.GetCurrentInstance();
          this.imagePostView = `${this.ImageBaseUrl}${this.Entity.p.MaterialPurchaseInvoicePath}/${this.LoginToken}?${this.TimeStamp}`;
          this.selectedFileName = this.Entity.p.MaterialPurchaseInvoicePath;

          this.selectedSite = [{ p: { Ref: this.Entity.p.SiteRef, Name: this.Entity.p.SiteName } }];
          this.SiteName = this.Entity.p.SiteName;
          this.selectedVendor = [{ p: { Ref: this.Entity.p.VendorRef, Name: this.Entity.p.VendorName } }];
          this.VendorName = this.Entity.p.VendorName;
          this.LedgerName = this.LedgerList.find(item => item.p.Ref == this.Entity.p.LedgerRef)?.p.Name ?? '';
          this.selectedLedger = [{ p: { Ref: this.Entity.p.LedgerRef, Name: this.LedgerName } }];
          await this.getSubLedgerListByLedgerRef(this.Entity.p.LedgerRef);
          this.subLedgerName = this.SubLedgerList.find(item => item.p.Ref == this.Entity.p.SubLedgerRef)?.p.Name ?? '';
          this.selectedLedger = [{ p: { Ref: this.Entity.p.SubLedgerRef, Name: this.subLedgerName } }];
          //.............New Date Format...........//
          this.PurchaseOrderDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.PurchaseOrderDate);

          this.appStateManage.StorageKey.removeItem('Editable');
        } else {
          this.Entity = Order.CreateNewInstance();
          Order.SetCurrentInstance(this.Entity);
          this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
          let parts = this.strCDT.substring(0, 16).split('-');
          // Construct the new date format
          this.CurrentDate = `${parts[0]}-${parts[1]}-${parts[2]}`;
          //.............New Date Format...........//
          this.PurchaseOrderDate = `${parts[0]}-${parts[1]}-${parts[2]}`;
          this.gstName = this.GSTList.find(item => item.Ref == this.GSTList[0].Ref)?.Name ?? '';
          this.selectedGST = [{ p: { Ref: this.newOrderMaterial.Gst, Name: this.gstName } }];

        }
        this.InitialEntity = Object.assign(Order.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as Order;
      } else {
        await this.toastService.present('company not selected', 1000, 'danger');
        await this.haptic.error();
      }
    } catch (error) {
      await this.toastService.present('Failed to load Material Requisition details', 1000, 'danger');
      await this.haptic.error();
    } finally {
      await this.loadingService.hide(); // Also ensure this is awaited
    }
  }

  public async onPurchaseOrderDateChange(date: any): Promise<void> {
    this.PurchaseOrderDate = this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
    this.Entity.p.PurchaseOrderDate = this.PurchaseOrderDate;
  }
  public async onExpectedDeliveryDateChange(date: any): Promise<void> {
    this.ExpectedDeliveryDate = this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
    this.newOrderMaterial.ExpectedDeliveryDate = this.ExpectedDeliveryDate;
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }
  public async onDateChange(date: any): Promise<void> {
    this.Date = this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
    this.Entity.p.PurchaseOrderDate = this.Date;
  }

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  selectedFiles: { file: File; type: 'image' | 'pdf'; preview: string }[] = [];
  maxFiles = 1;
  selectedImage = '';
  isImageModalOpen = false;

  // Check if there are any files to show
  hasFiles(): boolean {
    return this.selectedFiles.length > 0 || !!this.Entity?.p?.MaterialPurchaseInvoicePath;
  }

  // Decide which files to loop in *ngFor
  previewFiles(): { file: File; type: 'image' | 'pdf'; preview: string }[] {
    if (this.selectedFiles.length > 0) return this.selectedFiles;

    if (this.selectedFileName) {
      const isImage = this.isImageFile(this.selectedFileName);
      const dummyFile = new File([], this.selectedFileName);

      return [{
        file: dummyFile,
        type: isImage ? 'image' : 'pdf',
        preview: `${this.ImageBaseUrl}${this.selectedFileName}/${this.LoginToken}?${this.TimeStamp}`,
      }];
    }

    return [];
  }


  async onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (this.selectedFiles.length >= this.maxFiles) {
        this.toastService.present(`Maximum ${this.maxFiles} files allowed.`, 1000, 'warning');
        this.haptic.warning();
        break;
      }

      const fileType = file.type;

      if (fileType.startsWith('image/')) {
        const compressedFile = await this.compressImage(file, 0.7);
        if (!compressedFile) continue;

        if (compressedFile.size / 1024 / 1024 > 2) {
          this.toastService.present('Compressed image still exceeds 2 MB.', 1000, 'warning');
          this.haptic.warning();
          continue;
        }
        const preview = await this.readFileAsDataURL(compressedFile);
        this.selectedFiles.push({ file: compressedFile, type: 'image', preview });

        this.filesToUpload.push(FileTransferObject.FromFile("MaterialPurchaseInvoiceFile", compressedFile, compressedFile.name));
      } else if (fileType === 'application/pdf') {
        if (file.size / 1024 / 1024 > 2) {
          this.toastService.present('PDF size should not exceed 2 MB.', 1000, 'warning');
          this.haptic.warning();
          continue;
        }

        this.selectedFiles.push({ file, type: 'pdf', preview: 'assets/icons/doc-placeholder.png' });
        this.filesToUpload.push(FileTransferObject.FromFile("MaterialPurchaseInvoiceFile", file, file.name));
      } else {
        this.toastService.present('Unsupported file type.', 1000, 'warning');
      }
    }
    input.value = '';
  }

  private compressImage(file: File, quality: number): Promise<File | null> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxWidth = 1024;
          const scale = Math.min(1, maxWidth / img.width);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;

          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(null);

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(blob => {
            if (!blob) return resolve(null);
            resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
          }, 'image/jpeg', quality);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  private readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  isImageFile(input: string | File): boolean {
    const name = typeof input === 'string' ? input : input.name;
    const ext = name.slice(name.lastIndexOf('.')).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(ext);
  }

  viewImage(imageSrc: string) {
    this.selectedImage = imageSrc;
    this.isImageModalOpen = true;
  }

  viewPdf(file: File) {
    const blob = new Blob([file], { type: file.type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name || 'document.pdf';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
    this.filesToUpload.splice(index, 1);
  }

  // For loading previously uploaded file (if editing)
  loadFileFromBackend(imageUrl: string): void {
    if (imageUrl) {
      this.imagePostView = `${this.ImageBaseUrl}${imageUrl}/${this.LoginToken}?${this.TimeStamp}`;
      this.selectedFileName = imageUrl;
    } else {
      this.imagePostView = '';
    }
  }

  fileNavigation(filePath: string) {
    const fullPath = `${this.ImageBaseUrl}${filePath}/${this.LoginToken}?${this.TimeStamp}`;
    window.open(fullPath, '_blank');
  }

  getSiteListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.SiteList = lst;
  }

  getVendorListByCompanyRef = async () => {
    this.Entity.p.VendorRef = 0
    this.Entity.p.VendorName = ''
    this.Entity.p.VendorTradeName = ''
    this.Entity.p.AddressLine1 = ''
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await Vendor.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    // this.VendorList = lst;
    this.VendorList = lst.filter(data => data.p.MaterialListSuppliedByVendor.length > 0);
  }

  getOrderedMaterialList = async () => {
    try {
      await this.loadingService.show();
      if (this.Entity.p.VendorRef <= 0) {
        await this.toastService.present('Vendor not Selected', 1000, 'warning');
        await this.haptic.warning();
        return;
      }
      if (this.Entity.p.SiteRef <= 0) {
        await this.toastService.present('Site not Selected', 1000, 'warning');
        await this.haptic.warning();
        return;
      }
      let lst = await OrderMaterial.FetchEntireListByCompanyRefAndSiteRef(this.companyRef, this.Entity.p.SiteRef, async errMsg => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      }
      );
      this.AllStockOrderList = lst
      this.filterMaterialList();
    } catch (error) {
      await this.toastService.present('Error ' + error, 1000, 'danger');
      await this.haptic.error();
    } finally {
      await this.loadingService.hide();
    }
  }

  getLedgerListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    this.Entity.p.SubLedgerRef = 0
    let lst = await Ledger.FetchEntireListByCompanyRef(this.companyRef,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      });
    this.LedgerList = lst
  };

  getSubLedgerListByLedgerRef = async (ledgerref: number) => {
    if (ledgerref <= 0) {
      await this.toastService.present('Ledger not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await SubLedger.FetchEntireListByLedgerRef(ledgerref, async errMsg => {
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();

    });
    this.SubLedgerList = lst;
  }

  filterMaterialList() {
    const usedRefs = this.Entity.p.MaterialPurchaseOrderDetailsArray.map(item => item.MaterialRef);
    this.StockOrderList = this.AllStockOrderList.filter(
      material => !usedRefs.includes(material.p.MaterialRef)
    );
  }

  onVendorSelection = (VendorRef: number) => {
    const SingleRecord = this.VendorList.filter(data => data.p.Ref == VendorRef);
    this.Entity.p.VendorTradeName = SingleRecord[0].p.TradeName
    this.Entity.p.AddressLine1 = SingleRecord[0].p.AddressLine1
  }

  onMaterialSelection = (MaterialRef: number) => {
    const SingleRecord = this.StockOrderList.filter(data => data.p.MaterialRef == MaterialRef);
    this.newOrderMaterial.UnitName = SingleRecord[0].p.UnitName
    this.newOrderMaterial.MaterialName = SingleRecord[0].p.MaterialName
    this.newOrderMaterial.RequisitionQty = SingleRecord[0].p.RequisitionQty
    this.newOrderMaterial.MaterialQuotationDetailRef = SingleRecord[0].p.Ref
    this.TotalOrderedQty = SingleRecord[0].p.TotalOrderedQty
    this.newOrderMaterial.TotalOrderedQty = SingleRecord[0].p.TotalOrderedQty;
    
    this.newOrderMaterial.OrderedQty = 0;
    this.newOrderMaterial.ExtraOrderedQty = 0;
    this.newOrderMaterial.Rate = 0;
    this.newOrderMaterial.DiscountedRate = 0;
    this.newOrderMaterial.DiscountOnNetAmount = 0;
    this.newOrderMaterial.NetAmount = 0;
    this.newOrderMaterial.Gst = 0;
    this.newOrderMaterial.DeliveryCharges = 0;
    this.newOrderMaterial.ExpectedDeliveryDate = '';
    this.ExpectedDeliveryDate = null;
    this.newOrderMaterial.TotalAmount = 0;
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
          this.toastService.present('Only PDF or image files are supported.', 1000, 'warning');
          this.haptic.warning();
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

  openModal = async (type: number) => {
    if (this.Entity.p.SiteRef <= 0) {
      this.toastService.present('Site not Selected', 1000, 'warning');
      this.haptic.warning();
      return;
    }
    if (this.Entity.p.VendorRef <= 0) {
      this.toastService.present('Vendor not Selected', 1000, 'warning');
      this.haptic.warning();
      return;
    }
    this.ModalEditable = false;
    if (type === 100) this.isOrderMaterialModalOpen = true;
    await this.getOrderedMaterialList();
  }

  closeModal = async (type: number) => {
    if (type === 100) {
      const keysToCheck = ['MaterialRef', 'OrderedQty', 'Rate', 'DiscountedRate', 'DeliveryCharges', 'ExpectedDeliveryDate'] as const;

      const hasData = keysToCheck.some(key => {
        const value = (this.newOrderMaterial as any)[key];
        return value !== 0 && value !== undefined && value !== null && value.toString().trim() !== '';
      });

      if (hasData) {
        await this.alertService.presentDynamicAlert({
          header: 'Warning',
          subHeader: 'Confirmation needed',
          message: 'You have unsaved data. Are you sure you want to go back? All data will be lost.',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'custom-cancel',
              handler: () => {
              }
            },
            {
              text: 'Yes, Close',
              cssClass: 'custom-confirm',
              handler: () => {
                this.isOrderMaterialModalOpen = false;
                this.ModalEditable = false;
                this.newOrderMaterial = OrderMaterialDetailProps.Blank();
                this.selectedGST = [];
                this.selectedMaterial = [];
                this.ExpectedDeliveryDate = null;
                this.MaterialName = '';
                this.gstName = '';
                this.haptic.success();
              }
            }
          ]
        });
      } else {
        this.isOrderMaterialModalOpen = false;
        this.ModalEditable = false;
        this.newOrderMaterial = OrderMaterialDetailProps.Blank();
      }
    }
  };


  async addOrderMaterial() {
    try {
      console.log("this.ExpectedDeliveryDate", this.ExpectedDeliveryDate);
      if (this.newOrderMaterial.MaterialQuotationDetailRef == 0) {
        this.toastService.present('Material Name cannot be blank.', 1000, 'warning');
        this.haptic.warning();
        return;
      }
      if (this.newOrderMaterial.OrderedQty == 0) {
        this.toastService.present('Ordered Quantity cannot be blank.', 1000, 'warning');
        this.haptic.warning();
        return;
      }
      if (this.newOrderMaterial.Rate == 0) {
        this.toastService.present('Rate cannot be blank.', 1000, 'warning');
        this.haptic.warning();
        return;
      }

      await this.loadingService.show();
      if (this.editingIndex !== null && this.editingIndex !== undefined && this.editingIndex >= 0) {
        this.Entity.p.MaterialPurchaseOrderDetailsArray[this.editingIndex] = { ...this.newOrderMaterial };
        this.newOrderMaterial.ExpectedDeliveryDate = this.dtu.ConvertStringDateToFullFormat(this.ExpectedDeliveryDate ? this.ExpectedDeliveryDate : '');

        await this.toastService.present('Material updated successfully', 1000, 'success');
        this.newOrderMaterial = OrderMaterialDetailProps.Blank();
        this.editingIndex = null;
        this.isOrderMaterialModalOpen = false;
        this.selectedMaterial = [];
        this.selectedGST = [];
        this.MaterialName = '';
        this.gstName = '';
        this.ExpectedDeliveryDate = null;
        await this.haptic.success();

      } else {
        let OrderMaterialInstance = new OrderMaterial(this.newOrderMaterial, true);
        let OrderInstance = new Order(this.Entity.p, true);
        await OrderMaterialInstance.EnsurePrimaryKeysWithValidValues();
        await OrderInstance.EnsurePrimaryKeysWithValidValues();

        this.newOrderMaterial.MaterialPurchaseOrderRef = this.Entity.p.Ref;
        this.Entity.p.MaterialPurchaseOrderDetailsArray.push({ ...OrderMaterialInstance.p });
        this.selectedGST = [{ p: { Ref: this.newOrderMaterial.Gst, Name: this.newOrderMaterial.Gst } }];

        await this.toastService.present('Material added successfully', 1000, 'success');
        this.newOrderMaterial = OrderMaterialDetailProps.Blank();
        this.editingIndex = null;
        this.isOrderMaterialModalOpen = false;
        this.selectedMaterial = [];
        this.selectedGST = [];
        this.MaterialName = '';
        this.gstName = '';
        this.ExpectedDeliveryDate = null;
        await this.haptic.success();
      }
    } catch (error) {
      await this.toastService.present('Error ' + error, 1000, 'danger');
      await this.haptic.error();
    }finally{
      await this.loadingService.hide();
    }
  }

  editOrderMaterial(index: number) {
    this.isOrderMaterialModalOpen = true
    this.newOrderMaterial = { ...this.Entity.p.MaterialPurchaseOrderDetailsArray[index] }
    if (!this.IsNewEntity) {
      this.newOrderMaterial.TotalOrderedQty = 0;
    }
    this.editingIndex = index;
    this.ModalEditable = true;
    this.ExpectedDeliveryDate = this.Entity.p.MaterialPurchaseOrderDetailsArray[index].ExpectedDeliveryDate? this.dtu.ConvertStringDateToShortFormat(this.Entity.p.MaterialPurchaseOrderDetailsArray[index].ExpectedDeliveryDate):null;
  }

  async removeOrderMaterial(index: number) {
    await this.alertService.presentDynamicAlert({
      header: 'Delete',
      subHeader: 'Confirmation needed',
      message: 'Are you sure that you want to DELETE this Order Material?',
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
          handler: () => {
            this.Entity.p.MaterialPurchaseOrderDetailsArray.splice(index, 1);
            this.haptic.success();
          }
        }
      ]
    });
  }


  SaveOrder = async () => {
    this.Entity.p.CompanyRef = this.companyRef;
    this.newOrderMaterial.MaterialPurchaseOrderRef = this.Entity.p.Ref
    this.Entity.p.UpdatedBy = Number(this.appStateManage.localStorage.getItem('EmployeeRef'))
    this.Entity.p.CreatedBy = Number(this.appStateManage.localStorage.getItem('EmployeeRef'))
    this.Entity.p.PurchaseOrderDate = this.dtu.ConvertStringDateToFullFormat(this.PurchaseOrderDate ? this.PurchaseOrderDate : '');

    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];

    if (this.Entity.p.MaterialPurchaseOrderStatus == MaterialRequisitionStatuses.Ordered) {
      this.Entity.p.MaterialPurchaseOrderDetailsArray.map((data) => {
        return data.MaterialPurchaseDetailStatus = MaterialRequisitionStatuses.Ordered;
      })
    }

    let tr = await this.utils.SavePersistableEntities(entitiesToSave, this.filesToUpload);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      await this.toastService.present(tr.Message, 1000, 'danger');
      await this.haptic.error();
      return;
    } else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        await this.toastService.present('Order saved successfully', 1000, 'success');
        await this.haptic.success();
        this.Entity = Order.CreateNewInstance();
      } else {
        await this.toastService.present('Order Updated successfully', 1000, 'success');
        await this.haptic.success();
      }
      await this.router.navigate(['/mobile-app/tabs/dashboard/stock-management/stock-order'], { replaceUrl: true });
    }
  };

  // CalculateNetAmountAndTotalAmount = async () => {
  //   this.newOrderMaterial.TotalOrderedQty = 0;
  //   this.newOrderMaterial.TotalOrderedQty = this.TotalOrderedQty + this.newOrderMaterial.OrderedQty;

  //   if (this.newOrderMaterial.TotalOrderedQty > this.newOrderMaterial.RequisitionQty) {
  //     this.newOrderMaterial.RequisitionRemainingQty = 0;
  //     this.newOrderMaterial.ExtraOrderedQty = this.newOrderMaterial.TotalOrderedQty - this.newOrderMaterial.RequisitionQty;
  //   } else {
  //     this.newOrderMaterial.RequisitionRemainingQty = this.newOrderMaterial.RequisitionQty - this.newOrderMaterial.TotalOrderedQty;
  //     this.newOrderMaterial.ExtraOrderedQty = 0;
  //   }



  //   if (this.newOrderMaterial.DiscountedRate == 0) {
  //     this.newOrderMaterial.NetAmount = (this.newOrderMaterial.Rate * this.newOrderMaterial.OrderedQty);
  //   } else {
  //     this.newOrderMaterial.NetAmount = (this.newOrderMaterial.DiscountedRate * this.newOrderMaterial.OrderedQty);
  //   }
  //   let GstAmount = (this.newOrderMaterial.NetAmount / 100) * this.newOrderMaterial.Gst;
  //   this.newOrderMaterial.TotalAmount = this.newOrderMaterial.NetAmount + GstAmount + this.newOrderMaterial.DeliveryCharges;
  // }

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
      this.newOrderMaterial.NetAmount = (this.newOrderMaterial.Rate * this.newOrderMaterial.OrderedQty) - this.newOrderMaterial.DiscountOnNetAmount;
    } else {
      this.newOrderMaterial.NetAmount = (this.newOrderMaterial.DiscountedRate * this.newOrderMaterial.OrderedQty) - this.newOrderMaterial.DiscountOnNetAmount;
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
  public async selectsubLedgerBottomsheet(): Promise<void> {
    try {
      const options = this.SubLedgerList;
      this.openSelectModal(options, this.selectedsubLedger, false, 'Select Sub Ledger', 1, (selected) => {
        this.selectedsubLedger = selected;
        this.Entity.p.SubLedgerRef = selected[0].p.Ref;
        this.subLedgerName = selected[0].p.Name;
      });
    } catch (error) {
      await this.toastService.present('Error ' + error, 1000, 'danger');
      await this.haptic.error();
    }
  }

  public async selectLedgerBottomsheet(): Promise<void> {
    try {
      const options = this.LedgerList;
      this.openSelectModal(options, this.selectedLedger, false, 'Select Ledger', 1, (selected) => {
        this.selectedLedger = selected;
        this.Entity.p.LedgerRef = selected[0].p.Ref;
        this.LedgerName = selected[0].p.Name;
        this.selectedsubLedger = [];
        this.subLedgerName = '';
        this.getSubLedgerListByLedgerRef(this.Entity.p.LedgerRef);
      });
    } catch (error) {
      await this.toastService.present('Error ' + error, 1000, 'danger');
      await this.haptic.error();
    }
  }


  public async selectGSTBottomsheet(): Promise<void> {
    try {
      const options = this.GSTList.map((item) => ({ p: item }));
      this.openSelectModal(options, this.selectedGST, false, 'Select GST', 1, (selected) => {
        this.selectedGST = selected;
        this.newOrderMaterial.Gst = selected[0].p.Ref;
        this.gstName = selected[0].p.Name;
        this.CalculateNetAmountAndTotalAmount()
      });
    } catch (error) {
      await this.toastService.present('Error ' + error, 1000, 'danger');
      await this.haptic.error();
    }
  }

  public async selectMaterialBottomsheet(): Promise<void> {
    try {
      // Reformat the options with Name and Ref
      const options = this.StockOrderList.map(item => ({
        ...item,
        p: {
          ...item.p,
          Name: item.p.MaterialName, // Add 'Name'
          Ref: item.p.MaterialRef   // Add 'Ref'
        }
      }));

      this.openSelectModal(options, this.selectedMaterial, false, 'Select Material', 1, (selected) => {
        this.selectedMaterial = selected;

        // Use standardized keys now
        this.MaterialName = selected[0].p.Name;
        this.newOrderMaterial.MaterialName = selected[0].p.Name;
        this.newOrderMaterial.MaterialRef = selected[0].p.Ref;

        this.onMaterialSelection(this.newOrderMaterial.MaterialRef);
      });
    } catch (error) {
      await this.toastService.present('Error ' + error, 1000, 'danger');
      await this.haptic.error();
    }
  }


  public async selectVendorBottomsheet(): Promise<void> {
    try {
      const options = this.VendorList;
      this.openSelectModal(options, this.selectedVendor, false, 'Select Vendor Name', 1, (selected) => {
        this.selectedVendor = selected;
        this.Entity.p.VendorRef = selected[0].p.Ref;
        this.Entity.p.VendorName = selected[0].p.Name;
        this.Entity.p.VendorTradeName = selected[0].p.TradeName;
        this.VendorName = selected[0].p.Name;
        this.onVendorSelection(selected[0].p.Ref)
      });
    } catch (error) {
      await this.toastService.present('Error ' + error, 1000, 'danger');
      await this.haptic.error();
    }
  }

  public async selectSiteBottomsheet(): Promise<void> {
    try {
      const options = this.SiteList;
      this.openSelectModal(options, this.selectedSite, false, 'Select Site', 1, (selected) => {
        this.selectedSite = selected;
        this.Entity.p.SiteRef = selected[0].p.Ref;
        this.SiteName = selected[0].p.Name;
      });
    } catch (error) {
      await this.toastService.present('Error ' + error, 1000, 'danger');
      await this.haptic.error();
    }
  }
  private async openSelectModal(
    dataList: any[],
    selectedItems: any[],
    multiSelect: boolean,
    title: string,
    MaxSelection: number,
    updateCallback: (selected: any[]) => void
  ): Promise<void> {
    const selected = await this.bottomsheetMobileAppService.openSelectModal(dataList, selectedItems, multiSelect, title, MaxSelection);
    if (selected) updateCallback(selected);
  }
  isDataFilled(): boolean {
    const emptyEntity = QuotedMaterial.CreateNewInstance();
    return !this.deepEqualIgnoringKeys(this.Entity, emptyEntity, ['p.PurchaseOrderDate']);
  }

  deepEqualIgnoringKeys(obj1: any, obj2: any, ignorePaths: string[]): boolean {
    const clean = (obj: any, path = ''): any => {
      if (obj === null || typeof obj !== 'object') return obj;

      const result: any = Array.isArray(obj) ? [] : {};
      for (const key in obj) {
        const fullPath = path ? `${path}.${key}` : key;
        if (ignorePaths.includes(fullPath)) continue;
        result[key] = clean(obj[key], fullPath);
      }
      return result;
    };

    const cleanedObj1 = clean(obj1);
    const cleanedObj2 = clean(obj2);

    return JSON.stringify(cleanedObj1) === JSON.stringify(cleanedObj2);
  }

  goBack = async () => {
    // Replace this with your actual condition to check if data is filled
    const isDataFilled = this.isDataFilled(); // Implement this function based on your form

    if (isDataFilled) {
      this.alertService.presentDynamicAlert({
        header: 'Warning',
        subHeader: 'Confirmation needed',
        message: 'You have unsaved data. Are you sure you want to go back? All data will be lost.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'custom-cancel',
            handler: () => {
              console.log('User cancelled.');
            }
          },
          {
            text: 'Yes, Close',
            cssClass: 'custom-confirm',
            handler: () => {
              this.router.navigate(['/mobile-app/tabs/dashboard/stock-management/stock-order'], { replaceUrl: true });
              this.haptic.success();
              console.log('User confirmed.');
            }
          }
        ]
      });
    } else {
      this.router.navigate(['/mobile-app/tabs/dashboard/stock-management/stock-order'], { replaceUrl: true });
      this.haptic.success();
    }
  }

}
