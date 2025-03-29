import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SiteWorkGroup } from 'src/app/classes/domain/entities/website/government_office/siteworkgroup/siteworkgroup';
import { SiteWorkMaster } from 'src/app/classes/domain/entities/website/government_office/siteworkmaster/siteworkmaster';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-site-work-master',
  standalone: false,
  templateUrl: './site-work-master.component.html',
  styleUrls: ['./site-work-master.component.scss'],
})
export class SiteWorkMasterComponent implements OnInit {
  Entity: SiteWorkMaster = SiteWorkMaster.CreateNewInstance();
  MasterList: SiteWorkMaster[] = [];
  DisplayMasterList: SiteWorkMaster[] = [];
  SearchString: string = '';
  SelectedSiteWorkMaster: SiteWorkMaster = SiteWorkMaster.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  SiteWorkGroupList: SiteWorkGroup[] = [];

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Name', 'Site Work Master Name', 'Action'];
  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private appStateManage: AppStateManageService,
    private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement
  ) {
    effect(() => {
      // this.getSiteWorkMasterListByCompanyRef()
      this.getSiteWorkMasterListByCompanyRef();
    });
  }

  // effect(() => {
  //   // this.getSiteWorkMasterListByCompanyRef()
  //   setTimeout(() => {
  //     if (this.companyRef() > 0) {
  //       this.getSiteWorkMasterListByCompanyRef();
  //     }
  //   }, 300);
  // });

  async ngOnInit() {
    this.SiteWorkGroupList = await SiteWorkGroup.FetchEntireList();
    this.appStateManage.setDropdownDisabled(false);
    // await this.FormulateSiteWorkMasterList();
    // this.DisplayMasterList = [];
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }
  // private FormulateSiteWorkMasterList = async () => {
  //   let lst = await SiteWorkMaster.FetchEntireList(
  //     async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
  //   );
  //   this.MasterList = lst;
  //   console.log('MasterList :', this.MasterList);
  //   this.DisplayMasterList = this.MasterList;
  //   this.loadPaginationData();
  //   // console.log(this.DisplayMasterList);
  // };

  getSiteWorkMasterListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    console.log('companyRef :', this.companyRef());
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await SiteWorkMaster.FetchEntireListByCompanyRef(
      this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.MasterList = lst;
    console.log('SiteWorkMasterList :', this.MasterList);

    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  onEditClicked = async (item: SiteWorkMaster) => {
    // let props = Object.assign(SiteWorkMasterProps.Blank(),item.p);
    // this.SelectedSiteWorkMaster = SiteWorkMaster.CreateInstance(props,true);

    this.SelectedSiteWorkMaster = item.GetEditableVersion();

    SiteWorkMaster.SetCurrentInstance(this.SelectedSiteWorkMaster);

    this.appStateManage.StorageKey.setItem('Editable', 'Edit');

    await this.router.navigate(['/homepage/Website/Site_Work_Master_Detail']);
  };

  onDeleteClicked = async (SiteWorkMaster: SiteWorkMaster) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
    Are you sure that you want to DELETE this SiteWorkMaster?`,
      async () => {
        await SiteWorkMaster.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Site Work Master ${SiteWorkMaster.p.Name} has been deleted!`
          );
          await this.getSiteWorkMasterListByCompanyRef();
          this.SearchString = '';
          this.loadPaginationData();
          // await this.FormulateSiteWorkMasterList();
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

  async AddSiteWorkMaster() {
    if (this.companyRef() <= 0) {
      this.uiUtils.showErrorToster('Company not Selected');
      return;
    } else if (this.Entity.p.SiteWorkGroupRef <= 0) {
      this.uiUtils.showErrorToster('Please Select site work group');
      return;
    }
    this.router.navigate(['/homepage/Website/Site_Work_Master_Detail']);
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

  onSiteGroupChange(sitegroup: number) {
    this.SiteGroup = sitegroup;
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (sitegroup > 0) {
      this.Entity.p.SiteWorkGroupRef = sitegroup;
      const selectedSitegroupref = this.SiteWorkGroupList.find(
        (site) => site.p.Ref === sitegroup
      );
      if (!selectedSitegroupref) {
        return;
      }
      this.appStateManage.StorageKey.setItem('siteRf', String(sitegroup));
    }
  }
}
