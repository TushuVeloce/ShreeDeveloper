import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-site-management',
  templateUrl: './site-management.page.html',
  styleUrls: ['./site-management.page.scss'],
  standalone: false
})
export class SiteManagementPage implements OnInit {
  Entity: Site = Site.CreateNewInstance();
  MasterList: Site[] = [];
  DisplayMasterList: Site[] = [];
  SearchString: string = '';
  SelectedSite: Site = Site.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10;
  currentPage = 1;
  total = 0;
  isLoading: boolean = false;
  modalOpen: boolean = false;
  companyRef:number=0;
  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private companystatemanagement: CompanyStateManagement,
    private dateService: DateconversionService,
    private appStateManagement: AppStateManageService
  ) {}
  async ngOnInit(): Promise<void> {
    await this.loadSiteIfCompanyExists();
    console.log('companyRef :', await this.companyRef);
  }

  ionViewWillEnter = async () => {
    this.companyRef = Number(this.appStateManagement.StorageKey.getItem('SelectedCompanyRef'));
    await this.loadSiteIfCompanyExists();
  };

  ngOnDestroy(): void {
    // cleanup logic if needed later
  }
  openModal(site: Site): void {
    this.SelectedSite = site;
    this.modalOpen = true;
  }
  closeModal(): void {
    this.modalOpen = false;
    this.SelectedSite = Site.CreateNewInstance();
  }
  async handleRefresh(event: CustomEvent): Promise<void> {
    await this.getSiteListByCompanyRef();
    (event.target as HTMLIonRefresherElement).complete();
  }


  private async loadSiteIfCompanyExists(): Promise<void> {
    if (this.companyRef <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.getSiteListByCompanyRef();
  }

  formatDate = (date: string | Date): string =>
    this.dateService.formatDate(date);

  getSiteListByCompanyRef = async () => {
    try {
      this.isLoading = true;
      this.MasterList = [];
      this.DisplayMasterList = [];
      if (this.companyRef <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }
      let lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.MasterList = lst;
      console.log('Site :', this.MasterList);
      this.DisplayMasterList = this.MasterList;
    } catch (error) {
      // console.log('error :', error);
    } finally {
      this.isLoading = false;
    }
  }

  OpenActualStage = async (item: Site) => {
    this.appStateManagement.setSiteRef(item.p.Ref,item.p.Name)
    await this.router.navigate(['app_homepage/tabs/site-management/actual-stage']);
  };
}
