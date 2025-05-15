import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { City } from 'src/app/classes/domain/entities/website/masters/city/city';
import { Company } from 'src/app/classes/domain/entities/website/masters/company/company';
import { Country } from 'src/app/classes/domain/entities/website/masters/country/country';
import { State } from 'src/app/classes/domain/entities/website/masters/state/state';
import { FileTransferObject } from 'src/app/classes/infrastructure/filetransferobject';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-company-master-details',
  standalone: false,
  templateUrl: './company-master-details.component.html',
  styleUrls: ['./company-master-details.component.scss'],
})
export class CompanyMasterDetailsComponent implements OnInit {
  Entity: Company = Company.CreateNewInstance();
  CountryList: Country[] = [];
  file: File | null = null;
  imageUrl: string | null = null;
  StateList: State[] = [];
  CityList: City[] = [];
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Company' | 'Edit Company' = 'New Company';
  IsDropdownDisabled: boolean = false;
  InitialEntity: Company = null as any;
  CompanyTypeList = DomainEnums.CompanyTypeList(true, '--Select Company Type--');
  errors = { company_image: '' };
  allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
  dateOfInCorporation: string | null = null;
  lastDateOfFirstFinancialYear: string | null = null;
  ImageBaseUrl: string = "";


  NameWithNosAndSpace: string = ValidationPatterns.NameWithNosAndSpace
  Email: string = ValidationPatterns.Email
  PinCode: string = ValidationPatterns.PinCode;
  GSTIN: string = ValidationPatterns.GSTIN;
  PAN: string = ValidationPatterns.PAN;


