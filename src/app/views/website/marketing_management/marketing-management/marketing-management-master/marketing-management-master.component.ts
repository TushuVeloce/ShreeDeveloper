import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums, MarketingModes } from 'src/app/classes/domain/domainenums/domainenums';
import { MarketingManagement } from 'src/app/classes/domain/entities/website/MarketingManagement/marketingmanagement';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-marketing-management-master',
  standalone: false,
  templateUrl: './marketing-management-master.component.html',
  styleUrls: ['./marketing-management-master.component.scss'],
})
export class MarketingManagementMasterComponent implements OnInit {
  Entity: MarketingManagement = MarketingManagement.CreateNewInstance();
  MasterList: MarketingManagement[] = [];
  DisplayMasterList: MarketingManagement[] = [];
  DigitalList: MarketingManagement[] = [];
  ElectronicsList: MarketingManagement[] = [];
  OutdoorList: MarketingManagement[] = [];
  PrintingMediaList: MarketingManagement[] = [];
  BrokerList: MarketingManagement[] = [];
  SiteList: Site[] = [];
  VendorList: Vendor[] = [];
  SearchString: string = '';

  DigitalPaginationTotal = 0;
  ElectronicsPaginationTotal = 0;
  OutdoorPaginationTotal = 0;
  PrintingMediaPaginationTotal = 0;
  BrokerPaginationTotal = 0;

