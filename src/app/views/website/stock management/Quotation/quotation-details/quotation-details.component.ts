import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { QuotatedMaterial, QuotatedMaterialDetailProps } from 'src/app/classes/domain/entities/website/stock_management/Quotation/QuotatedMaterial/quotatedmaterial';
import { Quotation } from 'src/app/classes/domain/entities/website/stock_management/Quotation/quotation';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
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
  localEstimatedStartingDate: string = '';
  localEstimatedEndDate: string = '';
  BookingRemarkList = DomainEnums.BookingRemarkList(true, '---Select Booking Remark---');
  plotheaders: string[] = ['Sr.No.', 'Plot No', 'Area sq.m', 'Area sq.ft', 'Goverment Rate', 'Company Rate', 'Action'];
  QuotatedMaterialheaders: string[] = ['Sr.No.', 'Name ', 'Contact No ', 'Email Id ', 'Address', 'Pin Code ', 'Action'];
  isQuotatedMaterialModalOpen: boolean = false;
  newQuotatedMaterial: QuotatedMaterialDetailProps = QuotatedMaterialDetailProps.Blank();
  editingIndex: null | undefined | number
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  NameWithoutNos: string = ValidationPatterns.NameWithoutNos
  PinCodePattern: string = ValidationPatterns.PinCode;
  INDPhoneNo: string = ValidationPatterns.INDPhoneNo;

  NameWithoutNosMsg: string = ValidationMessages.NameWithoutNosMsg
  PinCodeMsg: string = ValidationMessages.PinCodeMsg;
  INDPhoneNoMsg: string = ValidationMessages.INDPhoneNoMsg;
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg;


  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils, private companystatemanagement: CompanyStateManagement,
    private dtu: DTU,
  ) {
    effect(async () => {
      await this.getVendorListByCompanyRef(); await this.getSiteListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    await this.getSiteListByCompanyRef();
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Quotation' : 'Edit Quotation';
      this.Entity = Quotation.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');

    } else {
      this.Entity = Quotation.CreateNewInstance();
      Quotation.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(
      Quotation.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as Quotation;
  }

  getSiteListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
    // if (this.SiteList.length > 0) {
    //   this.Entity.p.SiteRef = this.SiteList[0].p.Ref;
    // }
  }

  getVendorListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Vendor.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.VendorList = lst;
    // if (this.SiteList.length > 0) {
    //   this.Entity.p.SiteRef = this.SiteList[0].p.Ref;
    // }
  }

  onVendorclick = (vendorRef: number) => {
    const SingleRecord = this.VendorList.filter(data => data.p.Ref == vendorRef);
    this.Entity.p.VendorTradeName = SingleRecord[0].p.TradeName
    this.Entity.p.VendorAddress = SingleRecord[0].p.AddressLine1
  }

  openModal(type: string) {
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
    if (!this.newQuotatedMaterial.MaterialRef || !this.newQuotatedMaterial.Unit || !this.newQuotatedMaterial.RequiredQuantity || !this.newQuotatedMaterial.OrderedQuantity || !this.newQuotatedMaterial.Rate || !this.newQuotatedMaterial.DiscountRate || !this.newQuotatedMaterial.Gst || !this.newQuotatedMaterial.DeliveryCharges || !this.newQuotatedMaterial.ExpectedDeliveryDate || !this.newQuotatedMaterial.NetAmount || !this.newQuotatedMaterial.TotalAmount) {
      await this.uiUtils.showErrorMessage('Error', 'Material, OrderedQuantity, Rate, DiscountRate, GST, Delivery Charges, Expected Delivery Date, Net Amount, TotalAmount Adderss are Required!');
      return;
    }

    if (this.editingIndex !== null && this.editingIndex !== undefined && this.editingIndex >= 0) {
      this.Entity.p.QuotationMaterialDetails[this.editingIndex] = { ...this.newQuotatedMaterial };
      await this.uiUtils.showSuccessToster('Quotated Material details updated successfully!');
      this.isQuotatedMaterialModalOpen = false;

    } else {
      let QuotatedMaterialInstance = new QuotatedMaterial(this.newQuotatedMaterial, true);
      let QuotationInstance = new Quotation(this.Entity.p, true);
      await QuotatedMaterialInstance.EnsurePrimaryKeysWithValidValues();
      await QuotationInstance.EnsurePrimaryKeysWithValidValues();

      this.newQuotatedMaterial.QuotationRef = this.Entity.p.Ref;
      this.Entity.p.QuotationMaterialDetails.push({ ...QuotatedMaterialInstance.p });
      await this.uiUtils.showSuccessToster('Quotated Material added successfully!');
      this.resetMaterialControls()
    }
    console.log('this.Entity.p.QuotationMaterialDetails :', this.Entity.p.QuotationMaterialDetails);

    this.newQuotatedMaterial = QuotatedMaterialDetailProps.Blank();
    this.editingIndex = null;
  }

  editQuotatedMaterial(index: number) {
    this.isQuotatedMaterialModalOpen = true
    this.newQuotatedMaterial = { ...this.Entity.p.QuotationMaterialDetails[index] }
    this.editingIndex = index;
  }

  async removeQuotatedMaterial(index: number) {
    // this.Entity.p.QuotationMaterialDetails.splice(index, 1); // Remove Quotated Material
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
     Are you sure that you want to DELETE this Quotated Material?`,
      async () => {
        this.Entity.p.QuotationMaterialDetails.splice(index, 1);
      }
    );
  }

  SaveQuotation = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.newQuotatedMaterial.QuotationRef = this.Entity.p.Ref
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
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


  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  BackQuotation = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Quotation Management Form?`,
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

