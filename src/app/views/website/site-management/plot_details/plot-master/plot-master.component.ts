import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
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
  headers: string[] = ['Sr.No.', 'Plot No','Area sq.m','Area sq.ft','Gov Rate/Sq m','Gov Rate/Sq ft','Basic Rate/Sq m','Basic Rate/Sq ft','Booking Remark','Action',];
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  siteref : number=0
  bookigremark: number=0
  BookingRemarkList = DomainEnums.BookingRemarkList(true, '---Select Booking Remark---');

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
      private companystatemanagement: CompanyStateManagement,) {
        effect(() => {
              this.FormulateSiteListByCompanyRef();
        });
      }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(false);
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withDropdown');
    const storedSiteRef = Number(this.appStateManage.StorageKey.getItem('siteRf'));
    const bookingRemarkeRef = Number(this.appStateManage.StorageKey.getItem('bookingremarkRef'));
    this.siteref = storedSiteRef
    this.bookigremark = bookingRemarkeRef
    if (storedSiteRef > 0)  {
      setTimeout(async () => {
        this.Entity.p.SiteManagementRef = storedSiteRef;
        this.Entity.p.CurrentBookingRemark = bookingRemarkeRef;
        await this.getPlotListBySiteRef(storedSiteRef,bookingRemarkeRef);
      });
    }
    if(this.siteref == 0 && this.bookigremark == 0){
      this.getPlotListBy()
    }
  }

  FormulateSiteListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    this.SiteList = [];
    this.Entity.p.SiteManagementRef = 0;
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
    this.loadPaginationData();
  }

  onsitechange = (siteref: number) => {
    this.siteref = siteref
    this.Entity.p.CurrentBookingRemark = 0
    this.bookigremark = 0
    this.MasterList = [];
    this.DisplayMasterList = [];
    if(siteref > 0 && this.SiteList.length > 0){
      this.Entity.p.SiteManagementRef = siteref;
      const selectedSite= this.SiteList.find(site => site.p.Ref === siteref);
      if (!selectedSite) { 
        return; 
    }
      this.appStateManage.StorageKey.setItem('siteRf', String(siteref));
      this.appStateManage.StorageKey.setItem('siteName', selectedSite.p.Name);
      this.appStateManage.StorageKey.setItem('bookingremarkRef', String(this.bookigremark));
      if(this.bookigremark > 0){
        this.getPlotListBySiteRef(siteref,this.bookigremark)
      }
    }
  }

  getPlotListBySiteRef = async (siteref: number,  bookingremarkref: number) => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    this.siteref = siteref
    this.bookigremark = bookingremarkref
        if(bookingremarkref <= 0 || siteref <= 0){
          return
        }
        
    this.appStateManage.StorageKey.setItem('bookingremarkRef', String(bookingremarkref));
    let lst = await Plot.FetchEntireListBySiteandbookingremarkRef(siteref, bookingremarkref, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    console.log('lst :', lst);
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  getPlotListBy = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    this.siteref = 0
    let lst = await Plot.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  onEditClicked = async (item: Plot) => {
    this.SelectedPlot = item.GetEditableVersion();
    Plot.SetCurrentInstance(this.SelectedPlot);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
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
            `Material ${plot.p.PlotNo} has been deleted!`
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
        // Check if data.p and data.p.Name exist before accessing
        return data?.p?.Name?.toLowerCase().includes(searchTerm);
      });
    } else {
      // If no search string, reset to the full list
      this.DisplayMasterList = [...this.MasterList];
    }
  };

  AddPlot = async () => {
    if(this.siteref > 0){
      await this.router.navigate(['/homepage/Website/Plot_Master_Details']);
    }else{
      this.uiUtils.showWarningToster('Please select a site first');
    }
  }


}
