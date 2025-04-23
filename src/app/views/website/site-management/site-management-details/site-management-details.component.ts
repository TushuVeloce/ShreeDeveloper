import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
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
  localEstimatedStartingDate: string  = '';
  localEstimatedEndDate: string  = '';
  BookingRemarkList = DomainEnums.BookingRemarkList(true, '---Select Booking Remark---');
  plotheaders: string[] = ['Sr.No.', 'Plot No', 'Area sq.m', 'Area sq.ft', 'Goverment Rate', 'Company Rate', 'Action'];
  ownerheaders: string[] = ['Sr.No.', 'Name ', 'Contact No ', 'Email Id ', 'Address', 'Pin Code ', 'Action'];
  isOwnerModalOpen: boolean = false;
  newOwner: OwnerDetailProps = OwnerDetailProps.Blank(); 
  editingIndex: null | undefined | number
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  NameWithoutNos: string = ValidationPatterns.NameWithoutNos
  PinCodePattern: string = ValidationPatterns.PinCode;

  NameWithoutNosMsg: string = ValidationMessages.NameWithoutNosMsg
  PinCodeMsg: string = ValidationMessages.PinCodeMsg;
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg;

  @ViewChild('NameCtrl') NameInputControl!: NgModel;
  @ViewChild('AddressLine1Ctrl') AddressLine1InputControl!: NgModel;
  @ViewChild('AddressLine2Ctrl') AddressLine2InputControl!: NgModel;
  @ViewChild('PinCodeCtrl') PinCodeInputControl!: NgModel;
  @ViewChild('TotalLandAreaInSqmCtrl') TotalLandAreaInSqmInputControl!: NgModel;
  @ViewChild('TotalLandAreaInSqftCtrl') TotalLandAreaInSqftInputControl!: NgModel;
  @ViewChild('NumberOfPlotsCtrl') NumberOfPlotsInputControl!: NgModel;
  @ViewChild('OwnerNameCtrl') OwnerNameInputControl!: NgModel;
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
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Site' : 'Edit Site';
      this.Entity = Site.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');
      console.log('Entity :', this.Entity);
      if(this.Entity.p.EstimatedStartingDate != ''){
        this.localEstimatedStartingDate= this.dtu.ConvertStringDateToShortFormat(this.Entity.p.EstimatedStartingDate)
       }
      if(this.Entity.p.EstimatedEndDate != ''){
        this.localEstimatedEndDate= this.dtu.ConvertStringDateToShortFormat(this.Entity.p.EstimatedEndDate)
       }
      if (this.Entity.p.CountryRef) {
        this.getStateListByCountryRefforSite(this.Entity.p.CountryRef);
      }
      if (this.Entity.p.StateRef) {
        this.getCityListByStateRefforSite(this.Entity.p.StateRef);
      }
      if(this.Entity.p.SiteManagementOwnerDetails[0].CountryRef){
        this.getStateListByCountryRefforOwner(this.Entity.p.SiteManagementOwnerDetails[0].CountryRef);
      }
      if(this.Entity.p.SiteManagementOwnerDetails[0].StateRef){
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
  }

  getEmployeeListByCompanyRef = async () => {
    let lst = await Employee.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.EmployeeList = lst;
  }

  getStateListByCountryRefforSite = async (CountryRef: number) => {
    this.StateListforSite = [];
    this.CityListforSite = [];
    if (CountryRef) {
      let lst = await State.FetchEntireListByCountryRef(CountryRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.StateListforSite = lst;

      if (CountryRef !== this.Entity.p.CountryRef) {
        this.Entity.p.StateRef = 0;
        this.Entity.p.CityRef = 0;
      }
    } else {
      this.Entity.p.StateRef = 0;
      this.Entity.p.CityRef = 0;
    }
  }

  getCityListByStateRefforSite = async (StateRef: number) => {
    this.CityListforSite = [];

    if (StateRef) {
      let lst = await City.FetchEntireListByStateRef(StateRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.CityListforSite = lst;

      if (StateRef !== this.Entity.p.StateRef) {
        this.Entity.p.CityRef = 0;
      }
    } else {
      this.Entity.p.CityRef = 0;
    }
  }

  getStateListByCountryRefforOwner = async (CountryRef: number) => {
  console.log('CountryRef :', CountryRef);
    this.StateListforOwner = [];
    this.CityListforOwner = [];
    this.newOwner.StateRef = 0;
    this.newOwner.CityRef = 0;
    if (CountryRef) {
      let lst = await State.FetchEntireListByCountryRef(CountryRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.StateListforOwner = lst;
  }
}

  getCityListByStateRefforOwner = async (StateRef: number) => {
    this.CityListforOwner = [];
    this.newOwner.CityRef = 0;
    if (StateRef) {
      let lst = await City.FetchEntireListByStateRef(StateRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.CityListforOwner = lst;
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
    if (!this.newOwner.Name || !this.newOwner.ContactNo || !this.newOwner.CountryRef || !this.newOwner.StateRef || !this.newOwner.CityRef || !this.newOwner.Address) {
      await this.uiUtils.showErrorMessage('Error','Name, Contact No, Country, State, City, Adderss are Required!');
      return;
    }

    if (this.editingIndex !== null && this.editingIndex !== undefined && this.editingIndex >= 0) {
      this.Entity.p.SiteManagementOwnerDetails[this.editingIndex] = { ...this.newOwner };
      await this.uiUtils.showSuccessToster('Owner details updated successfully!');
      this.isOwnerModalOpen = false;

    } else {
      let ownerInstance = new Owner(this.newOwner, true);
      let siteInstance = new Site(this.Entity.p, true);
      await ownerInstance.EnsurePrimaryKeysWithValidValues(); 
      await siteInstance.EnsurePrimaryKeysWithValidValues(); 

      this.newOwner.SiteManagementRef = this.Entity.p.Ref;
      this.Entity.p.SiteManagementOwnerDetails.push({ ...ownerInstance.p });
      await this.uiUtils.showSuccessToster('Owner added successfully!');
      this.resetOwnerControls()
    }

    this.newOwner = OwnerDetailProps.Blank();
    this.editingIndex = null; 
  }

  editowner(index: number) {
    console.log('index :', index);
    this.isOwnerModalOpen = true
    this.newOwner = { ...this.Entity.p.SiteManagementOwnerDetails[index] }
    console.log('this.newOwner  :', this.newOwner );
    this.editingIndex = index;
  }

  removeowner(index: number) {
    this.Entity.p.SiteManagementOwnerDetails.splice(index, 1); // Remove owner
  }

  SaveSite = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.LoginEmployeeRef = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    this.newOwner.SiteManagementRef = this.Entity.p.Ref
    this.Entity.p.TotalLandAreaInSqft = this.Entity.p.TotalLandAreaInSqm * 10.7639
    this.Entity.p.EstimatedStartingDate = this.dtu.ConvertStringDateToFullFormat(this.localEstimatedStartingDate)
    this.Entity.p.EstimatedEndDate = this.dtu.ConvertStringDateToFullFormat(this.localEstimatedEndDate)
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    console.log('sitemanagemnt :', entitiesToSave);
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message)
      return;
    } else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Site saved successfully!');
        this.Entity = Site.CreateNewInstance();
        this.resetAllControls()
      } else {
        await this.uiUtils.showSuccessToster('Site Updated successfully!');
      }
    }
  };

  convertSqmToSqft() {
    if (this.Entity.p.TotalLandAreaInSqm) {
      this.Entity.p.TotalLandAreaInSqft = parseFloat((this.Entity.p.TotalLandAreaInSqm * 10.7639).toFixed(3));
    } else {
      this.Entity.p.TotalLandAreaInSqft = 0;
    }
  }

  convertSqftToSqm() {
    if (this.Entity.p.TotalLandAreaInSqft) {
      this.Entity.p.TotalLandAreaInSqm = parseFloat((this.Entity.p.TotalLandAreaInSqft / 10.7639).toFixed(3));
    } else {
      this.Entity.p.TotalLandAreaInSqm = 0;
    }
  }

  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  BackSiteManagement() {
    this.router.navigate(['/homepage/Website/site_management_Master']);
  }

  resetAllControls = () => {
    this.NameInputControl.control.markAsUntouched();
    this.AddressLine1InputControl.control.markAsUntouched();
    this.AddressLine2InputControl.control.markAsUntouched();
    this.PinCodeInputControl.control.markAsUntouched();
    this.TotalLandAreaInSqmInputControl.control.markAsUntouched();
    this.TotalLandAreaInSqftInputControl.control.markAsUntouched();
    this.NumberOfPlotsInputControl.control.markAsUntouched();
  


    this.NameInputControl.control.markAsPristine();
    this.AddressLine1InputControl.control.markAsPristine();
    this.AddressLine2InputControl.control.markAsPristine();
    this.PinCodeInputControl.control.markAsPristine();
    this.TotalLandAreaInSqmInputControl.control.markAsPristine();
    this.TotalLandAreaInSqftInputControl.control.markAsPristine();
    this.NumberOfPlotsInputControl.control.markAsPristine();

  }

  resetOwnerControls = () => {
    this.OwnerNameInputControl.control.markAsUntouched();
    this.OwnerContactNosInputControl.control.markAsUntouched();
    this.OwnerAddressInputControl.control.markAsUntouched();
    this.OwnerPincodeInputControl.control.markAsUntouched();

    this.OwnerNameInputControl.control.markAsPristine();
    this.OwnerContactNosInputControl.control.markAsPristine();
    this.OwnerAddressInputControl.control.markAsPristine();
    this.OwnerPincodeInputControl.control.markAsPristine();
  }
}
