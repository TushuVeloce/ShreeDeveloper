import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums, MarketingModes } from 'src/app/classes/domain/domainenums/domainenums';
import { MarketingManagement } from 'src/app/classes/domain/entities/website/MarketingManagement/marketingmanagement';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
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
  SearchString: string = '';
  SelectedMarketingManagement: MarketingManagement = MarketingManagement.CreateNewInstance();
  MarketingModesList = DomainEnums.MarketingModesList(true, '--Select Modes Type--');
  pageSize = 8; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  Headers: string[] = ['Sr.No.', 'Site Name', 'Date', 'Marketing Type', 'Vendor Name', 'Rate', 'Quantity', 'Total', 'Action'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement
  ) {
    effect(async () => {
      await this.getMarketingListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(false);
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
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
      switch (item.p.MarketingTypeRef) {
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

  onEditClicked = async (item: MarketingManagement) => {
    this.SelectedMarketingManagement = item.GetEditableVersion();
    MarketingManagement.SetCurrentInstance(this.SelectedMarketingManagement);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Marketing_Management_Master']);
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
          this.SearchString = '';
          this.loadPaginationData();
        });
      }
    );
  };

  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  };

  paginatedList = () => {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
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
