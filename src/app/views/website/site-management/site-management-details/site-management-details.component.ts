import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { City } from 'src/app/classes/domain/entities/website/masters/city/city';
import { Country } from 'src/app/classes/domain/entities/website/masters/country/country';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { Owner, OwnerDetailProps } from 'src/app/classes/domain/entities/website/masters/site/owner/owner';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { State } from 'src/app/classes/domain/entities/website/masters/state/state';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-site-management-details',
  standalone: false,
  templateUrl: './site-management-details.component.html',
  styleUrls: ['./site-management-details.component.scss'],
})
export class SiteManagementDetailsComponent implements OnInit {
  Entity: Site = Site.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Site' | 'Edit Site' = 'New Site';
  IsDropdownDisabled: boolean = false;
  InitialEntity: Site = null as any;
  EmployeeList: Employee[] = [];
  CountryListforSite: Country[] = [];
  StateListforSite: State[] = [];
  CityListforSite: City[] = [];
  CountryListforOwner: Country[] = [];
  StateListforOwner: State[] = [];
  CityListforOwner: City[] = [];
  localEstimatedStartingDate: string = '';
  localEstimatedEndDate: string = '';
  BookingRemarkList = DomainEnums.BookingRemarkList(true, '---Select Booking Remark---');
  plotheaders: string[] = ['Sr.No.', 'Plot No', 'Area sq.m', 'Area sq.ft', 'Goverment Rate', 'Company Rate', 'Action'];
  ownerheaders: string[] = ['Sr.No.', 'Name ', 'Contact No ', 'Email Id ', 'Address', 'Pin Code ', 'Action'];
  isOwnerModalOpen: boolean = false;
  newOwner: OwnerDetailProps = OwnerDetailProps.Blank();
  editingIndex: null | undefined | number
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  NameWithoutNos: string = ValidationPatterns.NameWithoutNos
  PinCodePattern: string = ValidationPatterns.PinCode;
  INDPhoneNo: string = ValidationPatterns.INDPhoneNo;
  Email: string = ValidationPatterns.Email;

  NameWithoutNosMsg: string = ValidationMessages.NameWithoutNosMsg
  PinCodeMsg: string = ValidationMessages.PinCodeMsg;
  INDPhoneNoMsg: string = ValidationMessages.INDPhoneNoMsg;
  EmailMsg: string = ValidationMessages.EmailMsg;
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg;

