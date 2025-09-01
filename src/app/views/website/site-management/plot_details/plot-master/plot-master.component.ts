import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingRemark, BookingRemarks, DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
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
  headers: string[] = ['Sr.No.', 'Plot No', 'Area in Sq/m', 'Area in Sq/ft', 'Gov Rate/Sqm', 'Basic Rate/Sqft', 'Booking Remark', 'Action',];
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  siteref: number = 0
  bookingremark: number = 0
  BookingRemarkEnum = BookingRemarks;
  BookingRemarkList = DomainEnums.BookingRemarksList(true,).filter(item =>
    item.Ref != this.BookingRemarkEnum.Booked
  );
  PlotofOwner = BookingRemarks.Plot_Of_Owner
  PlotofShree = BookingRemarks.Plot_Of_Shree

  shouldDestroy: boolean = true;

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement,) {
    effect(async () => {
      await this.FormulateSiteListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();

    this.pageSize = this.screenSizeService.getPageSize('withDropdown');

    const storedSiteRef = Number(this.appStateManage.StorageKey.getItem('siteRef'));
    const bookingRemarkeRef = Number(this.appStateManage.StorageKey.getItem('bookingremarkRef'));

    this.siteref = storedSiteRef
    this.bookingremark = bookingRemarkeRef
    if (storedSiteRef > 0) {
      setTimeout(async () => {
        this.Entity.p.SiteManagementRef = storedSiteRef;
        this.Entity.p.CurrentBookingRemark = bookingRemarkeRef;
        await this.getPlotListBySiteandBookingRemarkRef(storedSiteRef, bookingRemarkeRef);
      });
    }
  }

  checkBookingRemarkStatus = (BookingRemark: number): any => {
    if (BookingRemark == this.BookingRemarkEnum.Owner_Booked || BookingRemark == this.BookingRemarkEnum.Shree_Booked) {
      return 'plotbooked';
    } else if (BookingRemark == this.BookingRemarkEnum.Shree_Saledeed || BookingRemark == this.BookingRemarkEnum.Owner_Saledeed) {
      return 'plotsold';
    } else return 'plot';
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
    if (this.siteref == 0 && lst.length > 0) {
      // this.getPlotList()
      this.siteref = lst[0].p.Ref
      this.Entity.p.SiteManagementRef = lst[0].p.Ref
      this.onsitechange(this.siteref)
    }
    // else {
    //   this.BookingRemarkList = DomainEnums.BookingRemarkList(true, '--select--');
    // }
    this.loadPaginationData();
  }

  onsitechange = (siteref: number) => {
    this.siteref = siteref
    this.Entity.p.CurrentBookingRemark = 0
    this.bookingremark = 0
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.siteref <= 0) {
      this.clearStorage();
      // this.getPlotList()
      this.BookingRemarkList = DomainEnums.BookingRemarksList(true);
    }
    //  else {
    //   this.BookingRemarkList = DomainEnums.BookingRemarkList(true, '--select--');
    // }
    if (siteref > 0 && this.SiteList.length > 0) {
      this.Entity.p.SiteManagementRef = siteref;
      const selectedSite = this.SiteList.find(site => site.p.Ref === siteref);
      if (!selectedSite) {
        return;
      }
      this.appStateManage.StorageKey.setItem('siteRef', String(siteref));
      this.appStateManage.StorageKey.setItem('siteName', selectedSite.p.Name);
      this.appStateManage.StorageKey.setItem('bookingremarkRef', String(this.bookingremark));

      this.getPlotListBySiteandBookingRemarkRef(siteref, this.bookingremark)
    }
  }

  getPlotListBySiteandBookingRemarkRef = async (siteref: number, bookingremarkref: number) => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    this.siteref = siteref
    this.bookingremark = bookingremarkref
    if (siteref <= 0) {
      return
    }
    this.appStateManage.StorageKey.setItem('bookingremarkRef', String(bookingremarkref));
    let lst = await Plot.FetchEntireListBySiteandBookingRemarkRef(siteref, bookingremarkref, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  // getPlotList = async () => {
  //   this.MasterList = [];
  //   this.DisplayMasterList = [];
  //   this.siteref = 0
  //   let lst = await Plot.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
  //   this.MasterList = lst;
  //   this.DisplayMasterList = this.MasterList;
  //   this.loadPaginationData();
  // }

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
          await this.getPlotListBySiteandBookingRemarkRef(this.siteref, this.bookingremark);
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

  formatToFixed(value: number): string {
    if (value == null) return '0';

    const fixed = value.toFixed(2);
    // Remove trailing .00 or .0 if not needed
    return fixed.replace(/\.?0+$/, '');
  }

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
