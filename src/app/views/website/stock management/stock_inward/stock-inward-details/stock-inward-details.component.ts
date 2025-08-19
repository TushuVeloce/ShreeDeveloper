import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { MaterialRequisitionStatuses } from 'src/app/classes/domain/domainenums/domainenums';
import { Material } from 'src/app/classes/domain/entities/website/masters/material/material';
import { MaterialFromOrder } from 'src/app/classes/domain/entities/website/masters/material/orderedmaterial/materialfromorder';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { PurchaseOrderChalanFetchRequest } from 'src/app/classes/domain/entities/website/stock_management/stock_inward/actualstagechalan/purchaseorderfetchrequest';
import { InwardMaterial, InwardMaterialDetailProps } from 'src/app/classes/domain/entities/website/stock_management/stock_inward/inwardmaterial/inwardmaterial';
import { StockInward } from 'src/app/classes/domain/entities/website/stock_management/stock_inward/stockinward';
import { MaterialStockOrder } from 'src/app/classes/domain/entities/website/stock_management/stock_order/materialstockorder/materialstockorder';
import { Order } from 'src/app/classes/domain/entities/website/stock_management/stock_order/order';
import { FileTransferObject } from 'src/app/classes/infrastructure/filetransferobject';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-stock-inward-details',
  standalone: false,
  templateUrl: './stock-inward-details.component.html',
  styleUrls: ['./stock-inward-details.component.scss'],
})
export class StockInwardDetailsComponent implements OnInit {
  Entity: StockInward = StockInward.CreateNewInstance();
  IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Stock Inward' | 'Edit Stock Inward' = 'New Stock Inward';
  IsDropdownDisabled: boolean = false;
  InitialEntity: StockInward = null as any;
  SiteList: Site[] = [];
  VendorList: Vendor[] = [];
  PurchaseOrderIdList: Order[] = [];
  MaterialList: MaterialFromOrder[] = [];
  MaterialListOriginal: MaterialFromOrder[] = [];
  localEstimatedStartingDate: string = '';
  localEstimatedEndDate: string = '';
  ModalEditable: boolean = false;
  materialheaders: string[] = ['Sr.No.', 'Date', 'Material Name ', 'Unit', 'Ordered Qty.', 'Inward Qty.', 'Remaining Qty.', 'Rate', 'Discount Rate', 'GST', 'Delivery Charges', 'Net Discount', 'Net Amount', 'Total Amount', 'Action'];
  ismaterialModalOpen: boolean = false;
  newInward: InwardMaterialDetailProps = InwardMaterialDetailProps.Blank();
  editingIndex: null | undefined | number
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  InitialTableRefs: number[] = [];
  shouldFilterDropdown = false; // 🔁 Used to toggle filtering after add
  SessionAddedRefs: number[] = [];
  PurchaseOrderDate: string = ''
  InwardDate: string = ''

  strCDT: string = ''
  today: string = new Date().toISOString().split('T')[0];
  NewRemainingQty: number = 0;

  errors: string = "";
  InvoiceFile: File = null as any
  ImageBaseUrl: string = "";
  TimeStamp = Date.now()
  LoginToken = '';

  imagePreView: string | null = '';
  imagePostView: string = '';
  imagePostViewUrl: string = '';
  selectedFileName: string = '';

  Ordered = MaterialRequisitionStatuses.Ordered;
  Incomplete = MaterialRequisitionStatuses.Incomplete;


  NameWithoutNos: string = ValidationPatterns.NameWithoutNos
  PinCodePattern: string = ValidationPatterns.PinCode;
  INDPhoneNo: string = ValidationPatterns.INDPhoneNo;

