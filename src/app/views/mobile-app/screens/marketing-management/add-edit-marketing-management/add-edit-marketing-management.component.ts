import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomainEnums, MarketingModes } from 'src/app/classes/domain/domainenums/domainenums';
import { MarketingManagement } from 'src/app/classes/domain/entities/website/MarketingManagement/marketingmanagement';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { VendorService } from 'src/app/classes/domain/entities/website/masters/vendorservices/vendorservices';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BottomsheetMobileAppService } from 'src/app/services/bottomsheet-mobile-app.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-edit-marketing-management',
  templateUrl: './add-edit-marketing-management.component.html',
  styleUrls: ['./add-edit-marketing-management.component.scss'],
  standalone: false
})
export class AddEditMarketingManagementComponent implements OnInit {
  isLoading: boolean = false;
  Entity: MarketingManagement = MarketingManagement.CreateNewInstance();
  public IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Marketing' | 'Edit Marketing' = 'New Marketing';
  IsDropdownDisabled: boolean = false;
  InitialEntity: MarketingManagement = null as any;
  SiteList: Site[] = [];
  VendorList: Vendor[] = [];
  MarketingModesList = DomainEnums.MarketingModesList();
  MarketingType = MarketingModes
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  serviceNamesString: string = '';
  Date: string | null = null;
  SiteName: string = '';
  MarketingTypeName: string = '';
  VendorName: string = '';
  VendorServiceName: string = '';

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement,
    private bottomsheetMobileAppService: BottomsheetMobileAppService
  ) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.SiteList = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.VendorList = await Vendor.FetchEntireListByCompanyRef(this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Marketing' : 'Edit Marketing';
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
  }

  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
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


  calculateTotal = () => {
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
      } else {
        await this.uiUtils.showSuccessToster('MarketingManagement Master Updated successfully!');
        await this.router.navigate(['/homepage/Website/Marketing_Management']);
      }
    }
  };

  goBack() {
    this.router.navigate(['/app_homepage/tabs/task-management']);
  }
  public async selectVendorServicesBottomsheet(): Promise<void> {
    try {
      // Filter the list before mapping
      // const filteredList = this.CustomerStatusList.filter(
      //   (item) => item.Ref !== CustomerStatus.ConvertToDeal && item.Ref !== CustomerStatus.LeadClosed
      // );

      // const options = this.MarketingModesList.map((item) => ({ p: item }));
      const options = this.VendorList;

      let selectData: any[] = [];

      this.openSelectModal(options, selectData, false, 'Select Services', 1, (selected) => {
        selectData = selected;
        // console.log('selected :', selected);
        // this.Entity.p.VendorRef = selected[0].p.Ref;
        this.serviceNamesString = selected[0].p.Name;
        this.VendorServiceName = selected[0].p.Name;
        // this.getStateListByCountryRef(selected[0].p.Ref)
      });
    } catch (error) {
      // console.log('error :', error);
    }
  }
  public async selectVendorBottomsheet(): Promise<void> {
    try {
      // Filter the list before mapping
      // const filteredList = this.CustomerStatusList.filter(
      //   (item) => item.Ref !== CustomerStatus.ConvertToDeal && item.Ref !== CustomerStatus.LeadClosed
      // );

      // const options = this.MarketingModesList.map((item) => ({ p: item }));
      const options = this.VendorList;

      let selectData: any[] = [];

      this.openSelectModal(options, selectData, false, 'Select Vendor', 1, (selected) => {
        selectData = selected;
        // console.log('selected :', selected);
        this.Entity.p.VendorRef = selected[0].p.Ref;
        this.VendorName = selected[0].p.Name;
        // this.getStateListByCountryRef(selected[0].p.Ref)
      });
    } catch (error) {
      // console.log('error :', error);
    }
  }
  public async selectMarketingTypeBottomsheet(): Promise<void> {
    try {
      // Filter the list before mapping
      // const filteredList = this.CustomerStatusList.filter(
      //   (item) => item.Ref !== CustomerStatus.ConvertToDeal && item.Ref !== CustomerStatus.LeadClosed
      // );

      const options = this.MarketingModesList.map((item) => ({ p: item }));
      // const options = this.SiteList;

      let selectData: any[] = [];

      this.openSelectModal(options, selectData, false, 'Select Marketing Type', 1, (selected) => {
        selectData = selected;
        // console.log('selected :', selected);
        this.Entity.p.MarketingTypeRef = selected[0].p.Ref;
        this.MarketingTypeName = selected[0].p.Name;
        // this.getStateListByCountryRef(selected[0].p.Ref)
      });
    } catch (error) {
      // console.log('error :', error);
    }
  }
  public async selectSiteBottomsheet(): Promise<void> {
    try {
      // Filter the list before mapping
      // const filteredList = this.CustomerStatusList.filter(
      //   (item) => item.Ref !== CustomerStatus.ConvertToDeal && item.Ref !== CustomerStatus.LeadClosed
      // );

      // const options = this.MarketingModesList.map((item) => ({ p: item }));
      const options = this.SiteList;

      let selectData: any[] = [];

      this.openSelectModal(options, selectData, false, 'Select Site', 1, (selected) => {
        selectData = selected;
        // console.log('selected :', selected);
        this.Entity.p.SiteRef = selected[0].p.Ref;
        this.SiteName = selected[0].p.Name;
        // this.getStateListByCountryRef(selected[0].p.Ref)
      });
    } catch (error) {
      // console.log('error :', error);
    }
  }
  private async openSelectModal(
    dataList: any[],
    selectedItems: any[],
    multiSelect: boolean,
    title: string,
    MaxSelection: number,
    updateCallback: (selected: any[]) => void
  ): Promise<void> {
    const selected = await this.bottomsheetMobileAppService.openSelectModal(dataList, selectedItems, multiSelect, title, MaxSelection);
    if (selected) updateCallback(selected);
  }

}
