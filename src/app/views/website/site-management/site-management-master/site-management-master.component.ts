import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-site-management-master',
  templateUrl: './site-management-master.component.html',
  styleUrls: ['./site-management-master.component.scss'],
  standalone: false,
})
export class SiteManagementMasterComponent implements OnInit {

  Entity: Site = Site.CreateNewInstance();
  MasterList: Site[] = [];
  DisplayMasterList: Site[] = [];
  SearchString: string = '';
  SelectedSite: Site = Site.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;

  companyRef = this.companystatemanagement.SelectedCompanyRef;
  headers: string[] = ['Sr.No.', 'Site Name', 'Supervisor Name', 'Actual stage', 'Action'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement
  ) {
    effect(() => {
      // this.getMaterialListByCompanyRef()
      this.getSiteListByCompanyRef();
    });
  }
  ngOnInit() { }

  getSiteListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    console.log('companyRef :', this.companyRef());
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    console.log('Site :', this.MasterList);

    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }


  AddSite = async () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    else {

      await this.router.navigate(['/homepage/Website/Site_Management_Details']);
    }
  }

  onEditClicked = async (item: Site) => {
    // let props = Object.assign(MaterialProps.Blank(),item.p);
    // this.SelectedMaterial = Material.CreateInstance(props,true);

    this.SelectedSite = item.GetEditableVersion();

    Site.SetCurrentInstance(this.SelectedSite);

    this.appStateManage.StorageKey.setItem('Editable', 'Edit');

    await this.router.navigate(['/homepage/Website/Site_Management_Details']);
  };

  onDeleteClicked = async (site: Site) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
      Are you sure that you want to DELETE this Site?`,
      async () => {
        await site.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Material ${site.p.Name} has been deleted!`
          );
          await this.getSiteListByCompanyRef();
          this.SearchString = '';
          this.loadPaginationData();
          // await this.FormulateMaterialList();

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
