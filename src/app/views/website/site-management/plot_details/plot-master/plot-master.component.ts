import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingRemark, DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
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
  headers: string[] = ['Sr.No.', 'Plot No', 'Area /sqm', 'Area /sqft', 'Gov Rate/Sqm', 'Basic Rate/Sqft', 'Booking Remark', 'Action',];
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  siteref: number = 0
  bookingremark: number = 0
  BookingRemarkList = DomainEnums.BookingRemarkList(true,);
  BookingRemarkEnum = BookingRemark;
  shouldDestroy: boolean = true;

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement) {
    effect(async () => {
      await this.FormulateSiteListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(false);
    this.loadPaginationData();

    this.pageSize = this.screenSizeService.getPageSize('withDropdown');

    this.siteref = Number(this.appStateManage.StorageKey.getItem('siteRef'));
    this.bookingremark = Number(this.appStateManage.StorageKey.getItem('bookingremarkRef'));

    if (!this.siteref) {
      this.FormulateSiteListByCompanyRef();
    } else {
      this.getPlotListBySiteandBookingRemarkRef();
    }
  }

  FormulateSiteListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    this.Entity.p.SiteManagementRef = 0;
    this.siteref = 0;
    this.Entity.p.CurrentBookingRemark = 0
    this.SiteList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
    this.siteref = this.SiteList[0].p.Ref;
    let SiteName = this.SiteList[0].p.Name;
    this.appStateManage.StorageKey.setItem('siteRef', String(this.siteref));
    this.appStateManage.StorageKey.setItem('siteName', String(SiteName));
    if (this.siteref != 0) {
      this.getPlotListBySiteandBookingRemarkRef()
    } else {
      this.BookingRemarkList = DomainEnums.BookingRemarkList(true, '--select--');
    }
    this.loadPaginationData();
  }

  getPlotListBySiteandBookingRemarkRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.siteref <= 0) {
      await this.uiUtils.showErrorToster('Site not Selected')
      return
    }
    this.appStateManage.StorageKey.setItem('bookingremarkRef', String(this.bookingremark));
    this.appStateManage.StorageKey.setItem('siteRef', String(this.siteref));

    let lst = await Plot.FetchEntireListBySiteandBookingRemarkRef(this.siteref, this.bookingremark, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  onEditClicked = async (item: Plot) => {
    this.SelectedPlot = item.GetEditableVersion();
    Plot.SetCurrentInstance(this.SelectedPlot);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    this.shouldDestroy = false;
    await this.router.navigate(['/homepage/Website/Plot_Master_Details']);
  };


  onDeleteClicked = async (plot: Plot) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
      Are you sure that you want to DELETE this Plot?`,
      async () => {
        await plot.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Plot ${plot.p.PlotNo} has been deleted!`
          );
          this.SearchString = '';
          this.loadPaginationData();
        });
      }
    );
  };

  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  }
  get paginatedList() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };

  filterTable = () => {
    const searchTerm = this.SearchString?.trim().toLowerCase();
    if (searchTerm) {
      this.DisplayMasterList = this.MasterList.filter((data: any) => {
        return data?.p?.Name?.toLowerCase().includes(searchTerm);
      });
    } else {
      this.DisplayMasterList = [...this.MasterList];
    }
  };

  AddPlot = async () => {
    if (this.siteref > 0) {
      this.shouldDestroy = false;
      await this.router.navigate(['/homepage/Website/Plot_Master_Details']);
    } else {
      this.uiUtils.showWarningToster('Please select a site first');
    }
  }

  ngOnDestroy(): void {
    if (this.shouldDestroy) {
      this.clearStorage();
    }
  }

  clearStorage() {
    this.appStateManage.StorageKey.removeItem('siteRef');
    this.appStateManage.StorageKey.removeItem('siteName');
    this.appStateManage.StorageKey.removeItem('bookingremarkRef');
  }
}
