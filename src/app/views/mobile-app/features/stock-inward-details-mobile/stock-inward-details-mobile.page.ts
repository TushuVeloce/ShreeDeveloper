import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialFromOrder } from 'src/app/classes/domain/entities/website/masters/material/orderedmaterial/materialfromorder';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { InwardMaterialDetailProps } from 'src/app/classes/domain/entities/website/stock_management/stock_inward/inwardmaterial/inwardmaterial';
import { StockInward } from 'src/app/classes/domain/entities/website/stock_management/stock_inward/stockinward';
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
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { NumberValueAccessor } from '@angular/forms';
import { FileTransferObject } from 'src/app/classes/infrastructure/filetransferobject';

@Component({
  selector: 'app-stock-inward-details-mobile',
  templateUrl: './stock-inward-details-mobile.page.html',
  styleUrls: ['./stock-inward-details-mobile.page.scss'],
  standalone: false
})
export class StockInwardDetailsMobilePage implements OnInit {

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
  materialheaders: string[] = [ 'Material Name ', 'Unit', 'Ordered Qty.', 'Inward Qty.', 'Remaining Qty.'];
  ismaterialModalOpen: boolean = false;
  newInward: InwardMaterialDetailProps = InwardMaterialDetailProps.Blank();
  editingIndex: null | undefined | number
  InitialTableRefs: number[] = [];
  shouldFilterDropdown = false; // 🔁 Used to toggle filtering after add
  SessionAddedRefs: number[] = [];
  today: string = new Date().toISOString().split('T')[0];
  NewRemainingQty: number = 0;



  companyRef: number = 0;
  strCDT: string = '';
  selectedSite: any[] = [];
  SiteName: string = '';
  selectedVendor: any[] = [];
  VendorName: string = '';
  selectedMaterial: any[] = [];
  TotalOrderedQty: number = 0;
  MaterialName: string = '';


  errors: string = "";
  InvoiceFile: File = null as any
  ImageBaseUrl: string = "";
  TimeStamp = Date.now()
  LoginToken = '';

  imagePreView: string | null = '';
  imagePostView: string = '';
  imagePostViewUrl: string = '';
  selectedFileName: string = '';

  showPurchaseOrderDatePicker = false;
  PurchaseOrderDate = '';
  DisplayPurchaseOrderDate = '';

