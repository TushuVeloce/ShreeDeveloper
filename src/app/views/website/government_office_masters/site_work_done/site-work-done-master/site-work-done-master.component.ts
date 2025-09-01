import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SiteWorkDone } from 'src/app/classes/domain/entities/website/government_office/siteworkdone/siteworkdone';
import { SiteWorkGroup } from 'src/app/classes/domain/entities/website/government_office/siteworkgroup/siteworkgroup';
import { SiteWorkMaster } from 'src/app/classes/domain/entities/website/government_office/siteworkmaster/siteworkmaster';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service'

@Component({
  selector: 'app-site-work-done-master',
  templateUrl: './site-work-done-master.component.html',
  styleUrls: ['./site-work-done-master.component.scss'],
  standalone: false,
})
export class SiteWorkDoneMasterComponent implements OnInit {
  Entity: SiteWorkDone = SiteWorkDone.CreateNewInstance();
  MasterList: SiteWorkDone[] = [];
  DisplayMasterList: SiteWorkDone[] = [];
  SiteWorkGroupList: SiteWorkGroup[] = [];

  SearchString: string = '';
  SelectedSiteWorkDone: SiteWorkDone = SiteWorkDone.CreateNewInstance();
  CustomerRef: number = 0;
  SiteWorkGroupRef: number = 0;
  SiteWorkRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  // SiteWorkGroupList: SiteWorkGroup[] = [];
  SiteWorkMasterList: SiteWorkMaster[] = [];

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Applicable Type', 'Action'];

  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private appStateManage: AppStateManageService,
    private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement
  ) {
    effect(async () => {
      await this.getSiteWorkGroupListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  getSiteWorkGroupListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.SiteWorkGroupRef = Number(this.appStateManage.StorageKey.getItem('sitegroup'))
    let lst = await SiteWorkGroup.FetchEntireListByCompanyRef(
      this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.SiteWorkGroupList = lst;
    if (lst.length >= 0) {
      this.SiteWorkGroupList = lst.sort((a, b) => a.p.DisplayOrder - b.p.DisplayOrder);
      this.getSiteWorkListBySiteWorkGroupRef();
    }
    if (lst.length <= 0) {
      this.SiteWorkGroupRef = 0;
    }
    if (!this.SiteWorkGroupList.some((v) => v.p.Ref == this.SiteWorkGroupRef)) {
      this.SiteWorkGroupRef = 0;
    }
  };

  getSiteWorkListBySiteWorkGroupRef = async () => {
    if (this.SiteWorkGroupRef <= 0) {
      await this.uiUtils.showErrorToster('Site Group not Selected');
      return;
    }
    let lst = await SiteWorkMaster.FetchEntireListBySiteWorkGroupRef(
      this.SiteWorkGroupRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.SiteWorkMasterList = lst;
    if (lst.length >= 0) {
      this.SiteWorkRef = lst[0].p.Ref;
    }
    this.getSiteWorkDoneListBySiteWorkRef()
  };

  getSiteWorkDoneListBySiteWorkRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.SiteWorkRef <= 0) {
      await this.uiUtils.showErrorToster('Site Work not Selected');
      return;
    }
    let lst = await SiteWorkDone.FetchEntireListBySiteWorkRef(
      this.SiteWorkRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.MasterList = lst.sort((a, b) => a.p.DisplayOrder - b.p.DisplayOrder);
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  onEditClicked = async (item: SiteWorkDone) => {

    this.SelectedSiteWorkDone = item.GetEditableVersion();

    SiteWorkDone.SetCurrentInstance(this.SelectedSiteWorkDone);

    this.appStateManage.StorageKey.setItem('Editable', 'Edit');

    await this.router.navigate(['/homepage/Website/Site_Work_Done_Details']);
  };

  onDeleteClicked = async (SiteWorkDone: SiteWorkDone) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
     Are you sure that you want to DELETE this Site Work Done?`,
      async () => {
        await SiteWorkDone.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Site Work Done ${SiteWorkDone.p.SiteWorkName} has been deleted!`
          );
          await this.getSiteWorkDoneListBySiteWorkRef();
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
  get paginatedList() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };

  // 🔑 Whenever filteredList event is received
  onFilteredList(list: any[]) {
    this.DisplayMasterList = list;
    this.currentPage = 1;   // reset to first page after filtering

    this.loadPaginationData();
  }

  async AddSiteWorkDone() {
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    } else if (this.SiteWorkRef <= 0) {
      this.uiUtils.showErrorToster('Please Select site work Name');
      return;
    }
    this.router.navigate(['/homepage/Website/Site_Work_Done_Details']);
  }

  SiteWorkGroup: number = 0;

  onSiteWorkChange(sitework: number) {
    this.DisplayMasterList = [];
    this.SiteWorkGroup = sitework;
    if (sitework > 0) {
      let List = this.MasterList.filter(e => e.p.SiteWorkRef == sitework)
      this.DisplayMasterList = List.sort((a, b) => a.p.DisplayOrder - b.p.DisplayOrder);

      this.appStateManage.StorageKey.setItem('siteRf', String(sitework));
    }
  }
}
