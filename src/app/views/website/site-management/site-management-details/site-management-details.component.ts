import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
import { City } from 'src/app/classes/domain/entities/website/masters/city/city';
import { Country } from 'src/app/classes/domain/entities/website/masters/country/country';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { State } from 'src/app/classes/domain/entities/website/masters/state/state';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
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
  CountryList: Country[] = [];
  EmployeeList: Employee[] = [];
  StateList: State[] = [];
  CityList: City[] = [];

  plotheaders: string[] = ['Sr.No.', 'Plot No', 'Area sq.m', 'Area sq.ft', 'Goverment Rate', 'Company Rate', 'Action'];
  ownerheaders: string[] = ['Sr.No.', 'Name ', 'Contact No ', 'Email Id ', 'AddressLine 1 ', 'AddressLine 2 ','Pin Code ', 'Action'];
  isModalOpen1: boolean = false;
  isModalOpen2: boolean = false;
  plots: any[] = []; // Store all added plots
  newPlot = {
    PlotNo: '',
    AreaInSqm: '',
    AreaInSqft: '',
    GovermentRatePerSqm: '',
    GovermentRatePerSqft:'',
    BasicRatePerSqm : '',
    BasicRatePerSqft : '',
    BookingRemark : '',
    CustomerName: '',
    Address: '',
    MobNo: '',
    Reference: '',
  };

  owners: any[] = []; // Store all added plots
  newOwner= {
    Name: '',
    ContactNo : '',
    EmailId : '',
    AddressLine1: '',
    AddressLine2: '',
    PinCode : '',
  };

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,private companystatemanagement: CompanyStateManagement
  ) {}

 async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.CountryList = await Country.FetchEntireList();
    this.EmployeeList = await Employee.FetchEntireList();
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
          this.IsNewEntity = false;
    
          this.DetailsFormTitle = this.IsNewEntity
            ? 'New Site'
            : 'Edit Site';
          this.Entity = Site.GetCurrentInstance();
          this.appStateManage.StorageKey.removeItem('Editable');
        } else {
          this.Entity = Site.CreateNewInstance();
          Site.SetCurrentInstance(this.Entity);
        }
        this.InitialEntity = Object.assign(
          Site.CreateNewInstance(),
          this.utils.DeepCopy(this.Entity)
        ) as Site;
   }

getStateListByCountryRef = async (CountryRef: number) => {
    this.Entity.p.StateRef = 0;
    this.Entity.p.CityRef = 0;
    this.StateList = [];
    this.CityList = [];
    let lst = await State.FetchEntireListByCountryRef(CountryRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.StateList = lst;
  }

  getCityListByStateRef = async (StateRef: number) => {
    this.Entity.p.CityRef = 0;
    this.CityList = [];
    let lst = await City.FetchEntireListByStateRef(StateRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.CityList = lst;
  }

  openModal(type: string) {
    if (type === 'plot') this.isModalOpen1 = true;
    if (type === 'owner') this.isModalOpen2 = true;
  }

  closeModal(type: string) {
    if (type === 'plot') this.isModalOpen1 = false;
    if (type === 'owner') this.isModalOpen2 = false;
  }

  addPlot() {
    // Prevent adding empty fields
    if (this.newPlot.PlotNo && this.newPlot.AreaInSqm && this.newPlot.AreaInSqft && this.newPlot.MobNo) {
      this.plots.push({ ...this.newPlot });
      this.closeModal('plot');
      // Clear the form
      this.newPlot = {
        PlotNo: '',
        AreaInSqm: '',
        AreaInSqft: '',
        GovermentRatePerSqm : '',
        GovermentRatePerSqft:'',
        BasicRatePerSqm : '',
        BasicRatePerSqft : '',
        BookingRemark : '',
        CustomerName: '',
        Address: '',
        MobNo: '',
        Reference: '',
      };
    } else {
      alert('Please fill in all required fields.');
    }
  }

  addOwner() {
    // Prevent adding empty fields
    if (this.newOwner.Name && this.newOwner.ContactNo && this.newOwner.EmailId && this.newOwner.PinCode) {
      this.owners.push({ ...this.newOwner });
      this.closeModal('owner');
      // Clear the form
      this.newOwner = {
        Name: '',
        ContactNo : '',
        EmailId : '',
        AddressLine1: '',
        AddressLine2: '',
        PinCode : '',
      };
    } else {
      alert('Please fill in all required fields.');
    }
  }

  removePlot(index: number) {
    this.plots.splice(index, 1); // Remove the selected plot from the list
  }

  removeowner(index: number) {
    this.owners.splice(index, 1); // Remove the selected plot from the list
  }

  SaveSite = async () => {
      this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
      this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
      this.Entity.p.PlotDetailsList = this.plots
      this.Entity.p.OwnerDetailsList = this.owners
      let entityToSave = this.Entity.GetEditableVersion();
      let entitiesToSave = [entityToSave];
      console.log('entityToSave :', entityToSave);
      // await this.Entity.EnsurePrimaryKeysWithValidValues()
      let tr = await this.utils.SavePersistableEntities(entitiesToSave);
      if (!tr.Successful) {
        this.isSaveDisabled = false;
        this.uiUtils.showErrorToster(tr.Message);
        return;
      } else {
        this.isSaveDisabled = false;
        // this.onEntitySaved.emit(entityToSave);
        if (this.IsNewEntity) {
          await this.uiUtils.showSuccessToster('Site saved successfully!');
          this.Entity = Site.CreateNewInstance();
        } else {
          await this.uiUtils.showSuccessToster('Site Updated successfully!');
        }
      }
    };

  BackSiteManagement() {
    this.router.navigate(['/homepage/Website/site_management_Master']);
  }
}
