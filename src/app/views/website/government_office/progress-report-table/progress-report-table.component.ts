import { Component, effect, OnInit } from '@angular/core';
import { NzPaginationComponent } from "ng-zorro-antd/pagination";
import { Router } from '@angular/router';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { ProgressReport } from 'src/app/classes/domain/entities/website/government_office/progressreport/progressreport';

@Component({
  selector: 'app-progress-report',
  templateUrl: './progress-report-table.component.html',
  styleUrls: ['./progress-report-table.component.scss'],
  standalone: false,
})
export class ProgressReportTableComponent implements OnInit {


  Entity: ProgressReport = ProgressReport.CreateNewInstance();
  MasterList: ProgressReport[] = [];
  DisplayMasterList: ProgressReport[] = [];
  SearchString: string = '';
  SelectedProgressReport: ProgressReport = ProgressReport.CreateNewInstance();
  SiteRef: number = 0;
  SiteName: string = '';
  SiteList: Site[] = [];
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Site Name', 'TP Office', 'NA Letter', 'Mojani', 'ULC', 'Final Layout', 'KaJaPa'];

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement
  ) {
    effect(async () => {
      await this.getSiteListByCompanyRef(); await this.getProgressReportListByCompanySiteRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  getSiteListByCompanyRef = async () => {
    this.SiteRef = 0
    this.SiteName = ''
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
  }

  getProgressReportListByCompanySiteRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    console.log('this.Entity.p.SiteRef :', this.SiteRef);
    let lst = await ProgressReport.FetchEntireListByCompanySiteRef(this.companyRef(), this.SiteRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.DisplayMasterList = lst;
  }

  onEditClicked = async (item: ProgressReport) => {
    this.SelectedProgressReport = item.GetEditableVersion();
    ProgressReport.SetCurrentInstance(this.SelectedProgressReport);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/ProgressReport_Master_Details']);
  };

  onTPOfficeClicked = async (SiteRef: number) => {
    await this.router.navigate(['/homepage/Website/TP_Office'], {
      state: { SiteRef: SiteRef }
    });
  };

  onNaLetterClicked = async (SiteRef: number) => {
    await this.router.navigate(['/homepage/Website/NA_Letter'], {
      state: { SiteRef: SiteRef }
    });
  };

  onMojaniClicked = async (SiteRef: number) => {
    await this.router.navigate(['/homepage/Website/Mojani'], {
      state: { SiteRef: SiteRef }
    });
  };

  onULCClicked = async (SiteRef: number) => {
    await this.router.navigate(['/homepage/Website/ULC'], {
      state: { SiteRef: SiteRef }
    });
  };

  onFinalLayoutClicked = async (SiteRef: number) => {
    await this.router.navigate(['/homepage/Website/Final_Layout'], {
      state: { SiteRef: SiteRef }
    });
  };

  onK_JA_PA_Clicked = async (SiteRef: number) => {
    await this.router.navigate(['/homepage/Website/K_JA_PA'], {
      state: { SiteRef: SiteRef }
    });
  };

  onDeleteClicked = async (ProgressReport: ProgressReport) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
    Are you sure that you want to DELETE this ProgressReport?`,
      async () => {
        await ProgressReport.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `ProgressReport ${ProgressReport.p.SiteName} has been deleted!`
          );
          await this.getSiteListByCompanyRef();
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

  paginatedList = () => {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };

  AddProgressReport = () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    }
    this.router.navigate(['/homepage/Website/ProgressReport_Master_Details']);
  }
}

