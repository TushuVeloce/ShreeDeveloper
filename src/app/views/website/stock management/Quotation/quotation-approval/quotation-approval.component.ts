import { Component, effect, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { MaterialRequisitionStatuses } from 'src/app/classes/domain/domainenums/domainenums';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { RequiredMaterial } from 'src/app/classes/domain/entities/website/stock_management/material_requisition/requiredmaterial/requiredmaterial';
import { QuotedMaterial, QuotedMaterialDetailProps } from 'src/app/classes/domain/entities/website/stock_management/Quotation/QuotatedMaterial/quotatedmaterial';
import { Quotation } from 'src/app/classes/domain/entities/website/stock_management/Quotation/quotation';
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
  selector: 'app-quotation-approval',
  standalone: false,
  templateUrl: './quotation-approval.component.html',
  styleUrls: ['./quotation-approval.component.scss'],
})
export class QuotationApprovalComponent implements OnInit {

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
  CurrentDate: string = '';
  ExpectedDeliveryDate: string = '';
  QuotedMaterialheaders: string[] = ['Sr.No.', 'Material ', 'Unit', 'Required Quantity', 'Ordered Quantity', 'Required Remaining Quantity', 'Rate', 'Discount Rate', 'GST', 'Delivery Charges', 'Expected Delivery Date', 'Net Amount', 'Total Amount'];
  isQuotedMaterialModalOpen: boolean = false;
  newQuotedMaterial: QuotedMaterialDetailProps = QuotedMaterialDetailProps.Blank();
  editingIndex: null | undefined | number
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  MaterialQuotationStatus = MaterialRequisitionStatuses;
  strCDT: string = ''

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
    });
  }

  async ngOnInit() {
    this.ImageBaseUrl = this.baseUrl.GenerateImageBaseUrl();

    this.LoginToken = this.appStateManage.getLoginToken();
    this.appStateManage.setDropdownDisabled(true);
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

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
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

  SaveQuotation = async (status: number) => {
    let lstFTO: FileTransferObject[] = [];
    this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    this.Entity.p.MaterialQuotationStatus = status;
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
        await this.uiUtils.showSuccessToster('Quotation saved successfully');
        this.Entity = Quotation.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster('Quotation Status Updated successfully');
      }
      await this.router.navigate(['/homepage/Website/Quotation']);
    }
  };

  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  BackQuotation = async () => {
    await this.router.navigate(['/homepage/Website/Quotation']);
  }
}