  NameWithNosAndSpaceMsg: string = ValidationMessages.NameWithNosAndSpaceMsg
  PinCodeMsg: string = ValidationMessages.PinCodeMsg;
  PANMsg: string = ValidationMessages.PANMsg;
  EmailMsg: string = ValidationMessages.EmailMsg
  GSTINMsg: string = ValidationMessages.GSTINMsg
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg;
  imageBlobUrl: string | null = null;
  TimeStamp = Date.now()
  LoginToken = '';

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private cdr: ChangeDetectorRef,
    private dtu: DTU,
    private datePipe: DatePipe,
    private http: HttpClient,
    private baseUrl: BaseUrlService
  ) { }


  async ngOnInit() {
    // this.ImageBaseUrl = this.appStateManage.BaseImageUrl;
    this.ImageBaseUrl = this.baseUrl.GenerateImageBaseUrl();

    this.LoginToken = this.appStateManage.getLoginToken();

    this.appStateManage.setDropdownDisabled(true);

    await this.FormulateCountryList();

    // Load State based on Default Country Ref
    if (this.Entity.p.CountryRef) {
      await this.getStateListByCountryRef(this.Entity.p.CountryRef);
    }

    // Load Cities based on Default State Ref
    if (this.Entity.p.StateRef) {
      await this.getCityListByStateRef(this.Entity.p.StateRef);
    }

    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;

      this.DetailsFormTitle = this.IsNewEntity ? 'New Company' : 'Edit Company';
      this.Entity = Company.GetCurrentInstance();
      this.imageUrl = this.Entity.p.LogoPath;

      // While Edit Converting date String into Date Format //
      this.dateOfInCorporation = this.datePipe.transform(
        this.dtu.FromString(this.Entity.p.DateOfInCorporation),
        'yyyy-MM-dd'
      );

      // While Edit Converting date String into Date Format //
      this.lastDateOfFirstFinancialYear = this.datePipe.transform(
        this.dtu.FromString(this.Entity.p.LastDateOfFirstFinancialYear),
        'yyyy-MM-dd'
      );

      this.appStateManage.StorageKey.removeItem('Editable');
      if (this.Entity.p.CountryRef) {
        await this.getStateListByCountryRef(this.Entity.p.CountryRef);
      }
      if (this.Entity.p.StateRef) {
        await this.getCityListByStateRef(this.Entity.p.StateRef);
      }
    } else {
      this.Entity = Company.CreateNewInstance();
      this.dateOfInCorporation = ''; // Clear Date
      this.lastDateOfFirstFinancialYear = ''; // Clear Date
    }
    this.InitialEntity = Object.assign(Company.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as Company;

    // this.focusInput();
    const fullUrl = this.ImageBaseUrl + this.imageUrl;
    // this.http.get(fullUrl, { responseType: 'blob' }).subscribe(blob => {
    //   this.imageBlobUrl = URL.createObjectURL(blob);
    // });
  }
  onImageUpload = async (event: any) => {
    const result = await this.utils.handleImageSelection(
      event,
      this.allowedImageTypes
    );

    if (result.error) {
      // If there is an error, show it and reset values
      this.file = null;
      this.imageUrl = null;
      this.errors.company_image = result.error;
    } else {
      // If valid, assign values
      this.file = result.file;
      // this.imageUrl = result.imageUrl;
      this.errors.company_image = '';
      this.Entity.p.CompanyLogo = this.file!;
    }
  }

  FormulateCountryList = async () => {
    this.CountryList = await Country.FetchEntireList(
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );

    // Set default country if exists
    if (this.CountryList.length) {
      const defaultCountry = this.CountryList.find(c => c.p.Ref === this.Entity.p.CountryRef);
      this.Entity.p.CountryRef = defaultCountry ? defaultCountry.p.Ref : this.CountryList[0].p.Ref;

      // Fetch the corresponding states
      await this.getStateListByCountryRef(this.Entity.p.CountryRef);
    }
  }

  getStateListByCountryRef = async (CountryRef: number) => {
    this.StateList = await State.FetchEntireListByCountryRef(
      CountryRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );

    // Set default state if exists
    if (this.StateList.length) {
      const defaultState = this.StateList.find(s => s.p.Ref === this.Entity.p.StateRef);
      this.Entity.p.StateRef = defaultState ? defaultState.p.Ref : this.StateList[0].p.Ref;

      // Fetch the corresponding cities
      await this.getCityListByStateRef(this.Entity.p.StateRef);
    }
  }

  getCityListByStateRef = async (StateRef: number) => {
    this.CityList = await City.FetchEntireListByStateRef(
      StateRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );

    // Set default city if exists
    if (this.CityList.length) {
      const defaultCity = this.CityList.find(c => c.p.Ref === this.Entity.p.CityRef);
      this.Entity.p.CityRef = defaultCity ? defaultCity.p.Ref : this.CityList[0].p.Ref;
    }
  }

  SaveCompanyMaster = async () => {
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
    let entityToSave = this.Entity.GetEditableVersion();
    // ------ Code For Save Date Of InCorporation Year Format ---------------//
    if (this.dateOfInCorporation) {
      let dateValue = new Date(this.dateOfInCorporation);

      if (!isNaN(dateValue.getTime())) {
        entityToSave.p.DateOfInCorporation =
          this.dtu.DateStartStringFromDateValue(dateValue);
      } else {
        entityToSave.p.DateOfInCorporation = '';
      }
    }
    // ------ Code For Save Last Date Of First Financial Year Format ---------------//
    if (this.lastDateOfFirstFinancialYear) {
      let dateValue = new Date(this.lastDateOfFirstFinancialYear);

      if (!isNaN(dateValue.getTime())) {
        entityToSave.p.LastDateOfFirstFinancialYear =
          this.dtu.DateEndStringFromDateValue(dateValue);
      } else {
        entityToSave.p.LastDateOfFirstFinancialYear = '';
      }
    }
    let lstFTO: FileTransferObject[] = [FileTransferObject.FromFile("Company_Logo", this.Entity.p.CompanyLogo, this.Entity.p.CompanyLogo.name)];
    let entitiesToSave = [entityToSave];
    let tr = await this.utils.SavePersistableEntities(entitiesToSave, lstFTO);

    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    } else {
      this.isSaveDisabled = false;
      // this.onEntitySaved.emit(entityToSave);
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Company saved successfully!');
        this.dateOfInCorporation = '';
        this.lastDateOfFirstFinancialYear = '';
        this.Entity = Company.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster('Company Updated successfully!');
        this.dateOfInCorporation = '';
        this.lastDateOfFirstFinancialYear = '';
        this.BackCompany();
      }
    }
  };

  createObjectURL = (file: File): string => {
    return URL.createObjectURL(file);
  }

  BackCompany = () => {
    this.router.navigate(['/homepage/Website/Company_Master']);
  }
}
