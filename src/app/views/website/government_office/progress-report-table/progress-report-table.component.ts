import { Component, effect, OnInit } from '@angular/core';
import { NzPaginationComponent } from "ng-zorro-antd/pagination";
import { Router } from '@angular/router';
import { Material } from 'src/app/classes/domain/entities/website/masters/material/material';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';

@Component({
  selector: 'app-progress-report',
  templateUrl: './progress-report-table.component.html',
  styleUrls: ['./progress-report-table.component.scss'],
  standalone: false,
})
export class ProgressReportTableComponent implements OnInit {


  Entity: Material = Material.CreateNewInstance();
  MasterList: Material[] = [];
  // DisplayMasterList: Material[] = [];
  DisplayMasterList = [{
    Name: 'Ijaj',
  }];
  SearchString: string = '';
  SelectedMaterial: Material = Material.CreateNewInstance();
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
      await this.getSiteListByCompanyRef();
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

  onEditClicked = async (item: Material) => {
    this.SelectedMaterial = item.GetEditableVersion();
    Material.SetCurrentInstance(this.SelectedMaterial);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Material_Master_Details']);
  };

  onTPOfficeClicked = async () => {
    await this.router.navigate(['/homepage/Website/TP_Office']);
  };

  onNaLetterClicked = async () => {
    await this.router.navigate(['/homepage/Website/NA_Letter']);
  };

  onMojaniClicked = async () => {
    await this.router.navigate(['/homepage/Website/Mojani']);
  };

  onULCClicked = async () => {
    await this.router.navigate(['/homepage/Website/ULC']);
  };

  onFinalLayoutClicked = async () => {
    await this.router.navigate(['/homepage/Website/Final_Layout']);
  };

  onK_JA_PA_Clicked = async () => {
    await this.router.navigate(['/homepage/Website/K_JA_PA']);
  };

  onDeleteClicked = async (material: Material) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
    Are you sure that you want to DELETE this Material?`,
      async () => {
        await material.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Material ${material.p.Name} has been deleted!`
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

  AddMaterial = () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    }
    this.router.navigate(['/homepage/Website/Material_Master_Details']);
  }
}