  @ViewChild('NameCtrl') NameInputControl!: NgModel;
  @ViewChild('AddressLine1Ctrl') AddressLine1InputControl!: NgModel;
  @ViewChild('AddressLine2Ctrl') AddressLine2InputControl!: NgModel;
  @ViewChild('EstimatedStartingDateCtrl') EstimatedStartingDateInputControl!: NgModel;
  @ViewChild('EstimatedEndDateCtrl') EstimatedEndDateInputControl!: NgModel;
  @ViewChild('PinCodeCtrl') PinCodeInputControl!: NgModel;
  @ViewChild('EstimatedCostCtrl') EstimatedCostInputControl!: NgModel;
  @ViewChild('TotalLandAreaInSqmCtrl') TotalLandAreaInSqmInputControl!: NgModel;
  @ViewChild('TotalLandAreaInSqftCtrl') TotalLandAreaInSqftInputControl!: NgModel;
  @ViewChild('NumberOfPlotsCtrl') NumberOfPlotsInputControl!: NgModel;
  @ViewChild('OwnerNameCtrl') OwnerNameInputControl!: NgModel;
  @ViewChild('OwnerEmailCtrl') OwnerEmailInputControl!: NgModel;
  @ViewChild('OwnerContactNosCtrl') OwnerContactNosInputControl!: NgModel;
  @ViewChild('OwnerAddressCtrl') OwnerAddressInputControl!: NgModel;
  @ViewChild('OwnerPincodeCtrl') OwnerPincodeInputControl!: NgModel;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils, private companystatemanagement: CompanyStateManagement,
    private dtu: DTU,
  ) { }

  async ngOnInit() {
    this.getEmployeeListByCompanyRef()
    this.appStateManage.setDropdownDisabled(true);
    this.CountryListforSite = await Country.FetchEntireList();
    this.CountryListforOwner = await Country.FetchEntireList();
    await this.FormulateCountryListforSite();
    await this.FormulateCountryListforOwner();
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Site' : 'Edit Site';
      this.Entity = Site.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');
      if (this.Entity.p.EstimatedStartingDate != '') {
        this.localEstimatedStartingDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.EstimatedStartingDate)
      }
      if (this.Entity.p.EstimatedEndDate != '') {
        this.localEstimatedEndDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.EstimatedEndDate)
      }
      if (this.Entity.p.CountryRef) {
        this.getStateListByCountryRefforSite(this.Entity.p.CountryRef);
      }
      if (this.Entity.p.StateRef) {
        this.getCityListByStateRefforSite(this.Entity.p.StateRef);
      }
      if (this.Entity.p.SiteManagementOwnerDetails[0].CountryRef) {
        this.getStateListByCountryRefforOwner(this.Entity.p.SiteManagementOwnerDetails[0].CountryRef);
      }
      if (this.Entity.p.SiteManagementOwnerDetails[0].StateRef) {
        this.getCityListByStateRefforOwner(this.Entity.p.SiteManagementOwnerDetails[0].StateRef);
      }
    } else {
      this.Entity = Site.CreateNewInstance();
      Site.SetCurrentInstance(this.Entity);
      if (this.Entity.p.CountryRef != 0) {
        this.getStateListByCountryRefforSite(this.Entity.p.CountryRef);
      }
    }
    this.InitialEntity = Object.assign(
      Site.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as Site;

    this.focusInput();
  }

  focusInput = () => {
    let txtName = document.getElementById('Name')!;
    txtName.focus();
  }

  getEmployeeListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Employee.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.EmployeeList = lst;
  }


  FormulateCountryListforSite = async () => {
    this.CountryListforSite = await Country.FetchEntireList(
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );

    // Set default country if exists
    if (this.CountryListforSite.length) {
      const defaultCountry = this.CountryListforSite.find(c => c.p.Ref === this.Entity.p.CountryRef);
      this.Entity.p.CountryRef = defaultCountry ? defaultCountry.p.Ref : this.CountryListforSite[0].p.Ref;

      // Fetch the corresponding states
      await this.getStateListByCountryRefforSite(this.Entity.p.CountryRef);
    }
  }

  getStateListByCountryRefforSite = async (CountryRef: number) => {
    this.StateListforSite = await State.FetchEntireListByCountryRef(
      CountryRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );

    // Set default state if exists
    if (this.StateListforSite.length) {
      const defaultState = this.StateListforSite.find(s => s.p.Ref === this.Entity.p.StateRef);
      this.Entity.p.StateRef = defaultState ? defaultState.p.Ref : this.StateListforSite[0].p.Ref;

      // Fetch the corresponding cities
      await this.getCityListByStateRefforSite(this.Entity.p.StateRef);
    }
  }

  getCityListByStateRefforSite = async (StateRef: number) => {
    this.CityListforSite = await City.FetchEntireListByStateRef(
      StateRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );

    // Set default city if exists
    if (this.CityListforSite.length) {
      const defaultCity = this.CityListforSite.find(c => c.p.Ref === this.Entity.p.CityRef);
      this.Entity.p.CityRef = defaultCity ? defaultCity.p.Ref : this.CityListforSite[0].p.Ref;
    }
  }

  FormulateCountryListforOwner = async () => {
    this.CountryListforOwner = await Country.FetchEntireList(
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );

    // Set default country if exists
    if (this.CountryListforOwner.length) {
      const defaultCountry = this.CountryListforOwner.find(c => c.p.Ref === this.newOwner.CountryRef);
      this.newOwner.CountryRef = defaultCountry ? defaultCountry.p.Ref : this.CountryListforOwner[0].p.Ref;

      // Fetch the corresponding states
      await this.getStateListByCountryRefforOwner(this.newOwner.CountryRef);
    }
  }

  getStateListByCountryRefforOwner = async (CountryRef: number) => {
    this.StateListforOwner = await State.FetchEntireListByCountryRef(
      CountryRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );

    // Set default state if exists
    if (this.StateListforOwner.length) {
      const defaultState = this.StateListforOwner.find(s => s.p.Ref === this.newOwner.StateRef);
      this.newOwner.StateRef = defaultState ? defaultState.p.Ref : this.StateListforOwner[0].p.Ref;

      // Fetch the corresponding cities
      await this.getCityListByStateRefforOwner(this.newOwner.StateRef);
    }
  }

  getCityListByStateRefforOwner = async (StateRef: number) => {
    this.CityListforOwner = await City.FetchEntireListByStateRef(
      StateRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );

    // Set default city if exists
    if (this.CityListforOwner.length) {
      const defaultCity = this.CityListforOwner.find(c => c.p.Ref === this.newOwner.CityRef);
      this.newOwner.CityRef = defaultCity ? defaultCity.p.Ref : this.CityListforOwner[0].p.Ref;
    }
  }

  openModal(type: string) {
    if (type === 'owner') this.isOwnerModalOpen = true;
  }

  closeModal = async (type: string) => {
    if (type === 'owner') {
      const keysToCheck = ['Name', 'Address', 'ContactNo', 'EmailId', 'PinCode', 'CityName', 'StateName', 'CountryName'] as const;

      const hasData = keysToCheck.some(
        key => (this.newOwner as any)[key]?.toString().trim()
      );

      if (hasData) {
        await this.uiUtils.showConfirmationMessage(
          'Close',
          `This process is <strong>IRREVERSIBLE!</strong><br/>
           Are you sure you want to close this modal?`,
          async () => {
            this.isOwnerModalOpen = false;
            this.newOwner = OwnerDetailProps.Blank();
          }
        );
      } else {
        this.isOwnerModalOpen = false;
        this.newOwner = OwnerDetailProps.Blank();
      }
    }
  };


  async addOwner() {

    if (!this.newOwner.Name) {
      return this.uiUtils.showWarningToster('Owner Name cannot be blank.');
    }
    if (!this.newOwner.ContactNo) {
      return this.uiUtils.showWarningToster('Contact No cannot be blank.');
    } else if (!new RegExp(ValidationPatterns.INDPhoneNo).test(this.newOwner.ContactNo)) {
      return this.uiUtils.showWarningToster(ValidationMessages.INDPhoneNoMsg);
    }

    if (!this.newOwner.CountryRef) {
      return this.uiUtils.showWarningToster('Country cannot be blank.');
    }
    if (!this.newOwner.StateRef) {
      return this.uiUtils.showWarningToster('State cannot be blank.');
    }
    if (!this.newOwner.CityRef) {
      return this.uiUtils.showWarningToster('City cannot be blank.');
    }

    if (this.editingIndex !== null && this.editingIndex !== undefined && this.editingIndex >= 0) {
      this.Entity.p.SiteManagementOwnerDetails[this.editingIndex] = { ...this.newOwner };
      await this.uiUtils.showSuccessToster('Owner details updated successfully');
      this.isOwnerModalOpen = false;
      this.newOwner = OwnerDetailProps.Blank();

    } else {
      let ownerInstance = new Owner(this.newOwner, true);
      let siteInstance = new Site(this.Entity.p, true);
      await ownerInstance.EnsurePrimaryKeysWithValidValues();
      await siteInstance.EnsurePrimaryKeysWithValidValues();

      this.newOwner.SiteManagementRef = this.Entity.p.Ref;
      this.Entity.p.SiteManagementOwnerDetails.push({ ...ownerInstance.p });
      await this.uiUtils.showSuccessToster('Owner added successfully');
      this.isOwnerModalOpen = false;
      this.newOwner = OwnerDetailProps.Blank();
    }

    this.editingIndex = null;
  }

  editowner(index: number) {
    this.isOwnerModalOpen = true
    this.newOwner = { ...this.Entity.p.SiteManagementOwnerDetails[index] }
    this.editingIndex = index;
  }

  async removeowner(index: number) {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
     Are you sure that you want to DELETE this Owner?`,
      async () => {
        this.Entity.p.SiteManagementOwnerDetails.splice(index, 1);
      }
    );
  }

  convertSqmToSqft() {
    if (this.Entity.p.TotalLandAreaInSqm) {
      this.Entity.p.TotalLandAreaInSqft = parseFloat((this.Entity.p.TotalLandAreaInSqm * 10.76).toFixed(2));
    } else {
      this.Entity.p.TotalLandAreaInSqft = 0;
    }
  }

  convertSqftToSqm() {
    if (this.Entity.p.TotalLandAreaInSqft) {
      this.Entity.p.TotalLandAreaInSqm = parseFloat((this.Entity.p.TotalLandAreaInSqft / 10.76).toFixed(2));
    } else {
      this.Entity.p.TotalLandAreaInSqm = 0;
    }
  }

  restrictToTwoDecimalsForSqFt(event: any): void {
    const input = event.target.value;

    // Allow only valid number with up to 2 decimal places
    const regex = /^\d*\.?\d{0,2}$/;

    if (!regex.test(input)) {
      // Remove last character if it makes the value invalid
      event.target.value = input.slice(0, -1);
    }

    // Update model manually
    this.Entity.p.TotalLandAreaInSqft = parseFloat(event.target.value) || 0;
    this.convertSqftToSqm()
  }

  restrictToTwoDecimalsForSqm(event: any): void {
    const input = event.target.value;

    const regex = /^\d*\.?\d{0,2}$/;

    if (!regex.test(input)) {
      event.target.value = input.slice(0, -1);
    }

    this.Entity.p.TotalLandAreaInSqm = parseFloat(event.target.value) || 0;
    this.convertSqmToSqft()
  }


  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  SaveSite = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.LoginEmployeeRef = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    this.newOwner.SiteManagementRef = this.Entity.p.Ref
    this.Entity.p.EstimatedStartingDate = this.dtu.ConvertStringDateToFullFormat(this.localEstimatedStartingDate)
    this.Entity.p.EstimatedEndDate = this.dtu.ConvertStringDateToFullFormat(this.localEstimatedEndDate)
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
        await this.uiUtils.showSuccessToster('Site saved successfully');
        this.Entity = Site.CreateNewInstance();
        this.localEstimatedStartingDate = '';
        this.localEstimatedEndDate = '';
        this.resetAllControls()
      } else {
        await this.uiUtils.showSuccessToster('Site Updated successfully');
      }
      await this.router.navigate(['/homepage/Website/Site_Management']);
    }
  };

  BackSiteManagement = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Site Management Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Site_Management']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Site_Management']);
    }
  }

  resetAllControls = () => {
    this.NameInputControl.control.markAsUntouched();
    this.AddressLine1InputControl.control.markAsUntouched();
    this.AddressLine2InputControl.control.markAsUntouched();
    this.EstimatedStartingDateInputControl.control.markAsUntouched();
    this.EstimatedEndDateInputControl.control.markAsUntouched();
    this.PinCodeInputControl.control.markAsUntouched();
    this.EstimatedCostInputControl.control.markAsUntouched();
    this.TotalLandAreaInSqmInputControl.control.markAsUntouched();
    this.TotalLandAreaInSqftInputControl.control.markAsUntouched();
    this.NumberOfPlotsInputControl.control.markAsUntouched();

    this.NameInputControl.control.markAsPristine();
    this.AddressLine1InputControl.control.markAsPristine();
    this.AddressLine2InputControl.control.markAsPristine();
    this.EstimatedStartingDateInputControl.control.markAsPristine();
    this.EstimatedEndDateInputControl.control.markAsPristine();
    this.PinCodeInputControl.control.markAsPristine();
    this.EstimatedCostInputControl.control.markAsPristine();
    this.TotalLandAreaInSqmInputControl.control.markAsPristine();
    this.TotalLandAreaInSqftInputControl.control.markAsPristine();
    this.NumberOfPlotsInputControl.control.markAsPristine();

  }
}