  SelectedMarketingManagement: MarketingManagement = MarketingManagement.CreateNewInstance();
  MarketingModesList = DomainEnums.MarketingModesList(true, '--Select Modes Type--');
  pageSize = 5; // Items per page
  currentDigitalPage = 1; // Initialize current page
  currentElectronicsPage = 1; // Initialize current page
  currentOutdoorPage = 1; // Initialize current page
  currentPrintingMediaPage = 1; // Initialize current page
  currentBrokerPage = 1; // Initialize current page
  total = 0;
  FromDate = '';
  ToDate = '';
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  Headers: string[] = ['Sr.No.', 'Site Name', 'Date', 'Vendor Name', 'Rate', 'Quantity', 'Total', 'Action'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement, private dtu: DTU, private DateconversionService: DateconversionService
  ) {
    effect(async () => {
      await this.getMarketingListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.SiteList = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.VendorList = await Vendor.FetchEntireListByCompanyRef(this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    // this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

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
    for (const item of lst) {
      switch (item.p.MarketingType) {
        case MarketingModes.Digital:
          this.DigitalList.push(item);
          break;
        case MarketingModes.Electronics:
          this.ElectronicsList.push(item);
          break;
        case MarketingModes.Outdoor:
          this.OutdoorList.push(item);
          break;
        case MarketingModes.PrintingMedia:
          this.PrintingMediaList.push(item);
          break;
        case MarketingModes.AgentBoker:
          this.BrokerList.push(item);
          break;
      }
    }
    this.loadPaginationData();
  }

  getActualStageListByAllFilters = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    this.DigitalList = [];
    this.ElectronicsList = [];
    this.OutdoorList = [];
    this.PrintingMediaList = [];
    this.BrokerList = [];
    let FromDate = this.dtu.ConvertStringDateToFullFormat(this.FromDate);
    let ToDate = this.dtu.ConvertStringDateToFullFormat(this.ToDate);
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await MarketingManagement.FetchEntireListByAllFilters(this.companyRef(), FromDate, ToDate, this.Entity.p.SiteRef, this.Entity.p.VendorRef, this.Entity.p.MarketingType, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    for (const item of lst) {
      switch (item.p.MarketingType) {
        case MarketingModes.Digital:
          this.DigitalList.push(item);
          break;
        case MarketingModes.Electronics:
          this.ElectronicsList.push(item);
          break;
        case MarketingModes.Outdoor:
          this.OutdoorList.push(item);
          break;
        case MarketingModes.PrintingMedia:
          this.PrintingMediaList.push(item);
          break;
        case MarketingModes.AgentBoker:
          this.BrokerList.push(item);
          break;
      }
    }
    this.loadPaginationData();
  }


  formatShortDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

 
  onEditClicked = async (item: MarketingManagement) => {
    this.SelectedMarketingManagement = item.GetEditableVersion();
    MarketingManagement.SetCurrentInstance(this.SelectedMarketingManagement);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Marketing_Management_Details']);
  };

  onDeleteClicked = async (marketing: MarketingManagement) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
     Are you sure that you want to DELETE this Marketing?`,
      async () => {
        await marketing.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Marketing ${marketing.p.Name} has been deleted!`
          );
          await this.getMarketingListByCompanyRef();
          this.SearchString = '';
          this.loadPaginationData();
        });
      }
    );
  };


 get totalDigitalAmount(): number {
    return this.DigitalList.reduce((sum, item) => sum + (item.p.Total || 0), 0);
  }
  
  get totalElectonicsAmount(): number {
    return this.ElectronicsList.reduce((sum, item) => sum + (item.p.Total || 0), 0);
  }

  get totalOutdoorAmount(): number {
    return this.OutdoorList.reduce((sum, item) => sum + (item.p.Total || 0), 0);
  }

  get totalPrintingMediaAmount(): number {
    return this.PrintingMediaList.reduce((sum, item) => sum + (item.p.Total || 0), 0);
  }

  get totalBrokerAmount(): number {
    return this.BrokerList.reduce((sum, item) => sum + (item.p.Total || 0), 0);
  }
 

   // Digital Pagination
  paginatedDigitalList = () => {
    const start = (this.currentDigitalPage - 1) * this.pageSize;
    return this.DigitalList.slice(start, start + this.pageSize);
  }

  onDigitalPageChange = (pageIndex: number): void => {
    this.currentDigitalPage = pageIndex; // Update the current page
  }

   // Electronics Pagination
  paginatedElectronicsList = () => {
    const start = (this.currentElectronicsPage - 1) * this.pageSize;
    return this.ElectronicsList.slice(start, start + this.pageSize);
  }

  onElectronicsPageChange = (pageIndex: number): void => {
    this.currentElectronicsPage = pageIndex; // Update the current page
  }

   // Outdoor Pagination
  paginatedOutdoorList = () => {
    const start = (this.currentOutdoorPage - 1) * this.pageSize;
    return this.OutdoorList.slice(start, start + this.pageSize);
  }

  onOutdoorPageChange = (pageIndex: number): void => {
    this.currentOutdoorPage = pageIndex; // Update the current page
  }

   // Printing Media Pagination
  paginatedPrintingMediaList = () => {
    const start = (this.currentPrintingMediaPage - 1) * this.pageSize;
    return this.PrintingMediaList.slice(start, start + this.pageSize);
  }

  onPrintingMediaPageChange = (pageIndex: number): void => {
    this.currentPrintingMediaPage = pageIndex; // Update the current page
  }

   // Broker Pagination
  paginatedBrokerList = () => {
    const start = (this.currentBrokerPage - 1) * this.pageSize;
    return this.BrokerList.slice(start, start + this.pageSize);
  }

  onBrokerPageChange = (pageIndex: number): void => {
    this.currentBrokerPage = pageIndex; // Update the current page
  }

  // For Pagination  start ----
  loadPaginationData = () => {
    this.DigitalPaginationTotal = this.DigitalList.length; // Update total based on loaded data
    this.ElectronicsPaginationTotal = this.ElectronicsList.length; // Update total based on loaded data
    this.OutdoorPaginationTotal = this.OutdoorList.length; // Update total based on loaded data
    this.PrintingMediaPaginationTotal = this.PrintingMediaList.length; // Update total based on loaded data
    this.BrokerPaginationTotal = this.BrokerList.length; // Update total based on loaded data
  };


  AddMarketing = () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.router.navigate(['/homepage/Website/Marketing_Management_Details']);
  }

  filterTable = () => {
    if (this.SearchString != '') {
      this.DisplayMasterList = this.MasterList.filter((data: any) => {
        return data.p.Name.toLowerCase().indexOf(this.SearchString.toLowerCase()) > -1
      })
    }
    else {
      this.DisplayMasterList = this.MasterList
    }
  }
}
