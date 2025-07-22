import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { Material } from 'src/app/classes/domain/entities/website/masters/material/material';
import { MaterialFromOrder } from 'src/app/classes/domain/entities/website/masters/material/orderedmaterial/materialfromorder';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { InwardMaterial, InwardMaterialDetailProps } from 'src/app/classes/domain/entities/website/stock_management/stock_inward/inwardmaterial/inwardmaterial';
import { StockInward } from 'src/app/classes/domain/entities/website/stock_management/stock_inward/stockinward';
import { MaterialStockOrder } from 'src/app/classes/domain/entities/website/stock_management/stock_order/materialstockorder/materialstockorder';
import { FileTransferObject } from 'src/app/classes/infrastructure/filetransferobject';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
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
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: string = 'Edit Stock Inward';
  IsDropdownDisabled: boolean = false;
  InitialEntity: StockInward = null as any;
  SiteList: Site[] = [];
  MaterialList: MaterialFromOrder[] = [];
  MaterialListOriginal: MaterialFromOrder[] = [];
  localEstimatedStartingDate: string = '';
  localEstimatedEndDate: string = '';
  ModalEditable: boolean = false;
  materialheaders: string[] = ['Sr.No.', 'Date', 'Material Name ', 'Unit', 'Ordered Qty.', 'Inward Qty.', 'Remaining Qty.', 'Action'];
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
    private DateconversionService: DateconversionService
  ) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.getSiteListByCompanyRef()
    this.IsNewEntity = false;
    this.getInwardSingleInstanceByInwardRef(history.state.inwardref);
    this.SessionAddedRefs = []; // ✅ Reset session-added materials

    this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
    let parts = this.strCDT.substring(0, 16).split('-');

    // Construct the new date format
    this.InwardDate = `${parts[0]}-${parts[1]}-${parts[2]}`;

    this.shouldFilterDropdown = false;
  }

  getSiteListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
  }

  getInwardSingleInstanceByInwardRef = async (InwardRef: number) => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await StockInward.FetchInstance(InwardRef, this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.Entity = lst;

    this.PurchaseOrderDate = this.dtu.ConvertStringDateToShortFormat(lst.p.PurchaseOrderDate);
    if (lst.p.InwardDate) {
      this.InwardDate = lst.p.InwardDate
    }

    await this.getMaterialListByCompanySiteVendorRefAndPurchaseOrderDate()
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  getMaterialListByCompanySiteVendorRefAndPurchaseOrderDate = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    if (this.Entity.p.SiteRef <= 0) {
      await this.uiUtils.showErrorToster('Site not Selected');
      return;
    }
    if (this.Entity.p.VendorRef <= 0) {
      await this.uiUtils.showErrorToster('Vendor not Selected');
      return;
    }
    const lst = await MaterialFromOrder.FetchOrderedMaterials(this.Entity.p.SiteRef, this.Entity.p.VendorRef, this.companyRef(), this.Entity.p.MaterialPurchaseOrderRef, this.Entity.p.Ref, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MaterialListOriginal = lst?.filter(item => item.p.IsMaterialExist == 1);
    this.MaterialListOriginal?.forEach((item, index) => {
      item.p.InternalRef = index + 1;
    });
    const allMatched = lst.every(item => item.p.RemainingQty == 0);
    this.isSaveDisabled = allMatched;
    if (!this.shouldFilterDropdown) {
      this.MaterialList = [...this.MaterialListOriginal];
    } else {
      this.filterMaterialList();
    }
  };

  filterMaterialList() {
    this.MaterialList = this.MaterialListOriginal.filter(item =>
      !this.SessionAddedRefs.includes(item.p.InternalRef)
    );
  }

  OnMaterialSelection = async (internalRef: number) => {
    let Date = this.newInward.Date;
    this.newInward = InwardMaterialDetailProps.Blank();
    this.NewRemainingQty = 0;

    const UnitData = this.MaterialList.find((data) => data.p.InternalRef === internalRef);
    this.newInward.Date = Date;

    if (UnitData) {
      this.newInward.UnitRef = UnitData.p.UnitRef;
      this.newInward.UnitName = UnitData.p.UnitName;
      this.newInward.MaterialRef = UnitData.p.MaterialRef;
      this.newInward.MaterialName = UnitData.p.MaterialName;
      this.newInward.PurchaseOrderQty = UnitData.p.OrderQty;
      this.newInward.PurchaseOrderRemainingQty = UnitData.p.RemainingQty;
      this.newInward.MaterialStockOrderDetailsRef = UnitData.p.Ref;

      this.newInward.InternalRef = UnitData.p.InternalRef;
      this.NewRemainingQty = UnitData.p.RemainingQty;
    } else {
      await this.uiUtils.showErrorToster('Material not found');
    }
  };

  CalculateRemainingQty = (InwardQty: number, RemainingQty: number) => {
    InwardQty = Number(InwardQty) || 0;
    this.NewRemainingQty = RemainingQty - InwardQty;
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
      this.newInward.InternalRef <= 0 ||
      this.newInward.InwardQty <= 0
    ) {
      await this.uiUtils.showErrorMessage('Error', 'Inward Quantity must be greater than 0 and material must be selected');
      return;
    }

    if (this.newInward.InwardQty > this.newInward.PurchaseOrderRemainingQty) {
      await this.uiUtils.showErrorMessage('Error', 'Inward Quantity cannot be more than Remaining Quantity');
      return;
    }

    const newInternalRef = this.newInward.InternalRef;

    if (typeof this.editingIndex === 'number' && this.editingIndex >= 0) {
      this.newInward.Date = this.dtu.ConvertStringDateToFullFormat(this.newInward.Date);
      this.Entity.p.MaterialInwardDetailsArray[this.editingIndex] = { ...this.newInward };
      await this.uiUtils.showSuccessToster('Material details updated successfully');
      this.ismaterialModalOpen = false;
    } else {
      this.newInward.Date = this.dtu.ConvertStringDateToFullFormat(this.newInward.Date);
      this.newInward.MaterialInwardRef = this.Entity.p.MaterialInwardRef;
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
        this.resetAllControls()
        this.SessionAddedRefs = [];
        this.filterMaterialList();
      } else {
        await this.uiUtils.showSuccessToster('Stock Inward Updated successfully');
        await this.router.navigate(['/homepage/Website/Stock_Inward']);
      }
    }
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
    this.requisitionForm.resetForm();
  }

}

