import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { MarketingType } from 'src/app/classes/domain/entities/website/masters/marketingtype/marketingtype';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-Marketing-Type-master',
  standalone: false,
  templateUrl: './Marketing-Type-master.component.html',
  styleUrls: ['./Marketing-Type-master.component.scss'],
})
export class MarketingTypeMasterComponent implements OnInit {

  Entity: MarketingType = MarketingType.CreateNewInstance();
  MasterList: MarketingType[] = [];
  DisplayMasterList: MarketingType[] = [];
  SearchString: string = '';
  SelectedMarketingType: MarketingType = MarketingType.CreateNewInstance();
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  MarketingTypeModesList = DomainEnums.MarketingModesList(true, '--Select Modes Type--');

  headers: string[] = ['Sr.No.', 'Marketing Type', 'Description', 'Action'];

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private companystatemanagement: CompanyStateManagement) {
    effect(() => {
      this.getMarketingTypeListByCompanyRef()
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
  }

  getMarketingTypeListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await MarketingType.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  onEditClicked = async (item: MarketingType) => {
    this.SelectedMarketingType = item.GetEditableVersion();
    MarketingType.SetCurrentInstance(this.SelectedMarketingType);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Marketing_Type_Master_Details']);
  }

  onDeleteClicked = async (MarketingType: MarketingType) => {
    await this.uiUtils.showConfirmationMessage('Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
    Are you sure that you want to DELETE this Marketing Type?`,
      async () => {
        await MarketingType.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(`Marketing Type ${MarketingType.p.MarketingModeName} has been deleted!`);
          await this.getMarketingTypeListByCompanyRef();
          this.SearchString = '';
          this.loadPaginationData();
        });
      });
  }

  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  }

  paginatedList = () => {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  }

  // 🔑 Whenever filteredList event is received
  onFilteredList(list: any[]) {
    this.DisplayMasterList = list;
    this.currentPage = 1;   // reset to first page after filtering

    this.loadPaginationData();
  }

  AddMarketingType = () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    }
    this.router.navigate(['/homepage/Website/Marketing_Type_Master_Details']);
  }
}
