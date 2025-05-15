import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SiteWorkGroup } from 'src/app/classes/domain/entities/website/government_office/siteworkgroup/siteworkgroup';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-site-work-group-master',
  standalone: false,
  templateUrl: './site-work-group-master.component.html',
  styleUrls: ['./site-work-group-master.component.scss'],
})
export class SiteWorkGroupMasterComponent implements OnInit {
  Entity: SiteWorkGroup = SiteWorkGroup.CreateNewInstance();
  MasterList: SiteWorkGroup[] = [];
  DisplayMasterList: SiteWorkGroup[] = [];
  SearchString: string = '';
  SelectedSiteWorkGroup: SiteWorkGroup = SiteWorkGroup.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Site Work Group', 'Display Order', 'Action'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService, private companystatemanagement: CompanyStateManagement,) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    await this.FormulateSiteWorkGroupList();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  private FormulateSiteWorkGroupList = async () => {
      if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await SiteWorkGroup.FetchEntireListByCompanyRef(this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.MasterList = lst.sort((a, b) => a.p.DisplayOrder - b.p.DisplayOrder);
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  onEditClicked = async (item: SiteWorkGroup) => {
    // let props = Object.assign(SiteWorkGroupProps.Blank(),item.p);
    // this.SelectedSiteWorkGroup = SiteWorkGroup.CreateInstance(props,true);

    this.SelectedSiteWorkGroup = item.GetEditableVersion();

    SiteWorkGroup.SetCurrentInstance(this.SelectedSiteWorkGroup);

    this.appStateManage.StorageKey.setItem('Editable', 'Edit');

    await this.router.navigate(['/homepage/Website/Site_Work_Group_Details']);
  };

  onDeleteClicked = async (Item: SiteWorkGroup) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
    Are you sure that you want to DELETE this SiteWorkGroup?`,
      async () => {
        await Item.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `SiteWorkGroup ${Item.p.Name} has been deleted!`
          );
          await this.FormulateSiteWorkGroupList();
          this.SearchString = '';
          this.loadPaginationData();
          await this.FormulateSiteWorkGroupList();

        });
      }
    );
  };

  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  };
  get paginatedList() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };

  AddSiteWorkGroup() {
    this.router.navigate(['/homepage/Website/Site_Work_Group_Details']);
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

