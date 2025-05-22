import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { DomainEnums, MarketingModes } from 'src/app/classes/domain/domainenums/domainenums';
import { MarketingManagement } from 'src/app/classes/domain/entities/website/MarketingManagement/marketingmanagement';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { MarketingType } from 'src/app/classes/domain/entities/website/masters/marketingtype/marketingtype';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Unit } from 'src/app/classes/domain/entities/website/masters/unit/unit';
import { ServiceSuppliedByVendorProps, Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { VendorService } from 'src/app/classes/domain/entities/website/masters/vendorservices/vendorservices';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-marketing-management-master-details',
  standalone: false,
  templateUrl: './marketing-management-master-details.component.html',
  styleUrls: ['./marketing-management-master-details.component.scss'],
})
export class MarketingManagementMasterDetailsComponent implements OnInit {
  Entity: MarketingManagement = MarketingManagement.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Marketing' | 'Edit Marketing' = 'New Marketing';
  IsDropdownDisabled: boolean = false;
  InitialEntity: MarketingManagement = null as any;
  SiteList: Site[] = [];
  VendorList: Vendor[] = [];
  VendorServiceList: ServiceSuppliedByVendorProps[] = [];
  VendorServiceListByVendor: VendorService[] = [];
  EmployeeList: Employee[] = [];
  MarketingModesList = DomainEnums.MarketingModesList(true, '--Select Modes Type--');
  MarketingType = MarketingModes
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  NameWithNosAndSpace: string = ValidationPatterns.NameWithNosAndSpace
  NameWithNosAndSpaceMsg: string = ValidationMessages.NameWithNosAndSpaceMsg
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg
  serviceNamesString: string = '';
  strCDT: string = ''

  @ViewChild('DateCtrl') DateInputControl!: NgModel;
  @ViewChild('PlaceCtrl') PlaceInputControl!: NgModel;
  @ViewChild('RateCtrl') RateInputControl!: NgModel;
  @ViewChild('QuantityCtrl') QuantityInputControl!: NgModel;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement,
    private dtu: DTU,
  ) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.getVendorListByCompanyRef()
    this.getEmployeeListByCompanyRef()
    this.SiteList = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Marketing' : 'Edit Marketing';
      this.Entity = MarketingManagement.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      if (this.Entity.p.Date != '') {
        this.Entity.p.Date = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date)
      }
      this.getVendorServiceListByVendorRef(this.Entity.p.VendorRef);
    } else {
      this.Entity = MarketingManagement.CreateNewInstance();
      MarketingManagement.SetCurrentInstance(this.Entity);
      if (this.Entity.p.Date == '') {
        this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
        let parts = this.strCDT.substring(0, 16).split('-');
        // Construct the new date format
        this.Entity.p.Date = `${parts[0]}-${parts[1]}-${parts[2]}`;
        this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
      }
    }
    this.InitialEntity = Object.assign(
      MarketingManagement.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as MarketingManagement;
    this.focusInput();
  }


  getEmployeeListByCompanyRef = async () => {
    let lst = await Employee.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.EmployeeList = lst;
  }

  getVendorListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Vendor.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.VendorList = lst;
    // if (this.VendorList.length > 0) {
    //   this.Entity.p.VendorRef = this.VendorList[0].p.Ref;
    // }
    // this.getVendorServiceListByVendorRef();
  }

   private FormulateVendorServiceList = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.VendorServiceListByVendor = []
    let lst = await VendorService.FetchEntireListByCompanyRef(this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.VendorServiceListByVendor = lst;
  };

  getVendorServiceListByVendorRef = async (VendorRef: number) => {
    if (this.IsNewEntity) {
      this.Entity.p.VendorServiceRef = 0
    }
    this.VendorServiceList = []
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Vendor.FetchInstance(VendorRef, this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.VendorServiceList = lst.p.ServiceListSuppliedByVendor;
    this.VendorServiceListByVendor = []; // Clear existing list first
    if (this.VendorServiceList.length > 0) {
      await this.FormulateVendorServiceList();
      const refArray = this.VendorServiceList.map(s => Number(s));
      const matched = this.VendorServiceListByVendor.filter(service => refArray.includes(service.p.Ref));
      console.log('matched :', matched);
      this.VendorServiceListByVendor = matched; // Either matched list or stays empty
    }
  }

  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  focusInput = () => {
    let txtName = document.getElementById('SiteRef')!;
    txtName.focus();
  }

  onVendorChange = async (vendorref: number) => {
    this.serviceNamesString = '';
    const services = await VendorService.FetchInstance(vendorref, async errMsg =>
      await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    const name = services?.p?.Name || '';
    this.serviceNamesString = name;
  };


  calculateTotal = () => {
    const Rate = Number(this.Entity.p.Rate);
    const Quantity = Number(this.Entity.p.Quantity);
    this.Entity.p.Total = Math.ceil(Rate * Quantity);
  }



  SaveMarketingManagementMaster = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
    this.Entity.p.Date = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.Date)
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    console.log('entitiesToSave :', entitiesToSave);

    let tr = await this.utils.SavePersistableEntities(entitiesToSave);

    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    } else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Marketing Management saved successfully!');
        this.Entity = MarketingManagement.CreateNewInstance();
        this.resetAllControls();
      } else {
        await this.uiUtils.showSuccessToster('Marketin Management Updated successfully!');
        this.BackMarketingManagement()
      }
    }
  };

  BackMarketingManagement = () => {
    this.router.navigate(['/homepage/Website/Marketing_Management']);
  }

  resetAllControls = () => {
    // reset touched
    this.DateInputControl.control.markAsUntouched();
    this.PlaceInputControl.control.markAsUntouched();
    this.RateInputControl.control.markAsUntouched();
    this.QuantityInputControl.control.markAsUntouched();

    // reset dirty

    this.DateInputControl.control.markAsPristine();
    this.PlaceInputControl.control.markAsPristine();
    this.RateInputControl.control.markAsPristine();
    this.QuantityInputControl.control.markAsPristine();
  }
}