  NameWithoutNosMsg: string = ValidationMessages.NameWithoutNosMsg
  PinCodeMsg: string = ValidationMessages.PinCodeMsg;
  INDPhoneNoMsg: string = ValidationMessages.INDPhoneNoMsg;
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg;

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('requisitionForm') requisitionForm!: NgForm;
  @ViewChild('DateCtrl') DateInputControl!: NgModel;
  @ViewChild('SiteCtrl') SiteInputControl!: NgModel;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement,
    private dtu: DTU,
    private DateconversionService: DateconversionService,
    private payloadPacketFacade: PayloadPacketFacade,
    private serverCommunicator: ServerCommunicatorService,
  ) { }

  async ngOnInit() {
    this.LoginToken = this.appStateManage.getLoginToken();
    this.appStateManage.setDropdownDisabled(true);
    await this.getSiteListByCompanyRef();
    await this.getVendorListByCompanyRef();

    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Stock Inward' : 'Edit Stock Inward';
      this.Entity = StockInward.GetCurrentInstance();
      this.imagePostView = `${this.ImageBaseUrl}${this.Entity.p.MaterialInwardInvoicePath}/${this.LoginToken}?${this.TimeStamp}`;
      this.selectedFileName = this.Entity.p.MaterialInwardInvoicePath;
      this.InwardDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.InwardDate);
      this.getOrderIdListByCompanySiteAndVendorRef();
      this.appStateManage.StorageKey.removeItem('Editable');
    } else {
      this.Entity = StockInward.CreateNewInstance();
      StockInward.SetCurrentInstance(this.Entity);
      this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
      let parts = this.strCDT.substring(0, 16).split('-');
      // Construct the new date format
      this.InwardDate = `${parts[0]}-${parts[1]}-${parts[2]}`;
      await this.ChalanNo()
    }
  }


  ChalanNo = async () => {
    let req = new PurchaseOrderChalanFetchRequest();
    let td = req.FormulateTransportData();
    let pkt = this.payloadPacketFacade.CreateNewPayloadPacket2(td);
    let tr = await this.serverCommunicator.sendHttpRequest(pkt);

    if (!tr.Successful) {
      await this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    }

    let tdResult = JSON.parse(tr.Tag) as TransportData;
    let collections = tdResult?.MainData?.Collections;

    if (Array.isArray(collections)) {
      for (const item of collections) {
        if (
          item.Name === 'MaterialInward' &&
          Array.isArray(item.Entries) &&
          item.Entries.length > 0
        ) {
          const entry = item.Entries[0] as { NextChalanNo: number };
          const nextChalanNo = entry.NextChalanNo;
          this.Entity.p.ChalanNo = nextChalanNo
          return;
        }
      }
    }
    await this.uiUtils.showErrorMessage('Error', 'Chalan number could not be retrieved.');
  };

  getSiteListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
  }

  getVendorListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Vendor.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.VendorList = lst.filter(data => data.p.MaterialListSuppliedByVendor.length > 0);
  }

  onVendorSelection = (VendorRef: number) => {
    const SingleRecord = this.VendorList.filter(data => data.p.Ref == VendorRef);
    this.Entity.p.VendorTradeName = SingleRecord[0].p.TradeName;
    this.Entity.p.VendorPhoneNo = SingleRecord[0].p.MobileNo;
  }

  getOrderIdListByCompanySiteAndVendorRef = async () => {

    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    if (this.Entity.p.SiteRef <= 0) {
      return;
    }
    if (this.Entity.p.VendorRef <= 0) {
      return;
    }
    let lst = await Order.FetchEntireListByCompanySiteAndVendorRef(this.companyRef(), this.Entity.p.SiteRef, this.Entity.p.VendorRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );

    this.PurchaseOrderIdList = lst.filter((data) => data.p.MaterialPurchaseOrderStatus == this.Incomplete || data.p.MaterialPurchaseOrderStatus == this.Ordered);
  };


  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  getMaterialListByCompanySiteVendorRefAndPurchaseOrderID = async () => {
    if (this.Entity.p.MaterialPurchaseOrderRef <= 0) {
      await this.uiUtils.showErrorToster('Purchase Id not Selected');
      return;
    }
    const lst = await MaterialFromOrder.FetchOrderedMaterials(this.Entity.p.MaterialPurchaseOrderRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MaterialListOriginal = lst?.filter(item => item.p.IsMaterialExist == 1);
    // this.Entity.p.MaterialInwardDetailsArray = [];
    // this.MaterialListOriginal = lst?.filter(item => item.p.IsMaterialExist == 1);
    // this.MaterialListOriginal?.forEach((item, index) => {
    //   item.p.InternalRef = index + 1;
    // });
    // const allMatched = lst.every(item => item.p.RemainingQty == 0);
    // this.isSaveDisabled = allMatched;
    // if (!this.shouldFilterDropdown) {
    //   this.MaterialList = [...this.MaterialListOriginal];
    // } else {
    this.filterMaterialList();
    // }
  };

  filterMaterialList() {
    // this.MaterialList = this.MaterialListOriginal.filter(item =>
    //   !this.SessionAddedRefs.includes(item.p.InternalRef)
    // );
    const usedRefs = this.Entity.p.MaterialInwardDetailsArray.map(item => item.MaterialRef);
    let list = this.MaterialListOriginal.filter(
      material => !usedRefs.includes(material.p.MaterialRef)
    );
    this.MaterialList = list.filter(data => data.p.RemainingQty > 0); 
  }

  OnMaterialSelection = async () => {
    let Date = this.newInward.Date;
    let tempId = this.newInward.MaterialRef;
    this.newInward = InwardMaterialDetailProps.Blank();
    this.NewRemainingQty = 0;
    this.newInward.MaterialRef = tempId;

    let SingleMaterial = this.MaterialListOriginal.find(data => data.p.MaterialRef == this.newInward.MaterialRef);
    if (SingleMaterial) {
      this.NewRemainingQty = SingleMaterial.p.RemainingQty;
      this.newInward.PurchaseOrderRemainingQty = SingleMaterial.p.RemainingQty;
    }

    let SinglePurchaseOrderId = this.PurchaseOrderIdList.find(data => data.p.Ref == this.Entity.p.MaterialPurchaseOrderRef);

    const SingleRecord = SinglePurchaseOrderId?.p.MaterialPurchaseOrderDetailsArray.find((data) => data.MaterialRef == this.newInward.MaterialRef);

    this.newInward.Date = Date;

    if (SingleRecord) {
      this.newInward.UnitRef = SingleRecord.UnitRef;
      this.newInward.UnitName = SingleRecord.UnitName;
      this.newInward.MaterialRef = SingleRecord.MaterialRef;
      this.newInward.MaterialName = SingleRecord.MaterialName;
      this.newInward.PurchaseOrderQty = SingleRecord.OrderedQty;
      this.newInward.MaterialStockOrderDetailsRef = SingleRecord.Ref;
      this.newInward.InwardQty = 0;
      this.newInward.Rate = SingleRecord.Rate;
      this.newInward.DiscountedRate = SingleRecord.DiscountedRate;
      this.newInward.DiscountOnNetAmount = SingleRecord.DiscountOnNetAmount;
      this.newInward.NetAmount = SingleRecord.NetAmount;
      this.newInward.Gst = SingleRecord.Gst;
      this.newInward.DeliveryCharges = SingleRecord.DeliveryCharges;
      this.newInward.TotalAmount = SingleRecord.TotalAmount;
    } else {
      await this.uiUtils.showErrorToster('Material not found');
    }
  };

  CalculateRemainingQty = (InwardQty: number, RemainingQty: number) => {
    InwardQty = Number(InwardQty) || 0;
    if (RemainingQty - InwardQty >= 0) {
      this.NewRemainingQty = RemainingQty - InwardQty;
    } else {
      this.uiUtils.showErrorToster('Inward quantity cannot be greater than the Order quantity');
      this.newInward.InwardQty = 0;
      this.NewRemainingQty = RemainingQty;
    }
    this.CalculateNetAmountAndTotalAmount()
  }

  CalculateNetAmountAndTotalAmount = async () => {
    if (this.newInward.DiscountedRate == 0) {
      this.newInward.NetAmount = (this.newInward.Rate * this.newInward.InwardQty) - this.newInward.DiscountOnNetAmount;
    } else {
      this.newInward.NetAmount = (this.newInward.DiscountedRate * this.newInward.InwardQty) - this.newInward.DiscountOnNetAmount;
    }
    let GstAmount = (this.newInward.NetAmount / 100) * this.newInward.Gst;
    this.newInward.TotalAmount = this.newInward.NetAmount + GstAmount + this.newInward.DeliveryCharges;
  }

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

  loadFileFromBackend(imageUrl: string): void {
    if (imageUrl) {
      this.imagePreView = `${this.ImageBaseUrl}${imageUrl}/${this.LoginToken}?${this.TimeStamp}`;
      this.selectedFileName = imageUrl;
    } else {
      this.imagePreView = null;
    }
  }

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
          this.Entity.p.MaterialInwardInvoicePath = '';
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

  openModal = async (type: string) => {
    if (this.Entity.p.SiteRef <= 0) {
      await this.uiUtils.showErrorToster('Site not Selected');
      return;
    }
    if (this.Entity.p.VendorRef <= 0) {
      await this.uiUtils.showErrorToster('Vendor not Selected');
      return;
    }
    if (this.Entity.p.MaterialPurchaseOrderRef <= 0) {
      await this.uiUtils.showErrorToster('Purchase Id not Selected');
      return;
    }
    if (type === 'material') this.ismaterialModalOpen = true;
    this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
    let parts = this.strCDT.substring(0, 16).split('-');

    // Construct the new date format
    this.newInward.Date = `${parts[0]}-${parts[1]}-${parts[2]}`;
    this.ModalEditable = false;
  }

  closeModal = async (type: string) => {
    if (type === 'material') {
      const keysToCheck = ['MaterialRef', 'UnitRef', 'OrderedQty', 'InwardQty', 'RemainingQty'] as const;
      const hasData = keysToCheck.some(key => {
        const value = (this.newInward as any)[key];
        if (typeof value === 'string') {
          return value.trim() !== '';
        } else if (typeof value === 'number') {
          return !isNaN(value) && value !== 0;
        } else {
          return value != null;
        }
      });
      if (hasData) {
        await this.uiUtils.showConfirmationMessage(
          'Close',
          `This process is <strong>IRREVERSIBLE!</strong><br/>
         Are you sure you want to close this modal?`,
          async () => {
            this.ismaterialModalOpen = false;
            this.ModalEditable = false;
            this.newInward = InwardMaterialDetailProps.Blank();
            this.NewRemainingQty = 0
          }
        );
      } else {
        this.ismaterialModalOpen = false;
        this.newInward = InwardMaterialDetailProps.Blank();
        this.NewRemainingQty = 0
      }
    }
  };


  async addMaterial() {
    if (
      this.newInward.MaterialRef <= 0 ||
      this.newInward.InwardQty <= 0
    ) {
      await this.uiUtils.showErrorMessage('Error', 'Inward Quantity must be greater than 0 and material must be selected');
      return;
    }

    // if (this.newInward.InwardQty > this.newInward.PurchaseOrderRemainingQty) {
    //   await this.uiUtils.showErrorMessage('Error', 'Inward Quantity cannot be more than Remaining Quantity');
    //   return;
    // }

    const newInternalRef = this.newInward.InternalRef;

    if (typeof this.editingIndex === 'number' && this.editingIndex >= 0) {
      this.newInward.Date = this.dtu.ConvertStringDateToFullFormat(this.newInward.Date);
      this.Entity.p.MaterialInwardDetailsArray[this.editingIndex] = { ...this.newInward };
      await this.uiUtils.showSuccessToster('Material details updated successfully');
      this.ismaterialModalOpen = false;
    } else {
      this.newInward.Date = this.dtu.ConvertStringDateToFullFormat(this.newInward.Date);
      this.newInward.MaterialInwardRef = this.Entity.p.Ref;
      this.newInward.PurchaseOrderRemainingQty = this.NewRemainingQty;
      this.Entity.p.MaterialInwardDetailsArray.push({ ...this.newInward });

      // ✅ Track InternalRef instead of MaterialRef
      if (!this.SessionAddedRefs.includes(newInternalRef)) {
        this.SessionAddedRefs.push(newInternalRef);
      }

      this.shouldFilterDropdown = true;
      this.filterMaterialList();
      await this.uiUtils.showSuccessToster('Material added successfully');
    }
    this.newInward = InwardMaterialDetailProps.Blank();
    this.newInward.Date = this.InwardDate;
    this.NewRemainingQty = 0;
    this.editingIndex = null;
  }


  editMaterial(index: number) {
    this.ismaterialModalOpen = true
    this.newInward = { ...this.Entity.p.MaterialInwardDetailsArray[index] }
    this.ModalEditable = true;
    this.editingIndex = index;
  }

  async removeMaterial(index: number) {
    const removedItem = this.Entity.p.MaterialInwardDetailsArray[index];
    const removedInternalRef = removedItem.InternalRef;
    const dbRef = removedItem.Ref;

    if (dbRef !== 0) {
      this.uiUtils.showWarningToster('This record cannot be deleted');
      return;
    }

    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong><br/>Are you sure you want to DELETE this material?`,
      async () => {
        this.Entity.p.MaterialInwardDetailsArray.splice(index, 1);
        this.SessionAddedRefs = this.SessionAddedRefs.filter(ref => ref !== removedInternalRef);
        this.filterMaterialList();
      }
    );
  }

  getGrandTotal(): number {
    return this.Entity.p.MaterialInwardDetailsArray.reduce((total: number, item: any) => {
      return this.Entity.p.GrandTotal = total + Number(item.TotalAmount || 0);
    }, 0);
  }

  SaveStockInward = async () => {

    let lstFTO: FileTransferObject[] = [];
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    this.Entity.p.InwardDate = this.dtu.ConvertStringDateToFullFormat(this.InwardDate);

    let entityToSave = this.Entity.GetEditableVersion();

    let entitiesToSave = [entityToSave];

    if (this.InvoiceFile) {
      lstFTO.push(
        FileTransferObject.FromFile(
          "MaterialInwardInvoiceFile",
          this.InvoiceFile,
          this.InvoiceFile.name
        )
      );
    }
    let tr = await this.utils.SavePersistableEntities(entitiesToSave, lstFTO);

    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message)
      return;
    } else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Stock Inward saved successfully');
        this.Entity = StockInward.CreateNewInstance();
        this.SessionAddedRefs = [];
        this.filterMaterialList();
      } else {
        await this.uiUtils.showSuccessToster('Stock Inward Updated successfully');
      }
    }
    await this.router.navigate(['/homepage/Website/Stock_Inward']);
  };


  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  BackStockInward = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Stock Inward Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Stock_Inward']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Stock_Inward']);
    }
  }

  resetAllControls() {
    // this.requisitionForm.resetForm();
  }

}

