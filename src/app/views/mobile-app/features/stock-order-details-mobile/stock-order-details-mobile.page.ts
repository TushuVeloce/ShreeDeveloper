import { Component, effect, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { Order } from 'src/app/classes/domain/entities/website/stock_management/stock_order/order';
import { OrderMaterial, OrderMaterialDetailProps } from 'src/app/classes/domain/entities/website/stock_management/stock_order/OrderMaterial/ordermaterial';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BottomsheetMobileAppService } from 'src/app/services/bottomsheet-mobile-app.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { ToastService } from '../../core/toast.service';
import { HapticService } from '../../core/haptic.service';
import { AlertService } from '../../core/alert.service';
import { LoadingService } from '../../core/loading.service';
import { Utils } from 'src/app/services/utils.service';
import { DatePipe } from '@angular/common';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { MaterialRequisitionStatuses } from 'src/app/classes/domain/domainenums/domainenums';
import { FileTransferObject } from 'src/app/classes/infrastructure/filetransferobject';
import { QuotedMaterial } from 'src/app/classes/domain/entities/website/stock_management/Quotation/QuotatedMaterial/quotatedmaterial';

@Component({
  selector: 'app-stock-order-details-mobile',
  templateUrl: './stock-order-details-mobile.page.html',
  styleUrls: ['./stock-order-details-mobile.page.scss'],
  standalone: false
})
export class StockOrderDetailsMobilePage implements OnInit {
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
  OrderDate: string | null = null;
  CurrentDate: string | null = null;
  Date: string | null = null;
  ModalEditable: boolean = false;
  ExpectedDeliveryDate: string = '';
  OrderMaterialheaders: string[] = ['Sr.No.', 'Material ', 'Unit', 'Requisition Quantity', 'Quotation Quantity', 'Ordered Quantity', 'Quotation Remaining Quantity', 'Requisition Remaining Quantity', 'Rate', 'Discount Rate', 'GST', 'Delivery Charges', 'Expected Delivery Date', 'Net Amount', 'Total Amount', 'Action'];
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
  MaterialName: string = '';
  GSTList: any[] = [
    { Name: "None", Ref: 0 },
    { Name: "5%", Ref: 5 },
    { Name: "9%", Ref: 9 },
    { Name: "18%", Ref: 18 },
    { Name: "27%", Ref: 27 }
  ];


  errors: string = "";
  InvoiceFile: File = null as any
  ImageBaseUrl: string = "";
  TimeStamp = Date.now()
  LoginToken = '';

  imagePreView: string | null = '';
  imagePostView: string = '';
  imagePostViewUrl: string = '';
  selectedFileName: string = '';


  constructor(
    private router: Router,
    private appStateManage: AppStateManageService,
    private companystatemanagement: CompanyStateManagement,
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
    await this.loadMaterialRequisitionDetailsIfCompanyExists();

  }
  ionViewWillEnter = async () => {
    await this.loadMaterialRequisitionDetailsIfCompanyExists();
  }
  ngOnDestroy() {
    // Cleanup if needed
  }

