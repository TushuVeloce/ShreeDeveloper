import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { RequiredMaterial } from 'src/app/classes/domain/entities/website/stock_management/material_requisition/requiredmaterial/requiredmaterial';
import { QuotedMaterial, QuotedMaterialDetailProps } from 'src/app/classes/domain/entities/website/stock_management/Quotation/QuotatedMaterial/quotatedmaterial';
import { Quotation } from 'src/app/classes/domain/entities/website/stock_management/Quotation/quotation';
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
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { FileTransferObject } from 'src/app/classes/infrastructure/filetransferobject';

@Component({
  selector: 'app-vendor-quotation-details-mobile',
  templateUrl: './vendor-quotation-details-mobile.page.html',
  styleUrls: ['./vendor-quotation-details-mobile.page.scss'],
  standalone: false
})
export class VendorQuotationDetailsMobilePage implements OnInit {

  Entity: Quotation = Quotation.CreateNewInstance();
  IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Quotation' | 'Edit Quotation' = 'New Quotation';
  IsDropdownDisabled: boolean = false;
  InitialEntity: Quotation = null as any;
  SiteList: Site[] = [];
  VendorList: Vendor[] = [];
  MaterialRequisitionList: RequiredMaterial[] = [];
  AllMaterialRequisitionList: RequiredMaterial[] = [];
  VendorRef: number = 0;
  VendorName: string = '';
  VendorTradeName: string = '';
  QuotationDate: string = '';
  CurrentDate: string = '';
  QuotedMaterialheaders: string[] = ['Sr.No.', 'Material ', 'Unit', 'Required Quantity', 'Ordered Quantity', 'Required Remaining Quantity', 'Rate', 'Discount Rate', 'GST', 'Delivery Charges', 'Expected Delivery Date', 'Net Amount', 'Total Amount', 'Action'];
  isQuotedMaterialModalOpen: boolean = false;
  isCopyMaterialModalOpen: boolean = false;
  newQuotedMaterial: QuotedMaterialDetailProps = QuotedMaterialDetailProps.Blank();
  editingIndex: null | undefined | number;
  strCDT: string = ''
  ModalEditable: boolean = false;
  companyRef: number = 0;
  SiteName: string = '';
  selectedSite: any[] = [];
  // VendorName1: string = '';
  selectedVendorName: any[] = [];

  MaterialName: string = '';
  selectedMaterial: any[] = [];

  gstName: string = '';
  selectedGST: any[] = [];
  Date: string | null = null;
  ExpectedDeliveryDate: string | null = null;

  CopyVendorList: Quotation[] = [];
  CopyVendorName: string = '';
  CopyVendorRef: number = 0;
  selectedCopyVendor: any[] = [];

  errors: string = '';

  //image details
  InvoiceFile: File = null as any
  ImageBaseUrl: string = "";
  TimeStamp = Date.now()
  LoginToken = '';

  imagePreView: string | null = '';
  imagePostView: string = '';
  imagePostViewUrl: string = '';
  selectedFileName: string = '';

  GSTList: any[] = [
    { Name: "None", Ref: 0 },
    { Name: "5%", Ref: 5 },
    { Name: "9%", Ref: 9 },
    { Name: "18%", Ref: 18 },
    { Name: "27%", Ref: 27 }
  ];

  tableHeaderData = ['Material', 'Unit', 'Required Qty', 'Ordered Qty', 'Required Remaining Qty', 'Rate', 'Discount Rate', 'GST', 'Delivery Charges', 'Expected Delivery Date', 'Net Amount', 'Total Amount']



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
          this.DetailsFormTitle = this.IsNewEntity ? 'New Quotation' : 'Edit Quotation';
          this.Entity = Quotation.GetCurrentInstance();
          console.log('this.Entity :', this.Entity);
          this.appStateManage.StorageKey.removeItem('Editable');
          this.imagePostView = `${this.ImageBaseUrl}${this.Entity.p.InvoicePath}/${this.LoginToken}?${this.TimeStamp}`;
          this.selectedFileName = this.Entity.p.InvoicePath;

