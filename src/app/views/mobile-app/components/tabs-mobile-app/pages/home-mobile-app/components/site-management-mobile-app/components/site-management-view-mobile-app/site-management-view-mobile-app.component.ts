import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';

@Component({
  selector: 'app-site-management-view-mobile-app',
  templateUrl: './site-management-view-mobile-app.component.html',
  styleUrls: ['./site-management-view-mobile-app.component.scss'],
  standalone: false
})
export class SiteManagementViewMobileAppComponent implements OnInit {
  Entity: Site = Site.CreateNewInstance();
  MasterList: Site[] = [];
  DisplayMasterList: Site[] = [];
  SearchString: string = '';
  SelectedSite: Site = Site.CreateNewInstance();
  CustomerRef: number = 0;
  modalOpen: boolean = false;
  companyRef: number = 0;

  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private companystatemanagement: CompanyStateManagement,
    private dateService: DateconversionService,
    private appStateManagement: AppStateManageService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    public loadingService: LoadingService,
  ) { }

  async ngOnInit(): Promise<void> { }

  ionViewWillEnter = async () => {
    await this.loadSiteIfCompanyExists();
  };

  ngOnDestroy(): void { }

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
    try {
      this.companyRef = Number(this.appStateManagement.localStorage.getItem('SelectedCompanyRef'));
      if (this.companyRef <= 0) {
        await this.toastService.present('Company not selected', 1000, 'danger');
        await this.haptic.error();
        return;
      }
      this.appStateManagement.setSiteRef(0, '');
      await this.getSiteListByCompanyRef();
    } catch (error) {
      console.error('Error loading site data:', error);
    }
  }

  formatDate = (date: string | Date): string => this.dateService.formatDate(date);

  get siteDetails() {
    const p = this.SelectedSite?.p;
    return [
      { label: 'Site Name:', value: p?.Name },
      { label: 'Address Line 1:', value: p?.AddressLine1 },
      { label: 'Address Line 2:', value: p?.AddressLine2 },
      { label: 'City Name:', value: p?.CityName },
      { label: 'PinCode:', value: p?.PinCode },
      {
        label: 'Estimated Starting Date:',
        value: p?.EstimatedStartingDate ? this.formatDate(p.EstimatedStartingDate) : null,
      },
      {
        label: 'Estimated End Date:',
        value: p?.EstimatedEndDate ? this.formatDate(p.EstimatedEndDate) : null,
      },
      { label: 'Number Of Plots:', value: p?.NumberOfPlots },
      { label: 'Total Land Area In Sqft:', value: p?.TotalLandAreaInSqft },
      { label: 'Total Land Area In Sqm:', value: p?.TotalLandAreaInSqm },
    ];
  }

  getSiteListByCompanyRef = async () => {
    try {
      await this.loadingService.show();
      this.MasterList = [];
      this.DisplayMasterList = [];
      if (this.companyRef <= 0) {
        await this.toastService.present('Company not selected', 1000, 'danger');
        await this.haptic.error();
        return;
      }
      const lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      });
      this.MasterList = lst;
      this.DisplayMasterList = lst;
    } catch (error) {
      console.error('Error fetching site list:', error);
    } finally {
      await this.loadingService.hide();
    }
  };
}
