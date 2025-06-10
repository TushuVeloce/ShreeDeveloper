import { Component, effect, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { RequiredMaterial } from 'src/app/classes/domain/entities/website/stock_management/material_requisition/requiredmaterial/requiredmaterial';
import { QuotatedMaterial, QuotatedMaterialDetailProps } from 'src/app/classes/domain/entities/website/stock_management/Quotation/QuotatedMaterial/quotatedmaterial';
import { Quotation } from 'src/app/classes/domain/entities/website/stock_management/Quotation/quotation';
import { FileTransferObject } from 'src/app/classes/infrastructure/filetransferobject';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';
@Component({
  selector: 'app-quotation-details',
  standalone: false,
  templateUrl: './quotation-details.component.html',
  styleUrls: ['./quotation-details.component.scss'],
})
export class QuotationDetailsComponent implements OnInit {

  Entity: Quotation = Quotation.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Quotation' | 'Edit Quotation' = 'New Quotation';
  IsDropdownDisabled: boolean = false;
  InitialEntity: Quotation = null as any;
  SiteList: Site[] = [];
  VendorList: Vendor[] = [];
  MaterialRequisitionList: RequiredMaterial[] = [];
  QuotationDate: string = '';
  ExceptedDeliveryDate: string = '';
  QuotatedMaterialheaders: string[] = ['Sr.No.', 'Material ', 'Unit', 'Required Quantity', 'Ordered Quantity', 'Rate', 'Discount Rate', 'GST', 'Delivery Charges', 'Expected Delivery Date', 'Net Amount', 'Total Amount', 'Action'];
  isQuotatedMaterialModalOpen: boolean = false;
  newQuotatedMaterial: QuotatedMaterialDetailProps = QuotatedMaterialDetailProps.Blank();
  editingIndex: null | undefined | number
  companyRef = this.companystatemanagement.SelectedCompanyRef;

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
      this.DetailsFormTitle = this.IsNewEntity ? 'New Quotation' : 'Edit Quotation';
      this.Entity = Quotation.GetCurrentInstance();
      this.imagePostView = `${this.ImageBaseUrl}${this.Entity.p.InvoicePath}/${this.LoginToken}?${this.TimeStamp}`;
      this.selectedFileName = this.Entity.p.InvoicePath;

      this.QuotationDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date);
      this.appStateManage.StorageKey.removeItem('Editable');

    } else {
      this.Entity = Quotation.CreateNewInstance();
      Quotation.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(Quotation.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as Quotation;
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
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Vendor.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
  }

  getMaterialRequisitionListByVendorRefAndSiteRef = async () => {
    if (this.Entity.p.VendorRef <= 0) {
      await this.uiUtils.showErrorToster('Vendor not Selected');
      return;
    }
    if (this.Entity.p.SiteRef <= 0) {
      await this.uiUtils.showErrorToster('Site not Selected');
      return;
    }
    let lst = await RequiredMaterial.FetchEntireListByCompanyVendorAndSiteRef(this.companyRef(), this.Entity.p.VendorRef, this.Entity.p.SiteRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MaterialRequisitionList = lst;
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
    const SingleRecord = this.MaterialRequisitionList.filter(data => data.p.Ref == MaterialRef);
    this.newQuotatedMaterial.UnitName = SingleRecord[0].p.UnitName
    this.newQuotatedMaterial.EstimatedQty = SingleRecord[0].p.EstimatedQty
    this.newQuotatedMaterial.MaterialRequisitionDetailsName = SingleRecord[0].p.MaterialName
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
    if (this.Entity.p.SiteRef <= 0) {
      this.uiUtils.showErrorToster('Site not Selected');
      return;
    }
    if (this.Entity.p.VendorRef <= 0) {
      this.uiUtils.showErrorToster('Vendor not Selected');
      return;
    }
    this.getMaterialRequisitionListByVendorRefAndSiteRef();
    if (type === 'QuotatedMaterial') this.isQuotatedMaterialModalOpen = true;
  }

  closeModal = async (type: string) => {
    if (type === 'QuotatedMaterial') {
      const keysToCheck = ['Name', 'Address', 'ContactNo', 'EmailId', 'PinCode', 'CityName', 'StateName', 'CountryName'] as const;

      const hasData = keysToCheck.some(
        key => (this.newQuotatedMaterial as any)[key]?.toString().trim()
      );

      if (hasData) {
        await this.uiUtils.showConfirmationMessage(
          'Close',
          `This process is <strong>IRREVERSIBLE!</strong><br/>
           Are you sure you want to close this modal?`,
          async () => {
            this.isQuotatedMaterialModalOpen = false;
            this.newQuotatedMaterial = QuotatedMaterialDetailProps.Blank();
          }
        );
      } else {
        this.isQuotatedMaterialModalOpen = false;
        this.newQuotatedMaterial = QuotatedMaterialDetailProps.Blank();
      }
    }
  };


  async addQuotatedMaterial() {
    if (!this.newQuotatedMaterial.EstimatedQty || !this.newQuotatedMaterial.OrderedQty || !this.newQuotatedMaterial.Rate || !this.newQuotatedMaterial.DiscountedRate || !this.newQuotatedMaterial.Gst || !this.newQuotatedMaterial.DeliveryCharges || !this.newQuotatedMaterial.NetAmount || !this.newQuotatedMaterial.TotalAmount) {
      await this.uiUtils.showErrorMessage('Error', 'Material, Ordered Qty, Rate, Discount Rate, GST, Delivery Charges, Expected Delivery Date, Net Amount, TotalAmount Adderss are Required!');
      return;
    }
    this.newQuotatedMaterial.ExceptedDeliveryDate = this.dtu.ConvertStringDateToFullFormat(this.ExceptedDeliveryDate);
    this.ExceptedDeliveryDate = '';
    if (this.editingIndex !== null && this.editingIndex !== undefined && this.editingIndex >= 0) {
      this.Entity.p.MaterialQuotationDetailsArray[this.editingIndex] = { ...this.newQuotatedMaterial };
      await this.uiUtils.showSuccessToster('Quotated Material details updated successfully!');
      this.isQuotatedMaterialModalOpen = false;

    } else {
      let QuotatedMaterialInstance = new QuotatedMaterial(this.newQuotatedMaterial, true);
      let QuotationInstance = new Quotation(this.Entity.p, true);
      await QuotatedMaterialInstance.EnsurePrimaryKeysWithValidValues();
      await QuotationInstance.EnsurePrimaryKeysWithValidValues();

      this.newQuotatedMaterial.MaterialQuotationRef = this.Entity.p.Ref;
      this.Entity.p.MaterialQuotationDetailsArray.push({ ...QuotatedMaterialInstance.p });
      await this.uiUtils.showSuccessToster('Quotated Material added successfully!');
      this.resetMaterialControls()
    }
    this.newQuotatedMaterial = QuotatedMaterialDetailProps.Blank();
    this.editingIndex = null;
  }

  editQuotatedMaterial(index: number) {
    this.isQuotatedMaterialModalOpen = true
    this.newQuotatedMaterial = { ...this.Entity.p.MaterialQuotationDetailsArray[index] }
    this.editingIndex = index;
    this.ExceptedDeliveryDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.MaterialQuotationDetailsArray[index].ExceptedDeliveryDate);
    this.getMaterialRequisitionListByVendorRefAndSiteRef();
  }

  async removeQuotatedMaterial(index: number) {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
     Are you sure that you want to DELETE this Quotated Material?`,
      async () => {
        this.Entity.p.MaterialQuotationDetailsArray.splice(index, 1);
      }
    );
  }

  SaveQuotation = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.newQuotatedMaterial.MaterialQuotationRef = this.Entity.p.Ref
    this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    this.Entity.p.Date = this.dtu.ConvertStringDateToFullFormat(this.QuotationDate);

    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];

    let lstFTO: FileTransferObject[] = [FileTransferObject.FromFile("InvoiceFile", this.InvoiceFile, this.InvoiceFile.name)];
    let tr = await this.utils.SavePersistableEntities(entitiesToSave, lstFTO); if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message)
      return;
    } else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Quotation saved successfully!');
        this.Entity = Quotation.CreateNewInstance();
        this.resetAllControls()
      } else {
        await this.uiUtils.showSuccessToster('Quotation Updated successfully!');
        await this.router.navigate(['/homepage/Website/Quotation']);
      }
    }
  };

  CalculateNetAmountAndTotalAmount = () => {
    let GstAmount = (this.newQuotatedMaterial.DiscountedRate / 100) * this.newQuotatedMaterial.Gst;
    this.newQuotatedMaterial.NetAmount = (this.newQuotatedMaterial.DiscountedRate * this.newQuotatedMaterial.OrderedQty);
    this.newQuotatedMaterial.TotalAmount = this.newQuotatedMaterial.NetAmount + GstAmount + this.newQuotatedMaterial.DeliveryCharges;
  }

  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  BackQuotation = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Quotation Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Quotation']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Quotation']);
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