  showInwardDatePicker = false;
  InwardDate = '';
  DisplayInwardDate = '';

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
        this.appStateManage.setDropdownDisabled(true);
        this.getSiteListByCompanyRef()
        if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
          this.IsNewEntity = false;
          this.DetailsFormTitle = this.IsNewEntity ? 'New Stock Inward' : 'Edit Stock Inward';
          this.Entity = StockInward.GetCurrentInstance();
          this.PurchaseOrderDate = this.Entity.p.PurchaseOrderDate
          this.InwardDate = this.Entity.p.PurchaseOrderDate
          this.appStateManage.StorageKey.removeItem('Editable');
          this.SessionAddedRefs = []; // ✅ Reset session-added materials
          this.shouldFilterDropdown = false;
          if (this.Entity.p.PurchaseOrderDate != '') {
            this.Entity.p.PurchaseOrderDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.PurchaseOrderDate)
            this.PurchaseOrderDate = this.Entity.p.PurchaseOrderDate
            this.DisplayPurchaseOrderDate = this.Entity.p.PurchaseOrderDate
          }
          if (this.Entity.p.InwardDate != '') {
            this.Entity.p.InwardDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.InwardDate)
            this.InwardDate = this.Entity.p.InwardDate
            this.DisplayInwardDate = this.Entity.p.InwardDate
          }
          this.getMaterialListByCompanyRef(this.Entity.p.SiteRef, this.Entity.p.VendorRef)
          this.getVendorDataByVendorRef(this.Entity.p.VendorRef)
        } else {
          this.Entity = StockInward.CreateNewInstance();
          StockInward.SetCurrentInstance(this.Entity);
        }
        this.InitialEntity = Object.assign(
          StockInward.CreateNewInstance(),
          this.utils.DeepCopy(this.Entity)
        ) as StockInward;

      } else {
        await this.toastService.present('company not selected', 1000, 'danger');
        await this.haptic.error();
      }
    } catch (error) {
      console.error('Error loading Stock Inward details:', error);
      await this.toastService.present('Failed to load Stock Inward details', 1000, 'danger');
      await this.haptic.error();
    } finally {
      await this.loadingService.hide(); // Also ensure this is awaited
    }
  }

  public async onPurchaseOrderDateChange(date: any): Promise<void> {
    this.PurchaseOrderDate = this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
    this.Entity.p.PurchaseOrderDate = this.PurchaseOrderDate;
    this.DisplayPurchaseOrderDate = this.PurchaseOrderDate;
  }
  public async onInwardDateChange(date: any): Promise<void> {
    this.InwardDate = this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
    this.Entity.p.InwardDate = this.InwardDate;
    this.DisplayInwardDate = this.InwardDate;
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
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.SiteList = lst;
  }

  getMaterialListByCompanyRef = async (SiteRef: number, VendorRef: number) => {
    if (this.companyRef <= 0) {
      // await this.uiUtils.showErrorToster('Company not Selected');
      await this.toastService.present('Company not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    const lst = await MaterialFromOrder.FetchOrderedMaterials(SiteRef, VendorRef, this.companyRef, async errMsg => {
      // await this.uiUtils.showErrorMessage('Error', errMsg)
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    console.log('lst :', lst);
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
      !this.SessionAddedRefs.includes(item.p.MaterialRef)
    );
  }

  getUnitByMaterialRef = async (materialref: number) => {
    this.newInward.UnitRef = 0;
    this.newInward.UnitName = '';
    this.newInward.MaterialName = ''
    this.newInward.PurchaseOrderQty = 0
    this.newInward.PurchaseOrderRemainingQty = 0
    this.newInward.MaterialStockOrderDetailsRef = 0
    if (materialref <= 0) {
      // await this.uiUtils.showErrorToster('Material not Selected');
      await this.toastService.present('Material not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    // let lst = await MaterialFromOrder.FetchInstance(materialref, this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    const UnitData = this.MaterialList.find((data) => data.p.MaterialRef == materialref)
    if (UnitData) {
      this.newInward.UnitRef = UnitData.p.UnitRef;
      this.newInward.UnitName = UnitData.p.UnitName;
      this.newInward.MaterialRef = UnitData.p.MaterialRef
      this.newInward.MaterialName = UnitData.p.MaterialName
      this.newInward.PurchaseOrderQty = UnitData.p.OrderQty
      this.newInward.MaterialStockOrderDetailsRef = UnitData.p.Ref
      this.newInward.PurchaseOrderRemainingQty = UnitData.p.RemainingQty
      this.NewRemainingQty = UnitData.p.RemainingQty
      // if (UnitData.p.TotalInwardQty == 0) {
      //   this.newInward.RemainingQty = this.newInward.OrderedQty - this.newInward.InwardQty
      //   this.NewRemainingQty = this.newInward.OrderedQty
      // } else {
      //   this.newInward.RemainingQty = Number(UnitData.p.OrderedQty) - Number(UnitData.p.TotalInwardQty)
      //   this.NewRemainingQty = Number(UnitData.p.OrderedQty) - Number(UnitData.p.TotalInwardQty)
      // }
    }
  }

  getVendorDataByVendorRef = async (vendorref: number) => {
    this.Entity.p.VendorTradeName = '';
    this.Entity.p.VendorMobNo = '';
    if (vendorref <= 0 || vendorref <= 0) {
      // await this.uiUtils.showErrorToster('Material not Selected');
      await this.toastService.present('Material not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await Vendor.FetchInstance(vendorref, this.companyRef, async errMsg => {
      // await this.uiUtils.showErrorMessage('Error', errMsg)
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
      await this.haptic.error();
    }
    );
    this.Entity.p.VendorTradeName = lst.p.TradeName;
    this.Entity.p.VendorMobNo = lst.p.MobileNo;
  }

  CalculateRemainingQty = (InwardQty: number, RemainingQty: number) => {
    InwardQty = Number(InwardQty) || 0;
    this.NewRemainingQty = RemainingQty - InwardQty;
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
          this.Entity.p.MaterialInwardInvoiceFile = '';
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
    if (type === 100) this.ismaterialModalOpen = true;
    this.ModalEditable = false;
  }

  closeModal = async (type: number) => {
    if (type === 100) {
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
        // await this.uiUtils.showConfirmationMessage(
        //   'Close',
        //   `This process is <strong>IRREVERSIBLE!</strong><br/>
        //    Are you sure you want to close this modal?`,
        //   async () => {
        //     this.ismaterialModalOpen = false;
        //     this.ModalEditable = false;
        //     this.newInward = InwardMaterialDetailProps.Blank();
        //     this.NewRemainingQty = 0
        //   }
        // );
        await this.alertService.presentDynamicAlert({
          header: 'Close',
          subHeader: 'Confirmation needed',
          message: 'Are you sure you want to close this modal?',
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
                this.ismaterialModalOpen = false;
                this.ModalEditable = false;
                this.newInward = InwardMaterialDetailProps.Blank();
                this.NewRemainingQty = 0
                this.haptic.success();
                console.log('User confirmed.');
              }
            }
          ]
        });
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
      this.newInward.InwardQty < 0
    ) {
      // await this.uiUtils.showErrorMessage('Error', 'Inward Quantity cannot be less than 0');
      await this.toastService.present('Inward Quantity cannot be less than 0', 1000, 'warning');
      await this.haptic.warning();
      return;
    }

    if (this.newInward.InwardQty > this.newInward.PurchaseOrderRemainingQty) {
      // await this.uiUtils.showErrorMessage('Error', 'Inward Quantity cannot be more than Remaining Quantity');
      await this.toastService.present('Inward Quantity cannot be more than Remaining Quantity', 1000, 'warning');
      await this.haptic.warning();
      return;
    }

    const newRef = this.newInward.MaterialRef;

    if (typeof this.editingIndex === 'number' && this.editingIndex >= 0) {
      this.Entity.p.MaterialInwardDetailsArray[this.editingIndex] = { ...this.newInward };
      // await this.uiUtils.showSuccessToster('Material details updated successfully');
      await this.toastService.present('Material details updated successfully', 1000, 'success');
      await this.haptic.success();
      this.ismaterialModalOpen = false;
    } else {
      this.newInward.MaterialInwardRef = this.Entity.p.Ref;
      this.newInward.PurchaseOrderRemainingQty = this.NewRemainingQty;
      this.Entity.p.MaterialInwardDetailsArray.push({ ...this.newInward });

      // ✅ Track fresh additions only
      if (!this.SessionAddedRefs.includes(newRef)) {
        this.SessionAddedRefs.push(newRef);
      }

      this.shouldFilterDropdown = true;
      this.filterMaterialList();
      // await this.uiUtils.showSuccessToster('Material added successfully');
      await this.toastService.present('Material added successfully', 1000, 'success');
      await this.haptic.success();
      this.ismaterialModalOpen = false;
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
    const removedRef = removedItem.MaterialRef;
    const Ref = removedItem.Ref
    if (Ref !== 0) {
      // this.uiUtils.showWarningToster('This record can not be Delete');
      await this.toastService.present('This record can not be Delete', 1000, 'warning');
      await this.haptic.warning();
      return
    }
    // await this.uiUtils.showConfirmationMessage(
    //   'Delete',
    //   `This process is <strong>IRREVERSIBLE!</strong><br/>Are you sure you want to DELETE this material?`,
    //   async () => {
    //     this.Entity.p.MaterialInwardDetailsArray.splice(index, 1);

    //     // ✅ Always remove from session tracking
    //     this.SessionAddedRefs = this.SessionAddedRefs.filter(ref => ref !== removedRef);

    //     this.filterMaterialList();
    //   }
    // );
    await this.alertService.presentDynamicAlert({
      header: 'Delete',
      subHeader: 'Confirmation needed',
      message: 'Are you sure you want to DELETE this material?',
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
          text: 'Yes, Delete',
          cssClass: 'custom-confirm',
          handler: () => {
            this.Entity.p.MaterialInwardDetailsArray.splice(index, 1);
            this.SessionAddedRefs = this.SessionAddedRefs.filter(ref => ref !== removedRef);
            this.filterMaterialList();
            this.haptic.success();
            console.log('User confirmed.');
          }
        }
      ]
    });
  }


  SaveStockInward = async () => {
    let lstFTO: FileTransferObject[] = [];
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    this.Entity.p.PurchaseOrderDate = this.PurchaseOrderDate
    this.Entity.p.InwardDate = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.InwardDate)
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    // return
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
      // this.uiUtils.showErrorMessage('Error', tr.Message)
      await this.toastService.present('Error ' + tr.Message, 1000, 'danger');
      await this.haptic.error();
      return;
    } else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        // await this.uiUtils.showSuccessToster('Stock Inward saved successfully');
        await this.toastService.present('Stock Inward saved Successfully', 1000, 'success');
        await this.haptic.success();
        this.Entity = StockInward.CreateNewInstance();
        this.SessionAddedRefs = [];
        this.filterMaterialList();
      } else {
        // await this.uiUtils.showSuccessToster('Stock Inward Updated successfully');
        await this.toastService.present('Stock Inward Updated successfully', 1000, 'success');
        await this.haptic.success();
        await this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/stock-inward']);
      }
    }
  };


  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  BackStockInward = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      // await this.uiUtils.showConfirmationMessage('Cancel',
      //   `This process is IRREVERSIBLE!
      //   <br/>
      //   Are you sure that you want to Cancel this Stock Inward Form?`,
      //   async () => {
      //     await this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/stock-inward']);
      //   });
      await this.alertService.presentDynamicAlert({
        header: 'Delete',
        subHeader: 'Confirmation needed',
        message: ' Are you sure that you want to Cancel this Stock Inward Form ?',
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
            text: 'Yes, Delete',
            cssClass: 'custom-confirm',
            handler: () => {
              this.haptic.success();
              this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/stock-inward']);
              console.log('User confirmed.');
            }
          }
        ]
      });
    } else {
      await this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/stock-inward']);
    }
  }

  // public async selectGSTBottomsheet(): Promise<void> {
  //   try {
  //     const options = this.GSTList.map((item) => ({ p: item }));
  //     console.log('gst options :', options);
  //     // const options = this.GSTList;
  //     this.openSelectModal(options, this.selectedGST, false, 'Select GST', 1, (selected) => {
  //       this.selectedGST = selected;
  //       this.newOrderMaterial.Gst = selected[0].p.Ref;
  //       this.gstName = selected[0].p.Name;
  //       this.CalculateNetAmountAndTotalAmount()
  //     });
  //   } catch (error) {

  //   }
  // }

  public async selectMaterialBottomsheet(): Promise<void> {
    try {
      // Reformat the options with Name and Ref
      const options = this.MaterialList.map(item => ({
        ...item,
        p: {
          ...item.p,
          Name: item.p.MaterialName + "-QTY-"+item.p.OrderQty, // Add 'Name'
          Ref: item.p.InternalRef   // Add 'Ref'
        }
      }));

      console.log('Formatted Material:', options);

      this.openSelectModal(options, this.selectedMaterial, false, 'Select Material', 1, (selected) => {
        this.selectedMaterial = selected;

        // Use standardized keys now
        this.MaterialName = selected[0].p.Name;
        this.newInward.MaterialName = selected[0].p.Name;
        this.newInward.MaterialRef = selected[0].p.MaterialRef;
        this.getUnitByMaterialRef(this.newInward.MaterialRef);
      });
    } catch (error) {
      console.error('Error in selectMaterialBottomsheet:', error);
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
    const emptyEntity = StockInward.CreateNewInstance();
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
              this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/stock-inward'], { replaceUrl: true });
              this.haptic.success();
              console.log('User confirmed.');
            }
          }
        ]
      });
    } else {
      this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/stock-inward'], { replaceUrl: true });
      this.haptic.success();
    }
  }
}