  private async loadMaterialRequisitionDetailsIfCompanyExists() {
    try {
      await this.loadingService.show(); // Awaiting this is critical
      this.companyRef = Number(this.appStateManage.localStorage.getItem('SelectedCompanyRef'));

      if (this.companyRef > 0) {
        this.ImageBaseUrl = this.baseUrl.GenerateImageBaseUrl();

        this.LoginToken = this.appStateManage.getLoginToken();
        this.appStateManage.setDropdownDisabled(true);
        await this.getSiteListByCompanyRef();
        await this.getVendorListByCompanyRef()
        if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
          this.IsNewEntity = false;
          this.DetailsFormTitle = this.IsNewEntity ? 'New Order' : 'Edit Order';
          this.Entity = Order.GetCurrentInstance();
          this.imagePostView = `${this.ImageBaseUrl}${this.Entity.p.InvoicePath}/${this.LoginToken}?${this.TimeStamp}`;
          this.selectedFileName = this.Entity.p.InvoicePath;

          this.OrderDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date);
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

      } else {
        await this.toastService.present('company not selected', 1000, 'danger');
        await this.haptic.error();
      }
    } catch (error) {
      console.error('Error loading Material Requisition details:', error);
      await this.toastService.present('Failed to load Material Requisition details', 1000, 'danger');
      await this.haptic.error();
    } finally {
      await this.loadingService.hide(); // Also ensure this is awaited
    }
  }


  getSiteListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      // await this.uiUtils.showErrorToster('Company not Selected');
      await this.toastService.present('Company not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      // await this.uiUtils.showErrorMessage('Error', errMsg)
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
      // await this.uiUtils.showErrorToster('Company not Selected');
      await this.toastService.present('Company not Selected', 1000, 'warning');
      await this.haptic.error();
      return;
    }
    let lst = await Vendor.FetchEntireListByCompanyRef(this.companyRef, async errMsg =>{
      //  await this.uiUtils.showErrorMessage('Error', errMsg)
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
      });
    this.VendorList = lst;
  }

  getMaterialRequisitionListByVendorRefAndSiteRef = async () => {
    if (this.Entity.p.VendorRef <= 0) {
      // await this.uiUtils.showErrorToster('Vendor not Selected');
      await this.toastService.present('Vendor not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    if (this.Entity.p.SiteRef <= 0) {
      // await this.uiUtils.showErrorToster('Site not Selected');
      await this.toastService.present('Site not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await OrderMaterial.FetchEntireListByCompanyVendorAndSiteRef(this.companyRef, this.Entity.p.VendorRef, this.Entity.p.SiteRef, async errMsg => {
      // await this.uiUtils.showErrorMessage('Error', errMsg)
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    console.log('lst :', lst);
    this.AllMaterialRequisitionList = lst;
    this.filterMaterialList();
  }

  filterMaterialList() {
    const usedRefs = this.Entity.p.MaterialStockOrderDetailsArray.map(item => item.MaterialRequisitionDetailsRef);
    this.MaterialRequisitionList = this.AllMaterialRequisitionList.filter(
      material => !usedRefs.includes(material.p.Ref)
    );
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }
  public async onDateChange(date: any): Promise<void> {
    this.Date = this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
    this.Entity.p.Date = this.Date;
  }
  public async onExpectedDeliveryDateChange(date: any): Promise<void> {
    this.Date = this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
    // this.Entity.p.MaterialQuotationDetailsArray[this.editingIndex].ExpectedDeliveryDate = this.Date;
    this.newOrderMaterial  .ExpectedDeliveryDate = this.Date;
  }

  onVendorSelection = (VendorRef: number) => {
    const SingleRecord = this.VendorList.filter(data => data.p.Ref == VendorRef);
    this.Entity.p.VendorTradeName = SingleRecord[0].p.TradeName
    this.Entity.p.AddressLine1 = SingleRecord[0].p.AddressLine1
  }

  onMaterialSelection = (MaterialRef: number) => {
    const SingleRecord = this.MaterialRequisitionList.filter(data => data.p.MaterialRequisitionDetailsRef == MaterialRef);
    this.newOrderMaterial.UnitName = SingleRecord[0].p.UnitName
    this.newOrderMaterial.QuotationOrderedQty = SingleRecord[0].p.OrderedQty
    this.newOrderMaterial.MaterialName = SingleRecord[0].p.MaterialName
    this.newOrderMaterial.MaterialQuotationDetailsRef = SingleRecord[0].p.Ref
    this.newOrderMaterial.TotalOrderedQty = SingleRecord[0].p.TotalOrderedQty
  }

  // Trigger file input when clicking the image
  triggerFileInput(): void {
    // this.fileInputRef.nativeElement.click();
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
          this.Entity.p.InvoicePath = '';
        } else {
          // this.uiUtils.showWarningToster('Only PDF or image files are supported.')
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

  openModal(type: number) {
    if (this.Entity.p.SiteRef <= 0) {
      // this.uiUtils.showErrorToster('Site not Selected');
      this.toastService.present('Site not Selected', 1000, 'warning');
      this.haptic.warning();
      return;
    }
    if (this.Entity.p.VendorRef <= 0) {
      // this.uiUtils.showErrorToster('Vendor not Selected');
      this.toastService.present('Vendor not Selected', 1000, 'warning');
      this.haptic.warning();
      return;
    }
    this.ModalEditable = false;
    this.getMaterialRequisitionListByVendorRefAndSiteRef();
    if (type === 100) this.isOrderMaterialModalOpen = true;
  }

  closeModal = async (type: number) => {
    if (type === 100) {
      const keysToCheck = ['Name', 'MaterialRequisitionDetailsRef', 'OrderedQty', 'Rate', 'DiscountedRate', 'Gst', 'DeliveryCharges', 'ExpectedDeliveryDate'] as const;

      const hasData = keysToCheck.some(
        key => (this.newOrderMaterial as any)[key]?.toString().trim()
      );

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
                console.log('User cancelled.');
              }
            },
            {
              text: 'Yes, Close',
              cssClass: 'custom-confirm',
              handler: () => {
                this.isOrderMaterialModalOpen = false;
                this.newOrderMaterial = OrderMaterialDetailProps.Blank();
                this.haptic.success();
                console.log('User confirmed.');
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
    if (this.newOrderMaterial.MaterialRequisitionDetailsRef == 0) {
      // return this.uiUtils.showWarningToster('Material Name cannot be blank.');
      this.toastService.present('Material Name cannot be blank.', 1000, 'warning');
      this.haptic.warning();
      return;
    }
    if (this.newOrderMaterial.OrderedQty == 0) {
      // return this.uiUtils.showWarningToster('Ordered Quantity cannot be blank.');
      this.toastService.present('Ordered Quantity cannot be blank.', 1000, 'warning');
      this.haptic.warning();
      return;
    }
    if (this.newOrderMaterial.Rate == 0) {
      // return this.uiUtils.showWarningToster('Rate cannot be blank.');
      this.toastService.present('Rate cannot be blank.', 1000, 'warning');
      this.haptic.warning();
      return;
    }

    this.newOrderMaterial.ExpectedDeliveryDate = this.dtu.ConvertStringDateToFullFormat(this.ExpectedDeliveryDate);
    this.ExpectedDeliveryDate = '';
    if (this.editingIndex !== null && this.editingIndex !== undefined && this.editingIndex >= 0) {
      this.Entity.p.MaterialStockOrderDetailsArray[this.editingIndex] = { ...this.newOrderMaterial };
      // await this.uiUtils.showSuccessToster('Material updated successfully');
      await this.toastService.present('Material updated successfully', 1000, 'success');
      this.haptic.success();
      this.isOrderMaterialModalOpen = false;

    } else {
      let OrderMaterialInstance = new OrderMaterial(this.newOrderMaterial, true);
      let OrderInstance = new Order(this.Entity.p, true);
      await OrderMaterialInstance.EnsurePrimaryKeysWithValidValues();
      await OrderInstance.EnsurePrimaryKeysWithValidValues();

      this.newOrderMaterial.MaterialStockOrderRef = this.Entity.p.Ref;
      this.Entity.p.MaterialStockOrderDetailsArray.push({ ...OrderMaterialInstance.p });
      this.filterMaterialList();
      // await this.uiUtils.showSuccessToster('Material added successfully');
      await this.toastService.present('Material added successfully', 1000, 'success');
      this.haptic.success();
    }
    this.newOrderMaterial = OrderMaterialDetailProps.Blank();
    this.editingIndex = null;
  }

  editOrderMaterial(index: number) {
    this.isOrderMaterialModalOpen = true
    this.newOrderMaterial = { ...this.Entity.p.MaterialStockOrderDetailsArray[index] }
    if (!this.IsNewEntity) {
      this.newOrderMaterial.TotalOrderedQty = 0;
      this.newOrderMaterial.QuotationRemainingQty = 0;
    }
    this.editingIndex = index;
    this.ModalEditable = true;
    this.ExpectedDeliveryDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.MaterialStockOrderDetailsArray[index].ExpectedDeliveryDate);
    this.getMaterialRequisitionListByVendorRefAndSiteRef();
  }

  async removeOrderMaterial(index: number) {
    this.alertService.presentDynamicAlert({
      header: 'Delete',
      subHeader: 'Confirmation needed',
      message: 'Are you sure that you want to DELETE this Order Material?',
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
            this.Entity.p.MaterialStockOrderDetailsArray.splice(index, 1);
            this.filterMaterialList();
            this.haptic.success();
            console.log('User confirmed.');
          }
        }
      ]
    });
  }

  SaveOrder = async () => {
    let lstFTO: FileTransferObject[] = [];
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.newOrderMaterial.MaterialStockOrderRef = this.Entity.p.Ref
    this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    this.Entity.p.Date = this.dtu.ConvertStringDateToFullFormat(this.OrderDate ?? '');

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
    let tr = await this.utils.SavePersistableEntities(entitiesToSave, lstFTO);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      // this.uiUtils.showErrorMessage('Error', tr.Message)
      await this.toastService.present(tr.Message, 1000, 'danger');
      await this.haptic.error();
      return;
    } else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        // await this.uiUtils.showSuccessToster('Order saved successfully');
        await this.toastService.present('Order saved successfully', 1000, 'success');
        await this.haptic.success();
        this.Entity = Order.CreateNewInstance();
      } else {
        // await this.uiUtils.showSuccessToster('Order Updated successfully');
        this.toastService.present('Order Updated successfully', 1000, 'success');
        this.haptic.success();
      }
      await this.router.navigate(['/homepage/Website/Stock_Order']);
    }
  };

  CalculateNetAmountAndTotalAmount = async () => {
    if (this.newOrderMaterial.OrderedQty > this.newOrderMaterial.QuotationOrderedQty) {
      this.newOrderMaterial.ExtraOrderedQty = (this.newOrderMaterial.OrderedQty + this.newOrderMaterial.TotalOrderedQty) - this.newOrderMaterial.QuotationOrderedQty;
      // this.uiUtils.showWarningToster('Ordered Qty is greater then Required Qty');
    } else {
      this.newOrderMaterial.ExtraOrderedQty = 0;
    }

    if (this.newOrderMaterial.OrderedQty < this.newOrderMaterial.QuotationOrderedQty) {
      this.newOrderMaterial.QuotationRemainingQty = this.newOrderMaterial.QuotationOrderedQty - (this.newOrderMaterial.OrderedQty + this.newOrderMaterial.TotalOrderedQty);
    } else {
      this.newOrderMaterial.QuotationRemainingQty = 0;
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
    return this.Entity.p.MaterialStockOrderDetailsArray.reduce((total: number, item: any) => {
      return this.Entity.p.GrandTotal = total + Number(item.TotalAmount || 0);
    }, 0);
  }

  BackOrder = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      // await this.uiUtils.showConfirmationMessage('Cancel',
      //   `This process is IRREVERSIBLE!
      //   <br/>
      //   Are you sure that you want to Cancel this Order Form?`,
      //   async () => {
      //     await this.router.navigate(['/homepage/Website/Stock_Order']);
      //   });
    } else {
      await this.router.navigate(['/homepage/Website/Stock_Order']);
    }
  }

  public async selectGSTBottomsheet(): Promise<void> {
    try {
      const options = this.GSTList;
      this.openSelectModal(options, this.selectedGST, false, 'Select GST', 1, (selected) => {
        this.selectedGST = selected;
        this.newOrderMaterial.Gst = selected[0].p.Ref;
        this.gstName = selected[0].p.Name;
      });
    } catch (error) {

    }
  }

  public async selectMaterialBottomsheet(): Promise<void> {
    try {
      const options = this.MaterialRequisitionList;
      this.openSelectModal(options, this.selectedMaterial, false, 'Select Material', 1, (selected) => {
        this.selectedVendor = selected;
        this.Entity.p.VendorRef = selected[0].p.Ref;
        this.VendorName = selected[0].p.Name;
      });
    } catch (error) {

    }
  }
  
  public async selectVendorBottomsheet(): Promise<void> {
    try {
      const options = this.VendorList;
      this.openSelectModal(options, this.selectedVendor, false, 'Select Vendor Name', 1, (selected) => {
        this.selectedVendor = selected;
        this.Entity.p.VendorRef = selected[0].p.Ref;
        this.VendorName = selected[0].p.Name;
        // this.VendorRef = selected[0].p.Ref;
        this.onVendorSelection(selected[0].p.Ref)
      });
    } catch (error) {

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
    console.log('emptyEntity :', emptyEntity);
    console.log('this Entity :', this.Entity);
    return !this.deepEqualIgnoringKeys(this.Entity, emptyEntity, ['p.Date']);
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
              this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/vendor-quotation'], { replaceUrl: true });
              this.haptic.success();
              console.log('User confirmed.');
            }
          }
        ]
      });
    } else {
      this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/vendor-quotation'], { replaceUrl: true });
      this.haptic.success();
    }
  }

}