          // this.QuotationDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date);
          if (this.Entity.p.Date != '') {
            this.Date = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date);
          } else {
            this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
            let parts = this.strCDT.substring(0, 16).split('-');
            this.Entity.p.Date = `${parts[0]}-${parts[1]}-${parts[2]}`;
            this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;

          }
          this.selectedSite = [{
            p: {
              Ref: this.Entity.p.SiteRef,
              Name: this.Entity.p.SiteName
            }
          }];
          this.SiteName = this.selectedSite[0].p.Name;
          this.selectedVendorName = [{
            p: {
              Ref: this.Entity.p.VendorRef,
              Name: this.Entity.p.VendorName
            }
          }];
          this.VendorName = this.selectedVendorName[0].p.Name;
          this.onVendorSelection(this.Entity.p.VendorRef);

        } else {
          this.Entity = Quotation.CreateNewInstance();
          Quotation.SetCurrentInstance(this.Entity);
          this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
          let parts = this.strCDT.substring(0, 16).split('-');
          // Construct the new date format
          this.QuotationDate = `${parts[0]}-${parts[1]}-${parts[2]}`;
          this.CurrentDate = `${parts[0]}-${parts[1]}-${parts[2]}`;

          if (this.Entity.p.Date == '') {
            this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
            let parts = this.strCDT.substring(0, 16).split('-');
            this.Entity.p.Date = `${parts[0]}-${parts[1]}-${parts[2]}`;
            this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
          }
        }
        this.InitialEntity = Object.assign(Quotation.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as Quotation;
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


  public async onDateChange(date: any): Promise<void> {
    this.Date = this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
    this.Entity.p.Date = this.Date;
  }

  public async onExpectedDeliveryDateChange(date: any): Promise<void> {
    this.Date = this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
    // this.Entity.p.MaterialQuotationDetailsArray[this.editingIndex].ExpectedDeliveryDate = this.Date;
    this.newQuotedMaterial.ExpectedDeliveryDate = this.Date;
  }

  openModal = async (type: number) => {
    if (this.Entity.p.SiteRef <= 0) {
      // this.uiUtils.showErrorToster('Site not Selected');
      await this.toastService.present('Site not Selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    if (this.Entity.p.VendorRef <= 0) {
      // this.uiUtils.showErrorToster('Vendor not Selected');
      await this.toastService.present('Vendor not Selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    if (type === 100) this.isQuotedMaterialModalOpen = true//this.ismaterialModalOpen = true;
    await this.getMaterialRequisitionListByVendorRefAndSiteRef();
    this.ModalEditable = false;
  }

  closeModal = async (type: number) => {
    if (type === 100) {
      const keysToCheck = ['MaterialRequisitionDetailsName', 'OrderedQty', 'Rate', 'DiscountedRate', 'Gst', 'DeliveryCharges', 'ExpectedDeliveryDate'] as const;

      const hasData = keysToCheck.some(key => {
        const value = (this.newQuotedMaterial as any)[key];

        // Check for non-null, non-undefined, non-empty string or non-zero number
        if (typeof value === 'string') {
          return value.trim() !== '';
        } else if (typeof value === 'number') {
          return !isNaN(value) && value !== 0;
        } else {
          return value != null; // for cases like object refs or non-primitive types
        }
      });

      if (hasData) {
        this.alertService.presentDynamicAlert({
          header: 'Close',
          subHeader: 'Confirmation needed',
          message: 'Are you sure you want to close this form?',
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
                // this.ismaterialModalOpen = false;
                this.ModalEditable = false;
                this.isQuotedMaterialModalOpen = false;
                this.MaterialName = '';
                this.gstName = '';
                this.newQuotedMaterial = QuotedMaterialDetailProps.Blank();
                this.haptic.success();
                console.log('User confirmed.');
              }
            }
          ]
        });
      } else {
        // this.ismaterialModalOpen = false;

        this.isQuotedMaterialModalOpen = false;
        this.ModalEditable = false;
        this.MaterialName = '';
        this.gstName = '';
        // this.ExpectedDeliveryDate='';
        this.newQuotedMaterial = QuotedMaterialDetailProps.Blank();
      }
    }
  };

  getSiteListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      // await this.uiUtils.showErrorToster('Company not Selected');
      await this.toastService.present('Company not Selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      // await this.uiUtils.showErrorMessage('Error', errMsg)
      await this.toastService.present('Error' + errMsg, 1000, 'danger');
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
      await this.toastService.present('Company not Selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    let lst = await Vendor.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present('Error' + errMsg, 1000, 'danger');
      await this.haptic.error();
      // await this.uiUtils.showErrorMessage('Error', errMsg);
    });
    this.VendorList = lst;
  }

  getMaterialRequisitionListByVendorRefAndSiteRef = async () => {
    if (this.Entity.p.VendorRef <= 0) {
      // await this.uiUtils.showErrorToster('Vendor not Selected');
      await this.toastService.present('Vendor not Selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    if (this.Entity.p.SiteRef <= 0) {
      // await this.uiUtils.showErrorToster('Site not Selected');
      await this.toastService.present('Site not Selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    let lst = await RequiredMaterial.FetchEntireListByCompanyVendorAndSiteRef(this.companyRef, this.Entity.p.VendorRef, this.Entity.p.SiteRef, async errMsg => {
      console.log('RequiredMaterial :', this.companyRef, this.Entity.p.VendorRef, this.Entity.p.SiteRef);
      // await this.uiUtils.showErrorMessage('Error', errMsg)
      await this.toastService.present('Error' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.AllMaterialRequisitionList = lst;
    this.filterMaterialList();
  }

  filterMaterialList() {
    const usedRefs = this.Entity.p.MaterialQuotationDetailsArray.map(item => item.MaterialRequisitionDetailsRef);
    this.MaterialRequisitionList = this.AllMaterialRequisitionList.filter(
      material => !usedRefs.includes(material.p.Ref)
    );
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  onSiteSelection = (SiteRef: number) => {
    const SingleRecord = this.SiteList.filter(data => data.p.Ref == SiteRef);
    this.Entity.p.SiteName = SingleRecord[0].p.Name;
    this.Entity.p.MaterialQuotationDetailsArray = [];
  }

  onVendorSelection = (VendorRef: number) => {
    const SingleRecord = this.VendorList.filter(data => data.p.Ref == VendorRef);
    this.Entity.p.VendorTradeName = SingleRecord[0].p.TradeName
    this.Entity.p.AddressLine1 = SingleRecord[0].p.AddressLine1
  }

  onMaterialSelection = (MaterialRef: number) => {
    // debugger
    console.log('MaterialRef :', MaterialRef);

    console.log('MaterialRequisitionList :', this.MaterialRequisitionList);
    const SingleRecord = this.MaterialRequisitionList.filter(data => data.p.Ref == MaterialRef);
    console.log('SingleRecord :', SingleRecord);
    this.newQuotedMaterial.UnitName = SingleRecord[0].p.UnitName
    this.newQuotedMaterial.EstimatedQty = SingleRecord[0].p.EstimatedQty
    this.newQuotedMaterial.MaterialRequisitionDetailsName = SingleRecord[0].p.MaterialName
    this.newQuotedMaterial.MaterialQuotationDetailsRef = SingleRecord[0].p.Ref
  }

  // Trigger file input when clicking the image
  // triggerFileInput(): void {
  //   this.fileInputRef.nativeElement.click();
  // }

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
          this.toastService.present('Only PDF or image files are supported.', 1000, 'danger');
          this.haptic.error();
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


  async addQuotedMaterial() {
    if (this.newQuotedMaterial.MaterialRequisitionDetailsRef == 0) {
      return await this.toastService.present('Material not Selected', 1000, 'warning'), await this.haptic.warning();
    }
    if (this.newQuotedMaterial.OrderedQty == 0) {
      return await this.toastService.present('Ordered Qty cannot be blank.', 1000, 'warning'), await this.haptic.warning();

    }
    if (this.newQuotedMaterial.Rate == 0) {
      return await this.toastService.present('Rate cannot be blank.', 1000, 'warning'), await this.haptic.warning();
    }

    this.newQuotedMaterial.ExpectedDeliveryDate = this.dtu.ConvertStringDateToFullFormat(this.ExpectedDeliveryDate ? this.ExpectedDeliveryDate : '');
    this.ExpectedDeliveryDate = '';
    if (this.editingIndex !== null && this.editingIndex !== undefined && this.editingIndex >= 0) {
      this.Entity.p.MaterialQuotationDetailsArray[this.editingIndex] = { ...this.newQuotedMaterial };
      // await this.uiUtils.showSuccessToster('Material updated successfully');
      await this.toastService.present('Material updated successfully', 1000, 'success');
      await this.haptic.success();
      this.isQuotedMaterialModalOpen = false;
    } else {
      this.newQuotedMaterial.ExpectedDeliveryDate = this.strCDT;
      console.log('this.newQuotedMaterial :', this.newQuotedMaterial);

      let QuotedMaterialInstance = new QuotedMaterial(this.newQuotedMaterial, true);
      let QuotationInstance = new Quotation(this.Entity.p, true);
      await QuotedMaterialInstance.EnsurePrimaryKeysWithValidValues();
      await QuotationInstance.EnsurePrimaryKeysWithValidValues();
      this.Entity.p.MaterialQuotationDetailsArray.push({ ...QuotedMaterialInstance.p });
      this.filterMaterialList();
      // await this.uiUtils.showSuccessToster('Material added successfully');
      this.isQuotedMaterialModalOpen = false;
      await this.toastService.present('Material added successfully', 1000, 'success');
      await this.haptic.success();
    }
    this.newQuotedMaterial = QuotedMaterialDetailProps.Blank();
    this.editingIndex = null;
    this.gstName = '';
    this.MaterialName = '';
    this.ExpectedDeliveryDate = null;
  }

  editQuotedMaterial(index: number) {
    this.isQuotedMaterialModalOpen = true
    this.newQuotedMaterial = { ...this.Entity.p.MaterialQuotationDetailsArray[index] }
    this.editingIndex = index;
    this.ModalEditable = true;
    this.selectedGST = [{
      p: {
        Ref: this.Entity.p.MaterialQuotationDetailsArray[index].ExpectedDeliveryDate,
        Name: this.GSTList.filter(data => data.Ref == this.Entity.p.MaterialQuotationDetailsArray[index].Gst)[0].Name
      }
    }];
    this.gstName = this.selectedGST[0].p.Name;
    this.ExpectedDeliveryDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.MaterialQuotationDetailsArray[index].ExpectedDeliveryDate);
  }

  async removeQuotedMaterial(index: number) {
    this.alertService.presentDynamicAlert({
      header: 'Delete',
      subHeader: 'Confirmation needed',
      message: 'Are you sure that you want to DELETE this Quoted Material?',
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
            this.Entity.p.MaterialQuotationDetailsArray.splice(index, 1);
            this.filterMaterialList();
            this.haptic.success();
            console.log('User confirmed.');
          }
        }
      ]
    });
  }

  openCopyModal = async (type: number) => {
    if (this.Entity.p.SiteRef <= 0) {
      // await this.uiUtils.showErrorToster('Site not Selected');
      this.toastService.present('Site not Selected', 1000, 'danger');
      this.haptic.error();
      return;
    }
    // this.getVendorListByCompanyRef();
    if (type === 200) this.isCopyMaterialModalOpen = true, await this.getQuotationVendorListBySiteRefAndCompanyRef();
  }

  closeCopyModal = async (type: number) => {
    this.isCopyMaterialModalOpen = false;
  };

  getCopyMaterialListByVendorRefAndSiteRef = async () => {
    if (this.CopyVendorRef <= 0) {
      // await this.uiUtils.showErrorToster('Vendor not Selected');
      await this.toastService.present('Vendor not Selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }

    let lst = await Quotation.FetchEntireListByCompanyVendorAndSiteRef(this.companyRef, this.CopyVendorRef, this.Entity.p.SiteRef, async errMsg => {
      // await this.uiUtils.showErrorMessage('Error', errMsg)
      await this.toastService.present('Error' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    if (lst.length > 0) {
      let BlankRefData = lst[0].p.MaterialQuotationDetailsArray.map((data) => {
        data.Ref = 0;
        return data;
      });
      this.Entity.p.MaterialQuotationDetailsArray = BlankRefData;
      this.isCopyMaterialModalOpen = false;
    } else {
      // await this.uiUtils.showErrorToster('No Data Found');
      await this.toastService.present('No Data Found', 1000, 'danger');
      await this.haptic.error();
    }
  }

  SaveQuotation = async () => {
    let lstFTO: FileTransferObject[] = [];
    this.Entity.p.CompanyRef = this.companyRef;
    this.Entity.p.CreatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
    this.Entity.p.UpdatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
    // this.Entity.p.Date = this.strCDT;

    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    console.log('entityToSave :', entityToSave);

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
      await this.toastService.present('Error' + tr.Message, 1000, 'danger');
      await this.haptic.error();
      return;
    } else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        // await this.uiUtils.showSuccessToster('Quotation saved successfully');
        await this.toastService.present('Quotation saved successfully', 1000, 'success');
        await this.haptic.success();
        this.Entity = Quotation.CreateNewInstance();
      } else {
        // await this.uiUtils.showSuccessToster('Quotation Updated successfully');
        await this.toastService.present('Quotation Updated successfully', 1000, 'success');
        await this.haptic.success();
      }
      await this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/vendor-quotation']);
    }
  };

  CalculateNetAmountAndTotalAmount = async () => {
    if (this.newQuotedMaterial.OrderedQty > this.newQuotedMaterial.EstimatedQty) {
      this.newQuotedMaterial.OrderedQty = 0;
      this.newQuotedMaterial.RequiredRemainingQuantity = 0;
      this.newQuotedMaterial.NetAmount = 0;
      this.newQuotedMaterial.TotalAmount = 0;
      return await this.toastService.present('Ordered Qty should be less then or equal to Required Qty', 1000, 'warning'), await this.haptic.warning();
    }

    this.newQuotedMaterial.RequiredRemainingQuantity = this.newQuotedMaterial.EstimatedQty - this.newQuotedMaterial.OrderedQty;
    if (this.newQuotedMaterial.DiscountedRate == 0) {
      this.newQuotedMaterial.NetAmount = (this.newQuotedMaterial.Rate * this.newQuotedMaterial.OrderedQty);
    } else {
      this.newQuotedMaterial.NetAmount = (this.newQuotedMaterial.DiscountedRate * this.newQuotedMaterial.OrderedQty);
    }
    let GstAmount = (this.newQuotedMaterial.NetAmount / 100) * this.newQuotedMaterial.Gst;
    this.newQuotedMaterial.TotalAmount = this.newQuotedMaterial.NetAmount + GstAmount + this.newQuotedMaterial.DeliveryCharges;
  }

  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  getGrandTotal(): number {
    return this.Entity.p.MaterialQuotationDetailsArray.reduce((total: number, item: any) => {
      return this.Entity.p.GrandTotal = total + Number(item.TotalAmount || 0);
    }, 0);
  }
  getQuotationVendorListBySiteRefAndCompanyRef = async () => {
    try {
      this.loadingService.show();
      let lst = await Quotation.FetchEntireListByCompanyRefAndSiteRef(this.companyRef, this.Entity.p.SiteRef,
        async (errMsg) => {
          //  await this.uiUtils.showErrorMessage('Error', errMsg)
          await this.toastService.present('Error' + errMsg, 1000, 'danger');
          await this.haptic.error();
        }
      );
      this.CopyVendorList = lst;
      console.log('lst :', lst);
    } catch (error) {
      
    }finally{
      this.loadingService.hide();
    }
  };

  public async selectCopyVenodrBottomsheet(): Promise<void> {
    try {
      const options = this.CopyVendorList;
      this.openSelectModal(options, this.selectedCopyVendor, false, 'Select Copy Vendor', 1, (selected) => {
        this.selectedCopyVendor = selected;
        console.log('selected :', selected);
        // this.newQuotedMaterial.ma = selected[0].p.MaterialRef;
        this.CopyVendorName = selected[0].p.VendorName;
        this.CopyVendorRef = selected[0].p.VendorRef;
        // this.onMaterialSelection(selected[0].p.MaterialRef)
      });

    } catch (error) {

    }
  }
  public async selectGSTBottomsheet(): Promise<void> {
    try {
      const options = this.GSTList.map((item) => ({ p: item }));;
      this.openSelectModal(options, this.selectedGST, false, 'Select GST', 1, (selected) => {
        this.selectedGST = selected;
        this.newQuotedMaterial.Gst = selected[0].p.Ref;
        this.gstName = selected[0].p.Name;
        this.CalculateNetAmountAndTotalAmount()
      });

    } catch (error) {

    }
  }

  public async selectMaterialBottomsheet(): Promise<void> {
    try {
      // debugger
      const options = this.MaterialRequisitionList;
      this.openSelectModal(options, this.selectedMaterial, false, 'Select Material', 1, (selected) => {
        this.selectedMaterial = selected;
        console.log('selected :', selected);
        // this.newQuotedMaterial.MaterialRequisitionDetailsRef = selected[0].p.MaterialName;
        // this.newQuotedMaterial.MaterialName = selected[0].p.MaterialName;
        this.newQuotedMaterial.MaterialRequisitionDetailsRef = selected[0].p.Ref;
        this.newQuotedMaterial.MaterialName = selected[0].p.MaterialName;
        this.MaterialName = selected[0].p.MaterialName;
        this.onMaterialSelection(this.newQuotedMaterial.MaterialRequisitionDetailsRef)
      });

    } catch (error) {

    }
  }

  public async selectVendorNameBottomsheet(): Promise<void> {
    try {
      const options = this.VendorList;
      this.openSelectModal(options, this.selectedVendorName, false, 'Select Vendor Name', 1, (selected) => {
        this.selectedVendorName = selected;
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
        this.onSiteSelection(selected[0].p.Ref)
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
