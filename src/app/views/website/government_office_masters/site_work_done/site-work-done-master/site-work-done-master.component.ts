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
  DisplaySiteWorkMasterList: SiteWorkMaster[] = [];

  SearchString: string = '';
  SelectedSiteWorkDone: SiteWorkDone = SiteWorkDone.CreateNewInstance();
  CustomerRef: number = 0;
  SiteGroupRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  // SiteWorkGroupList: SiteWorkGroup[] = [];
  SiteWorkMasterList: SiteWorkMaster[] = [];

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Site Work', 'Applicable Type', 'Action'];
  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private appStateManage: AppStateManageService,
    private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement
  ) {
    effect(async () => {
      await this.getSiteWorkDoneListByCompanyRef();
    });
  }


  async ngOnInit() {
    this.SiteWorkGroupList = await SiteWorkGroup.FetchEntireList();
    this.SiteWorkMasterList = await SiteWorkMaster.FetchEntireList();
    this.appStateManage.setDropdownDisabled(false);
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  getSiteWorkDoneListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await SiteWorkDone.FetchEntireListByCompanyRef(
      this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.MasterList = lst.sort((a, b) => a.p.DisplayOrder - b.p.DisplayOrder);
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  onSiteGroupChange(siteGroupRef: number) {
    this.DisplayMasterList = [];
    this.DisplaySiteWorkMasterList = [];
    this.Entity.p.SiteWorkRef = 0;
    if (siteGroupRef > 0) {
      this.DisplaySiteWorkMasterList = this.SiteWorkMasterList.filter(e => e.p.SiteWorkGroupRef == siteGroupRef);
    }
  }

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
     Are you sure that you want to DELETE this SiteWorkDone?`,
      async () => {
        await SiteWorkDone.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Site Work Master ${SiteWorkDone.p.SiteWorkName} has been deleted!`
          );
          await this.getSiteWorkDoneListByCompanyRef();
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

  async AddSiteWorkDone() {
    if (this.companyRef() <= 0) {
      this.uiUtils.showErrorToster('Company not Selected');
      return;
    } else if (this.Entity.p.SiteWorkRef <= 0) {
      this.uiUtils.showErrorToster('Please Select site work Name');
      return;
    }
    this.router.navigate(['/homepage/Website/Site_Work_Done_Details']);
  }

  filterTable = () => {
    if (this.SearchString != '') {
      this.DisplayMasterList = this.MasterList.filter((data: any) => {
        return (
          data.p.Name.toLowerCase().indexOf(this.SearchString.toLowerCase()) >
          -1
        );
      });
    } else {
      this.DisplayMasterList = this.MasterList;
    }
  };

  SiteGroup: number = 0;

  onSiteWorkChange(sitework: number) {
    this.DisplayMasterList = [];
    this.SiteGroup = sitework;
    if (sitework > 0) {
      let List = this.MasterList.filter(e => e.p.SiteWorkRef == sitework)
      this.DisplayMasterList = List.sort((a, b) => a.p.DisplayOrder - b.p.DisplayOrder);

      this.appStateManage.StorageKey.setItem('siteRf', String(sitework));
    }
  }
}
