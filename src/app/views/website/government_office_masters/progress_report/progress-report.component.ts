import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProgressReport } from 'src/app/classes/domain/entities/website/government_office/progressreport/progressreport';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-progressreport-list',
  standalone: false,
  templateUrl: './progress-report.component.html',
  styleUrls: ['./progress-report.component.scss'],
})
export class ProgressReportComponent implements OnInit {

  Entity: ProgressReport = ProgressReport.CreateNewInstance();
  MasterList: ProgressReport[] = [];
  DisplayMasterList: ProgressReport[] = [];
  SearchString: string = '';
  SelectedProgressReport: ProgressReport = ProgressReport.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Site Name', 'TP Office', 'NA Letter', 'Mojani', 'ULC', 'Final Layout', 'KaJaPa', 'Action'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement
  ) {
    effect(() => {
      this.getProgressReportListByCompanyRef();
    });
  }




  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(false);
    // await this.FormulateProgressReportList();
    // this.DisplayMasterList = [];
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }
  // private FormulateProgressReportList = async () => {
  //   let lst = await ProgressReport.FetchEntireList(
  //     async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
  //   );
  //   this.MasterList = lst;
  //   this.DisplayMasterList = this.MasterList;
  //   this.loadPaginationData();
  // };

  getProgressReportListByCompanyRef = async () => {
    // this.MasterList = [];
    // this.DisplayMasterList = [];
    // if (this.companyRef() <= 0) {
    //   await this.uiUtils.showErrorToster('Company not Selected');
    //   return;
    // }
    // let lst = await ProgressReport.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    // this.MasterList = lst;

    // this.DisplayMasterList = this.MasterList;
    // this.loadPaginationData();
  }

  onEditClicked = async (item: ProgressReport) => {
    this.SelectedProgressReport = item.GetEditableVersion();

    ProgressReport.SetCurrentInstance(this.SelectedProgressReport);

    this.appStateManage.StorageKey.setItem('Editable', 'Edit');

    await this.router.navigate(['/homepage/Website/ProgressReport_Master_Details']);
  };

  onDeleteClicked = async (progressreport: ProgressReport) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
      Are you sure that you want to DELETE this ProgressReport?`,
      async () => {
        await progressreport.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `ProgressReport ${progressreport.p.SiteName} has been deleted!`
          );
          await this.getProgressReportListByCompanyRef();
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

  async AddProgressReport() {
    if (this.companyRef() <= 0) {
      this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.router.navigate(['/homepage/Website/ProgressReport_Details']);
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
