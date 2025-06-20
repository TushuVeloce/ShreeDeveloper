import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Stage } from 'src/app/classes/domain/entities/website/masters/stage/stage';
import { EstimateStages } from 'src/app/classes/domain/entities/website/site_management/estimatestages/estimatestages';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-estimate-stages',
  standalone: false,
  templateUrl: './estimate-stages.component.html',
  styleUrls: ['./estimate-stages.component.scss'],
})
export class EstimateStagesComponent implements OnInit {
  Entity: EstimateStages = EstimateStages.CreateNewInstance();
  SiteList: Site[] = [];
  StageList: Stage[] = [];
  MasterList: EstimateStages[] = [];
  DisplayMasterList: EstimateStages[] = [];
  SearchString: string = '';
  SelectedEstimateStages: EstimateStages = EstimateStages.CreateNewInstance();
  pageSize = 8; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  headers: string[] = ['Sr.No.', 'Site Name', 'Stage Name', 'Description', 'Amount', 'Action'];
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  SiteRef: number = 0
  shouldDestroy: boolean = true;

  constructor(private uiUtils: UIUtils, private router: Router, private utils: Utils,
    private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement,) {
    effect(() => {
      this.getEstimatedStagesListByCompanyRef(); this.getSiteListByCompanyRef();
    });
  }

  ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.getSiteListByCompanyRef();
    this.pageSize = this.screenSizeService.getPageSize('withDropdown');
    const storedSiteRef = Number(this.appStateManage.StorageKey.getItem('EstSiteRef'));
    this.SiteRef = storedSiteRef
    if (storedSiteRef > 0) {
      setTimeout(async () => {
        this.Entity.p.SiteRef = storedSiteRef;
        await this.getEstimateListBySiteRef(storedSiteRef);
      });
    }
    if (this.SiteRef == 0) {
      this.getEstimatedStagesListByCompanyRef()
    }
  }

  getSiteListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    this.SiteList = [];
    this.Entity.p.SiteRef = 0;
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
    if (this.SiteList.length > 0) {
      this.getEstimatedStagesListByCompanyRef();
    } else {
      this.DisplayMasterList = [];
    }
    this.loadPaginationData();
  }

  onSiteChange = (siteref: number) => {
    this.SiteRef = siteref
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.SiteRef == 0) {
      this.appStateManage.StorageKey.removeItem('EstSiteRef');
      this.appStateManage.StorageKey.removeItem('EstSiteName');
      this.getEstimatedStagesListByCompanyRef()
    }
    if (siteref > 0 && this.SiteList.length > 0) {
      this.Entity.p.SiteRef = siteref;
      const selectedSite = this.SiteList.find(site => site.p.Ref === siteref);
      if (!selectedSite) {
        return;
      }
      this.appStateManage.StorageKey.setItem('EstSiteRef', String(siteref));
      this.appStateManage.StorageKey.setItem('EstSiteName', selectedSite.p.Name);
      this.getEstimateListBySiteRef(siteref)
    }
  }


  getEstimatedStagesListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await EstimateStages.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  getEstimateListBySiteRef = async (siteref: number) => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    this.SiteRef = siteref
    let lst = await EstimateStages.FetchEntireListBySiteRef(siteref, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  onEditClicked = async (item: EstimateStages) => {
    this.SelectedEstimateStages = item.GetEditableVersion();
    EstimateStages.SetCurrentInstance(this.SelectedEstimateStages);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Estimate_Stages_details']);
  };

  onDeleteClicked = async (EstimateStage: EstimateStages) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
      Are you sure that you want to DELETE this Estimate Stage?`,
      async () => {
        await EstimateStage.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Estimate Stage of ${EstimateStage.p.SiteName} has been deleted!`
          );
          await this.getEstimateListBySiteRef(this.SiteRef);
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

  get totalAmount(): number {
    return this.paginatedList.reduce((sum, item) => sum + (item.p.Amount || 0), 0);
  }

  get totalAmountInWords(): string {
    return this.utils.convertNumberToWords(this.totalAmount);
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

  AddEstimateStages = async () => {
    this.shouldDestroy = false;
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    }
    await this.router.navigate(['/homepage/Website/Estimate_Stages_details']);
  }

  ngOnDestroy(): void {
    if (this.shouldDestroy) {
      this.appStateManage.StorageKey.removeItem('EstSiteRef');
      this.appStateManage.StorageKey.removeItem('EstSiteName');
    }
  }

}
