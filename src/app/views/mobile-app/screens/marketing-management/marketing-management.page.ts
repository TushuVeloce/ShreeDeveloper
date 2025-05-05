import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums, MarketingModes } from 'src/app/classes/domain/domainenums/domainenums';
import { MarketingManagement } from 'src/app/classes/domain/entities/website/MarketingManagement/marketingmanagement';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-marketing-management',
  templateUrl: './marketing-management.page.html',
  styleUrls: ['./marketing-management.page.scss'],
  standalone: false
})
export class MarketingManagementPage implements OnInit {
  Entity: MarketingManagement = MarketingManagement.CreateNewInstance();
  MasterList: MarketingManagement[] = [];
  DisplayMasterList: any[] = [];
  DigitalList: MarketingManagement[] = [];
  ElectronicsList: MarketingManagement[] = [];
  OutdoorList: MarketingManagement[] = [];
  PrintingMediaList: MarketingManagement[] = [];
  BrokerList: MarketingManagement[] = [];
  SiteList: Site[] = [];
  VendorList: Vendor[] = [];
  SearchString: string = '';
  SelectedMarketingManagement: MarketingManagement = MarketingManagement.CreateNewInstance();
  MarketingModesList = DomainEnums.MarketingModesList(true, '--Select Modes Type--');
  MarketingModes = MarketingModes;
  pageSize = 8; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  FromDate = '';
  ToDate = '';
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  ModalOpen: boolean = false;
  isLoading: boolean = false;

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService,
    private companystatemanagement: CompanyStateManagement
  ) {
    effect(async () => {
      await this.getMarketingListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.SiteList = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.VendorList = await Vendor.FetchEntireListByCompanyRef(this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
  }

  ionViewWillEnter = async () => {
    await this.getMarketingListByCompanyRef();
    // this.DisplayMasterList = [
    //   {
    //     p: {
    //       SiteName: "Site A",
    //       Date: "2025-05-05",
    //       MarketingTypeName: "Social Media",
    //       VendorName: "Vendor X",
    //       Rate: 1500,
    //       Quantity: 10,
    //       Total: 15000,
    //       Place: "Mumbai",
    //       Page: 2,
    //       MarketingTypeRef: 1,
    //       Name: "John Doe",
    //       Narration: "Facebook campaign for new product"
    //     }
    //   },
    //   {
    //     p: {
    //       SiteName: "Site B",
    //       Date: "2025-04-20",
    //       MarketingTypeName: "Printing Media",
    //       VendorName: "Vendor Y",
    //       Rate: 1000,
    //       Quantity: 5,
    //       Total: 5000,
    //       Place: "Pune",
    //       Page: 4,
    //       MarketingTypeRef: 2,
    //       Name: "Jane Smith",
    //       Narration: "Flyers for local distribution"
    //     }
    //   },
    //   {
    //     p: {
    //       SiteName: "Site C",
    //       Date: "2025-03-15",
    //       MarketingTypeName: "Online Ads",
    //       VendorName: "Vendor Z",
    //       Rate: 2000,
    //       Quantity: 8,
    //       Total: 16000,
    //       Place: "Delhi",
    //       Page: 1,
    //       MarketingTypeRef: 1,
    //       Name: "Alice Johnson",
    //       Narration: "Google Ads for product awareness"
    //     }
    //   }
    // ];
  };

  // companyRef(): number {
  //   return this.companystatemanagement.SelectedCompanyRef();
  // }

  getMarketingListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    this.DigitalList = [];
    this.ElectronicsList = [];
    this.OutdoorList = [];
    this.PrintingMediaList = [];
    this.BrokerList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await MarketingManagement.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    // for (const item of lst) {
    //   switch (item.p.MarketingTypeRef) {
    //     case MarketingModes.Digital:
    //       this.DigitalList.push(item);
    //       break;
    //     case MarketingModes.Electronics:
    //       this.ElectronicsList.push(item);
    //       break;
    //     case MarketingModes.Outdoor:
    //       this.OutdoorList.push(item);
    //       break;
    //     case MarketingModes.PrintingMedia:
    //       this.PrintingMediaList.push(item);
    //       break;
    //     case MarketingModes.AgentBoker:
    //       this.BrokerList.push(item);
    //       break;
    //   }
    // }
  }

  onEditClicked = async (item: MarketingManagement) => {
    this.SelectedMarketingManagement = item.GetEditableVersion();
    MarketingManagement.SetCurrentInstance(this.SelectedMarketingManagement);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['app_homepage/tabs/marketing-management/edit']);
  };

  onDeleteClicked = async (material: MarketingManagement) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
       Are you sure that you want to DELETE this Material?`,
      async () => {
        await material.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Material ${material.p.Name} has been deleted!`
          );
          await this.getMarketingListByCompanyRef();
        });
      }
    );
  };


  onViewClicked(item: MarketingManagement) {
    this.SelectedMarketingManagement = item;
    this.ModalOpen = true;
  }

  closeModal() {
    this.ModalOpen = false;
  }

  async AddMarketing() {
    try {
      if (this.companyRef() <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }
      this.router.navigate(['app_homepage/tabs/marketing-management/add']);
    } catch (error: any) {
      await this.uiUtils.showErrorMessage('Error', error?.message || 'Failed to open the add form.');
    }
  }
}
