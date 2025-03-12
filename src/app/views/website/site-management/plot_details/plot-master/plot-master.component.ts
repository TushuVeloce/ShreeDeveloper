import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Plot } from 'src/app/classes/domain/entities/website/masters/plot/plot';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-plot-master',
  standalone: false,
  templateUrl: './plot-master.component.html',
  styleUrls: ['./plot-master.component.scss'],
})
export class PlotMasterComponent implements OnInit {
  Entity: Plot = Plot.CreateNewInstance();
  SiteList: Site[] = [];
  MasterList: Plot[] = [];
  DisplayMasterList: Plot[] = [];
  SearchString: string = '';
  SelectedPlot: Plot = Plot.CreateNewInstance();
  pageSize = 8; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  headers: string[] = ['Sr.No.', 'Plot Name'];
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
      private companystatemanagement: CompanyStateManagement,) {}

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(false);
    await this.FormulateSiteList();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withDropdown');

  }

  private FormulateSiteList = async () => {
    let lst = await Site.FetchEntireList(async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.SiteList = lst;
    const defaultSite = this.SiteList.find((c) => c.p.Ref === 9163);
    this.Entity.p.SiteRef = defaultSite ? defaultSite.p.Ref : this.SiteList[0]?.p.Ref;
    this.loadPaginationData();
  };

  getPlotListByCompanyandSiteRefList = async (siteref: number) => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.appStateManage.setSiteRef(siteref)
    let lst = await Plot.FetchEntireListByCompanyRefAndSiteRef(this.companyRef(),siteref, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;

    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  }
  get paginatedList() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }


  filterTable = () => {
    const searchTerm = this.SearchString?.trim().toLowerCase();

    if (searchTerm) {
      this.DisplayMasterList = this.MasterList.filter((data: any) => {
        // Check if data.p and data.p.Name exist before accessing
        return data?.p?.Name?.toLowerCase().includes(searchTerm);
      });
    } else {
      // If no search string, reset to the full list
      this.DisplayMasterList = [...this.MasterList];
    }
  };

  AddPlot = async () => {
    await this.router.navigate(['/homepage/Website/Plot_Master_Details']);
  }

}
