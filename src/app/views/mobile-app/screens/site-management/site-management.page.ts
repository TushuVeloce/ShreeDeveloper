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
  DisplayMasterList: any[] = [];
  SearchString: string = '';
  SelectedSite: Site = Site.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10;
  currentPage = 1;
  total = 0;
  isLoading: boolean = false;
  modalOpen: boolean = false;
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private companystatemanagement: CompanyStateManagement,
    private dateService: DateconversionService,
  ) { }
  async ngOnInit(): Promise<void> {
    await this.loadSiteIfCompanyExists();
  }

  ionViewWillEnter = async () => {
    await this.loadSiteIfCompanyExists();
    // console.log('Leave request refreshed on view enter');
    this.DisplayMasterList = [
      {
        p: {
          Name: 'Site A',
          CompanyName: 'ABC Constructions',
          AddressLine1: '123 Main Street',
          AddressLine2: 'Near Park Avenue',
          CityName: 'Mumbai',
          EstimatedStartingDate: '2025-05-01',
          EstimatedEndDate: '2025-08-31',
          NumberOfPlots: 12,
          PinCode: '400001',
          SiteInchargeName: 'Rahul Sharma',
          TotalLandAreaInSqft: '15000',
          TotalLandAreaInSqm: '1393.5'
        }
      },
      {
        p: {
          Name: 'Site B',
          CompanyName: 'XYZ Builders',
          AddressLine1: '456 Lake View Road',
          AddressLine2: 'Opposite City Mall',
          CityName: 'Pune',
          EstimatedStartingDate: '2025-06-15',
          EstimatedEndDate: '2025-12-01',
          NumberOfPlots: 8,
          PinCode: '411001',
          SiteInchargeName: 'Meera Kulkarni',
          TotalLandAreaInSqft: '10000',
          TotalLandAreaInSqm: '929.0'
        }
      }
    ];

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
    if (this.companyRef() <= 0) {
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
      if (this.companyRef() <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }
      let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
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
    await this.router.navigate(['app_homepage/tabs/site-management/actual-stage']);
  };
}
