import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { City } from 'src/app/classes/domain/entities/website/masters/city/city';
import { Company } from 'src/app/classes/domain/entities/website/masters/company/company';
import { Country } from 'src/app/classes/domain/entities/website/masters/country/country';
import { State } from 'src/app/classes/domain/entities/website/masters/state/state';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
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
  CompanyTypeList = DomainEnums.CompanyTypeList(
    true,
    '--Select Company Type--'
  );
  errors = { company_image: '' };
  allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private cdr: ChangeDetectorRef,
    private dtu: DTU,
    private datePipe: DatePipe
  ) {}

  // Handle file selection
  handleFileChange(event: any) {
    const fileInput = event.target.files[0];

    if (fileInput) {
      if (this.allowedImageTypes.includes(fileInput.type)) {
        this.file = fileInput;
        this.errors.company_image = '';
        if (this.file) {
          this.imageUrl = this.createObjectURL(this.file);
        }
        this.cdr.detectChanges();
      } else {
        this.errors.company_image =
          'Only image files (JPG, PNG, GIF) are allowed';
        this.file = null;
        this.imageUrl = null;
      }
    }
  }
  async ngOnInit() {
    await this.FormulateCountryList();
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;

      this.DetailsFormTitle = this.IsNewEntity ? 'New Company' : 'Edit Company';
      this.Entity = Company.GetCurrentInstance();

      this.dateOfInCorporation = this.datePipe.transform(this.dtu.FromString(this.Entity.p.DateOfInCorporation),'yyyy-MM-dd' );

      this.lastDateOfFirstFinancialYear = this.datePipe.transform(this.dtu.FromString(this.Entity.p.LastDateOfFirstFinancialYear), 'yyyy-MM-dd');

      this.appStateManage.StorageKey.removeItem('Editable');
      if (this.Entity.p.CountryRef) {
        await this.getStateListByCountryRef(this.Entity.p.CountryRef);
      }
      if (this.Entity.p.StateRef) {
        await this.getCityListByStateRef(this.Entity.p.StateRef);
      }
    } else {
      this.Entity = Company.CreateNewInstance();
      this.dateOfInCorporation = ''
      this.lastDateOfFirstFinancialYear = ''
      Company.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(
      Company.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as Company;
    // this.focusInput();
  }

   FormulateCountryList = async () => {
    this.CountryList = [];
    console.log('CountryList :', this.CountryList);
    let lst = await Country.FetchEntireList(
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.CountryList = lst;
  };

  getStateListByCountryRef = async (CountryRef: number) => {
    this.StateList = [];
    let lst = await State.FetchEntireListByCountryRef(
      CountryRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.StateList = lst;
  };

  getCityListByStateRef = async (StateRef: number) => {
    this.CityList = [];
    let lst = await City.FetchEntireListByStateRef(
      StateRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.CityList = lst;
  };

  
  dateOfInCorporation: string | null = null;
  lastDateOfFirstFinancialYear: string | null = null;
//  lastDateOfFirstFinancialYear: Date = null as any;

  SaveCompanyMaster = async () => {
    let entityToSave = this.Entity.GetEditableVersion();

  // ------ Code For Date Of InCorporation Year Format ---------------//
    if (this.dateOfInCorporation) {
      let dateValue = new Date(this.dateOfInCorporation);

      if (!isNaN(dateValue.getTime())) {
        entityToSave.p.DateOfInCorporation =
          this.dtu.DateStartStringFromDateValue(dateValue);
      } else {
        entityToSave.p.DateOfInCorporation = '';
      }
    }
  // ------ Code For Last Date Of First Financial Year Format ---------------//
    if (this.lastDateOfFirstFinancialYear) {
      let dateValue = new Date(this.lastDateOfFirstFinancialYear);

      if (!isNaN(dateValue.getTime())) {
        entityToSave.p.LastDateOfFirstFinancialYear =
          this.dtu.DateEndStringFromDateValue(dateValue);
      } else {
        entityToSave.p.LastDateOfFirstFinancialYear = '';
      }
    }
    let entitiesToSave = [entityToSave];
    console.log('entitiesToSave :', entitiesToSave);
    // await this.Entity.EnsurePrimaryKeysWithValidValues()
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);

    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorToster(tr.Message);
      return
    }
    else {
      this.isSaveDisabled = false;
      // this.onEntitySaved.emit(entityToSave);
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Company saved successfully!');
      this.dateOfInCorporation = ''
      this.lastDateOfFirstFinancialYear = ''
        this.Entity = Company.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster('Company Updated successfully!');
        this.dateOfInCorporation = ''
        this.lastDateOfFirstFinancialYear = ''
      }
    }
  };

  createObjectURL(file: File): string {
    return URL.createObjectURL(file);
  }

  BackCompany() {
    this.router.navigate(['/homepage/Website/Company_Master']);
  }
}
