import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { City } from 'src/app/classes/domain/entities/website/masters/city/city';
import { Country } from 'src/app/classes/domain/entities/website/masters/country/country';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { Owner, OwnerDetailProps } from 'src/app/classes/domain/entities/website/masters/site/owner/owner';
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
  EmployeeList: Employee[] = [];
  CountryListforSite: Country[] = [];
  StateListforSite: State[] = [];
  CityListforSite: City[] = [];
  CountryListforOwner: Country[] = [];
  StateListforOwner: State[] = [];
  CityListforOwner: City[] = [];
  BookingRemarkList = DomainEnums.BookingRemarkList(true, '---Select Booking Remark---');
  plotheaders: string[] = ['Sr.No.', 'Plot No', 'Area sq.m', 'Area sq.ft', 'Goverment Rate', 'Company Rate', 'Action'];
  ownerheaders: string[] = ['Sr.No.', 'Name ', 'Contact No ', 'Email Id ', 'Address', 'Pin Code ', 'Action'];
  isModalOpen1: boolean = false;
  isModalOpen2: boolean = false;
  // newPlot: PlotDetailProps = new PlotDetailProps(); // Store all added plots
  newOwner: OwnerDetailProps = OwnerDetailProps.Blank(); // Creates a new instance with `isNewlyCreated = true`
  editingIndex: null | undefined | number

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils, private companystatemanagement: CompanyStateManagement
  ) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.CountryListforSite = await Country.FetchEntireList();
    this.CountryListforOwner = await Country.FetchEntireList();
    this.EmployeeList = await Employee.FetchEntireList();
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Site' : 'Edit Site';
      this.Entity = Site.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');
      console.log('Entity :', this.Entity);


      if (this.Entity.p.CountryRef) {
        this.getStateListByCountryRefforSite(this.Entity.p.CountryRef);
        this.getStateListByCountryRefforOwner(this.Entity.p.CountryRef);
      }
      if (this.Entity.p.StateRef) {
        this.getCityListByStateRefforSite(this.Entity.p.StateRef);
        this.getCityListByStateRefforOwner(this.Entity.p.StateRef);
      }
    } else {
      this.Entity = Site.CreateNewInstance();
      Site.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(
      Site.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as Site;
  }

  getStateListByCountryRefforSite = async (CountryRef: number) => {
    this.StateListforSite = [];
    this.CityListforSite = [];
    if (CountryRef) {
      let lst = await State.FetchEntireListByCountryRef(CountryRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.StateListforSite = lst;

      if (CountryRef !== this.Entity.p.CountryRef) {
        // Reset StateRef and CityRef when country is changed
        this.Entity.p.StateRef = 0;
        this.Entity.p.CityRef = 0;
      }
    } else {
      // Clear selections if country is cleared
      this.Entity.p.StateRef = 0;
      this.Entity.p.CityRef = 0;
    }
  }

  getCityListByStateRefforSite = async (StateRef: number) => {
    this.CityListforSite = [];

    if (StateRef) {
      let lst = await City.FetchEntireListByStateRef(StateRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.CityListforSite = lst;
      // console.log('CityList :', this.CityListforSite);

      if (StateRef !== this.Entity.p.StateRef) {
        // Reset CityRef when state is changed
        this.Entity.p.CityRef = 0;
      }
    } else {
      // Clear selection if state is cleared
      this.Entity.p.CityRef = 0;
    }
  }

  getStateListByCountryRefforOwner = async (CountryRef: number) => {
    // this.newOwner.StateRef = 0;
    // this.newOwner.CityRef = 0;
    this.StateListforOwner = [];
    this.CityListforOwner = [];
    if (CountryRef) {
      let lst = await State.FetchEntireListByCountryRef(CountryRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.StateListforOwner = lst;
      if (CountryRef !== this.newOwner.CountryRef) {
        // Reset StateRef and CityRef when country is changed
        this.newOwner.StateRef = 0;
        this.newOwner.CityRef = 0;
      }
    } else {
      // Clear selections if country is cleared
      this.newOwner.StateRef = 0;
      this.newOwner.CityRef = 0;
    }
  }

  getCityListByStateRefforOwner = async (StateRef: number) => {
    // this.newOwner.CityRef = 0;
    this.CityListforOwner = [];
    if (StateRef) {
      let lst = await City.FetchEntireListByStateRef(StateRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.CityListforOwner = lst;
      if (StateRef !== this.newOwner.StateRef) {
        // Reset CityRef when state is changed
        this.newOwner.CityRef = 0;
      }
    } else {
      // Clear selection if state is cleared
      this.newOwner.CityRef = 0;
    }

  }

  openModal(type: string) {
    if (type === 'plot') this.isModalOpen1 = true;
    if (type === 'owner') this.isModalOpen2 = true;
  }

  closeModal(type: string) {
    if (type === 'plot') this.isModalOpen1 = false;
    if (type === 'owner') this.isModalOpen2 = false;
  }

  // addPlot() {
  //      if (!this.newPlot.PlotNo || !this.newPlot.AreaInSqm || !this.newPlot.AreaInSqft || !this.newPlot.GovermentRatePerSqm || !this.newPlot.GovermentRatePerSqft
  //       || !this.newPlot.BasicRatePerSqm || !this.newPlot.BasicRatePerSqft || !this.newPlot.BookingRemark
  //      ) {
  //       alert('Please fill in required fields');
  //       return;
  //     }

  //     this.Entity.p.PlotDetailsList.push({ ...this.newPlot }); // Push new plot
  //     this.newPlot = new PlotDetailProps(); // Reset form after adding
  //   }


  async addOwner() {
    if (!this.newOwner.Name || !this.newOwner.ContactNo) {
      await this.uiUtils.showWarningToster('All Fields are Required!');
      return;
    }

    // If editing, update the existing record
    if (this.editingIndex !== null && this.editingIndex !== undefined && this.editingIndex >= 0) {
      this.Entity.p.SiteManagementOwnerDetails[this.editingIndex] = { ...this.newOwner };
      await this.uiUtils.showSuccessToster('Owner details updated successfully!');
      this.isModalOpen2 = false; // Close modal

    } else {
      // Create an Owner instance to generate a valid Ref
      let ownerInstance = new Owner(this.newOwner, true);
      let siteInstance = new Site(this.Entity.p, true);
      await ownerInstance.EnsurePrimaryKeysWithValidValues(); // Assign a valid Ref
      await siteInstance.EnsurePrimaryKeysWithValidValues(); // Assign a valid Ref
      console.log("ref", siteInstance.p.Ref);

      this.newOwner.SiteManagementRef = this.Entity.p.Ref;
      this.Entity.p.SiteManagementOwnerDetails.push({ ...ownerInstance.p });
      await this.uiUtils.showSuccessToster('Owner added successfully!');
    }

    // Reset form and editingIndex after saving
    this.newOwner = OwnerDetailProps.Blank();
    this.editingIndex = null; // Ensure index is cleared after each operation
  }


  // removePlot(index: number) {
  //   this.Entity.p.PlotDetailsList.splice(index, 1); // Remove plot
  // }

  editowner(index: number) {
    console.log('index :', index);
    this.isModalOpen2 = true
    this.newOwner = { ...this.Entity.p.SiteManagementOwnerDetails[index] }
    this.editingIndex = index;
  }

  removeowner(index: number) {
    this.Entity.p.SiteManagementOwnerDetails.splice(index, 1); // Remove owner
  }

  // async addplotvalidation(){
  //   if(this.Entity.p.NumberOfPlots == this.Entity.p.PlotDetailsList.length + 1){
  //     this.isModalOpen1 = true
  //   }else if(this.Entity.p.NumberOfPlots == 0 && this.Entity.p.PlotDetailsList.length == 0){
  //     await this.uiUtils.showWarningToster('No plots can be added');
  //   }else{
  //     await this.uiUtils.showWarningToster('Only ' + this.Entity.p.NumberOfPlots +' '+ ' plots can be added');
  //   }
  // }

  SaveSite = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.newOwner.SiteManagementRef = this.Entity.p.Ref
    // this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
    this.Entity.p.TotalLandAreaInSqft = this.Entity.p.TotalLandAreaInSqm * 10.7639
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    console.log('sitemanagemnt :', entitiesToSave);
    // await this.Entity.EnsurePrimaryKeysWithValidValues()
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message)
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

  BackSiteManagement() {
    this.router.navigate(['/homepage/Website/site_management_Master']);
  }


}
