import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { Material } from 'src/app/classes/domain/entities/website/masters/material/material';
import { MaterialFromOrder } from 'src/app/classes/domain/entities/website/masters/material/orderedmaterial/materialfromorder';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { InwardMaterialDetailProps } from 'src/app/classes/domain/entities/website/stock_management/stock_inward/inwardmaterial/inwardmaterial';
import { StockInward } from 'src/app/classes/domain/entities/website/stock_management/stock_inward/stockinward';
import { MaterialStockOrder } from 'src/app/classes/domain/entities/website/stock_management/stock_order/materialstockorder/materialstockorder';
import { FileTransferObject } from 'src/app/classes/infrastructure/filetransferobject';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
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
  DetailsFormTitle: 'New Stock Inward' | 'Edit Stock Inward' = 'New Stock Inward';
  IsDropdownDisabled: boolean = false;
  InitialEntity: StockInward = null as any;
  SiteList: Site[] = [];
  MaterialList: MaterialFromOrder[] = [];
  MaterialListOriginal: MaterialFromOrder[] = [];
  localEstimatedStartingDate: string = '';
  localEstimatedEndDate: string = '';
  ModalEditable: boolean = false;
  materialheaders: string[] = ['Sr.No.', 'Material Name ', 'Unit', 'Ordered Qty.', 'Inward Qty.', 'Remaining Qty.', 'Action'];
  ismaterialModalOpen: boolean = false;
  newInward: InwardMaterialDetailProps = InwardMaterialDetailProps.Blank();
  editingIndex: null | undefined | number
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  InitialTableRefs: number[] = [];
shouldFilterDropdown = false; // 🔁 Used to toggle filtering after add

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
    private utils: Utils, private companystatemanagement: CompanyStateManagement,
    private dtu: DTU,
  ) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.getSiteListByCompanyRef()
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Stock Inward' : 'Edit Stock Inward';
      this.Entity = StockInward.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');
        this.InitialTableRefs = this.Entity.p.MaterialInwardDetailsArray.map(
    x => x.MaterialRequisitionDetailsRef
  );

  this.shouldFilterDropdown = false; // 🔁 disable filtering on form open
      if (this.Entity.p.OrderedDate != '') {
        this.Entity.p.OrderedDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.OrderedDate)
      }
      if (this.Entity.p.InwardDate != '') {
        this.Entity.p.InwardDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.InwardDate)
      }
      this.getMaterialListByCompanyRef(this.Entity.p.SiteRef)
      this.getVendorDataByVendorRef(this.Entity.p.VendorRef)
    } else {
      this.Entity = StockInward.CreateNewInstance();
      StockInward.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(
      StockInward.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as StockInward;
  }

  getSiteListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
  }

  getMaterialListByCompanyRef = async (SiteRef: number) => {
  if (this.companyRef() <= 0) {
    await this.uiUtils.showErrorToster('Company not Selected');
    return;
  }

  const lst = await MaterialFromOrder.FetchOrderedMaterials(
    SiteRef,
    this.companyRef(),
    async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg)
  );

  this.MaterialListOriginal = lst;

  const allMatched = lst.every(item => item.p.OrderedQty === item.p.TotalInwardQty);
  this.isSaveDisabled = allMatched;

  if (!this.shouldFilterDropdown) {
    // ✅ On first load (even in edit), show all materials
    this.MaterialList = [...this.MaterialListOriginal];
  } else {
    // 🔁 After user starts adding, apply filter
    this.filterMaterialList();
  }
};


 filterMaterialList() {
  if (!this.shouldFilterDropdown) {
    this.MaterialList = [...this.MaterialListOriginal]; // Show all
    return;
  }

  const currentRefs = this.Entity.p.MaterialInwardDetailsArray.map(
    x => x.MaterialRequisitionDetailsRef
  );

  const refCount: Record<number, number> = {};
  for (const ref of currentRefs) {
    refCount[ref] = (refCount[ref] || 0) + 1;
  }

  this.MaterialList = this.MaterialListOriginal.filter(item => {
    const ref = item.p.MaterialRequisitionDetailsRef;
    const originalCount = this.InitialTableRefs.includes(ref) ? 1 : 0;
    return (refCount[ref] || 0) <= originalCount;
  });
}


  getUnitByMaterialRef = async (materialref: number) => {
    this.newInward.UnitRef = 0;
    this.newInward.UnitName = '';
    this.newInward.MaterialName = ''
    this.newInward.OrderedQty = 0
    this.newInward.RemainingQty = 0
    this.newInward.MaterialStockOrderDetailsRef = 0
    if (materialref <= 0) {
      await this.uiUtils.showErrorToster('Material not Selected');
      return;
    }
    // let lst = await MaterialFromOrder.FetchInstance(materialref, this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    const UnitData = this.MaterialList.find((data) => data.p.MaterialRequisitionDetailsRef == materialref)
    if (UnitData) {
      this.newInward.UnitRef = UnitData.p.UnitRef;
      this.newInward.UnitName = UnitData.p.UnitName;
      this.newInward.MaterialName = UnitData.p.MaterialName
      this.newInward.OrderedQty = UnitData.p.OrderedQty
      this.newInward.MaterialStockOrderDetailsRef = UnitData.p.Ref
      if (UnitData.p.TotalInwardQty == 0) {
        this.newInward.RemainingQty = this.newInward.OrderedQty - this.newInward.InwardQty
        this.NewRemainingQty = this.newInward.OrderedQty
      } else {
        this.newInward.RemainingQty = Number(UnitData.p.OrderedQty) - Number(UnitData.p.TotalInwardQty)
        this.NewRemainingQty = Number(UnitData.p.OrderedQty) - Number(UnitData.p.TotalInwardQty)
      }
    }
  }

  getVendorDataByVendorRef = async (vendorref: number) => {
    this.Entity.p.VendorTradeName = '';
    this.Entity.p.VendorMobNo = '';
    if (vendorref <= 0 || vendorref <= 0) {
      await this.uiUtils.showErrorToster('Material not Selected');
      return;
    }
    let lst = await Vendor.FetchInstance(vendorref, this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.Entity.p.VendorTradeName = lst.p.TradeName;
    this.Entity.p.VendorMobNo = lst.p.MobileNo;
  }

  CalculateRemainingQty = (InwardQty: number, RemainingQty: number) => {
    InwardQty = Number(InwardQty) || 0;
    this.NewRemainingQty = RemainingQty - InwardQty;
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
          this.Entity.p.InvoicePath = '';
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
    if (type === 'material') this.ismaterialModalOpen = true;
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
          return value != null; // for cases like object refs or non-primitive types
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
      this.newInward.MaterialRequisitionDetailsRef <= 0 ||
      this.newInward.InwardQty < 0
    ) {
      await this.uiUtils.showErrorMessage('Error', 'Inward Quantity cannot be less than 0');
      return;
    }
    if (this.newInward.InwardQty > this.newInward.RemainingQty) {
      await this.uiUtils.showErrorMessage('Error', 'Inward Quantity cannot be more than Remaining Quantity');
      return;
    }
    if (typeof this.editingIndex === 'number' && this.editingIndex >= 0) {
      this.Entity.p.MaterialInwardDetailsArray[this.editingIndex] = { ...this.newInward };
      await this.uiUtils.showSuccessToster('Material details updated successfully');
      this.ismaterialModalOpen = false;
    } else {
      this.newInward.MaterialInwardRef = this.Entity.p.Ref;
      this.newInward.RemainingQty = this.NewRemainingQty;
      this.Entity.p.MaterialInwardDetailsArray.push({ ...this.newInward });
      this.shouldFilterDropdown = true; // 🔁 Start filtering only after first addition
      this.filterMaterialList();  
      await this.uiUtils.showSuccessToster('Material added successfully');
    }
    // this.filterMaterialList();
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
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong><br/>Are you sure that you want to DELETE this material?`,
      async () => {
        this.Entity.p.MaterialInwardDetailsArray.splice(index, 1);
        this.filterMaterialList();
      }
    );
  }

  SaveStockInward = async () => {
    let lstFTO: FileTransferObject[] = [];
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    this.Entity.p.OrderedDate = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.OrderedDate)
    this.Entity.p.InwardDate = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.InwardDate)
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
      this.uiUtils.showErrorMessage('Error', tr.Message)
      return;
    } else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Stock Inward saved successfully');
        this.Entity = StockInward.CreateNewInstance();
        this.resetAllControls()
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
    this.requisitionForm.resetForm(); // this will reset all form controls to their initial state
  }

}

