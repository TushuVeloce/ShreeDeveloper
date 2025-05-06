import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { DomainEnums, MarketingModes } from 'src/app/classes/domain/domainenums/domainenums';
import { MarketingManagement } from 'src/app/classes/domain/entities/website/MarketingManagement/marketingmanagement';
import { MarketingType } from 'src/app/classes/domain/entities/website/masters/marketingtype/marketingtype';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Unit } from 'src/app/classes/domain/entities/website/masters/unit/unit';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { VendorService } from 'src/app/classes/domain/entities/website/masters/vendorservices/vendorservices';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-marketing-management-master-details',
  standalone:false,
  templateUrl: './marketing-management-master-details.component.html',
  styleUrls: ['./marketing-management-master-details.component.scss'],
})
export class MarketingManagementMasterDetailsComponent  implements OnInit {
 Entity: MarketingManagement = MarketingManagement.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Marketing' | 'Edit Marketing' = 'New Marketing';
  IsDropdownDisabled: boolean = false;
  InitialEntity: MarketingManagement = null as any;
  SiteList: Site[] = [];
  VendorList: Vendor[] = [];
  MarketingModesList = DomainEnums.MarketingModesList(true, '--Select Modes Type--');
  MarketingType = MarketingModes
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  NameWithNosAndSpace: string = ValidationPatterns.NameWithNosAndSpace
  NameWithNosAndSpaceMsg: string = ValidationMessages.NameWithNosAndSpaceMsg
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg
  serviceNamesString: string = '';
  VendorServiceList: VendorService[] = [];

  @ViewChild('NameCtrl') NameInputControl!: NgModel;
  @ViewChild('CodeCtrl') CodeInputControl!: NgModel;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement
  ) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.getVendorListByCompanyRef()
    this.SiteList = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity? 'New Marketing': 'Edit Marketing';
      this.Entity = MarketingManagement.GetCurrentInstance();
      console.log('Entity :', this.Entity);
      this.appStateManage.StorageKey.removeItem('Editable');
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    } else {
      this.Entity = MarketingManagement.CreateNewInstance();
      MarketingManagement.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(
      MarketingManagement.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as MarketingManagement;
    this.focusInput();
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
    this.getVendorServiceListByVendorRef();
  }

  getVendorServiceListByVendorRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await VendorService.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.VendorServiceList = lst;
    // if (this.VendorList.length > 0) {
    //   this.Entity.p.VendorServiceRef = this.VendorServiceList[0].p.Ref;
    // }
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
    console.log('services:', services);
    const name = services?.p?.Name || '';
    this.serviceNamesString = name;
  };
  
 
  calculateTotal= () => {
    const Rate = Number(this.Entity.p.Rate);
    const Quantity = Number(this.Entity.p.Quantity);
    this.Entity.p.Total = Math.ceil(Rate * Quantity);
  }

  SaveMarketingManagementMaster = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    console.log('entityToSave :', entityToSave);
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);

    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    } else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('MarketingManagement Master saved successfully!');
        this.Entity = MarketingManagement.CreateNewInstance();
        this.resetAllControls();
      } else {
        await this.uiUtils.showSuccessToster('MarketingManagement Master Updated successfully!');
        await this.router.navigate(['/homepage/Website/Marketing_Management']);
      }
    }
  };

  BackMarketingManagement = () => {
    this.router.navigate(['/homepage/Website/Marketing_Management']);
  }

  resetAllControls = () => {
    // reset touched
    this.NameInputControl.control.markAsUntouched();
    this.CodeInputControl.control.markAsUntouched();

    // reset dirty

    this.NameInputControl.control.markAsPristine();
    this.CodeInputControl.control.markAsPristine();
  }
}

