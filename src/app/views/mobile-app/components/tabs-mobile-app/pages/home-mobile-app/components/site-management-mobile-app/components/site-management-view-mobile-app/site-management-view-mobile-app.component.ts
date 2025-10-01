import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
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
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-site-management-view-mobile-app',
  templateUrl: './site-management-view-mobile-app.component.html',
  styleUrls: ['./site-management-view-mobile-app.component.scss'],
  standalone: false,
  animations: [
    trigger('expandCollapse', [
      state(
        'collapsed',
        style({
          height: '0px',
          opacity: 0,
          padding: '0px',
          overflow: 'hidden',
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
          opacity: 1,
          padding: '*',
          overflow: 'hidden',
        })
      ),
      transition('collapsed <=> expanded', [animate('300ms ease')]),
    ]),
  ],
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
  public selectedSiteId: number | null = null;
  public formattedSiteDetails: any[] = [];

  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private companystatemanagement: CompanyStateManagement,
    private dateService: DateconversionService,
    private appStateManagement: AppStateManageService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    public loadingService: LoadingService
  ) {}

  async ngOnInit(): Promise<void> {}

  ionViewWillEnter = async () => {
    await this.loadSiteIfCompanyExists();
  };

  ngOnDestroy(): void {}

openModal(site: Site): void {
  this.SelectedSite = site;
  this.modalOpen = true;
  // Call a new function to populate the formatted details
  this.setFormattedSiteDetails();
}

closeModal(): void {
  this.modalOpen = false;
  this.SelectedSite = Site.CreateNewInstance();
  // Clear the details when the modal is closed
  this.formattedSiteDetails = []; 
}
  async handleRefresh(event: CustomEvent): Promise<void> {
    await this.getSiteListByCompanyRef();
    (event.target as HTMLIonRefresherElement).complete();
  }
  public toggleDetails(siteId: number): void {
    // If the same item is clicked, close it. Otherwise, open the new item.
    if (this.selectedSiteId === siteId) {
      this.selectedSiteId = null;
    } else {
      this.selectedSiteId = siteId;
    }
  }

  private async loadSiteIfCompanyExists(): Promise<void> {
    try {
      this.companyRef = Number(
        this.appStateManagement.localStorage.getItem('SelectedCompanyRef')
      );
      if (this.companyRef <= 0) {
        await this.toastService.present('Company not selected', 1000, 'danger');
        await this.haptic.error();
        return;
      }
      this.appStateManagement.setSiteRefForMobile(0, '');
      await this.getSiteListByCompanyRef();
    } catch (error) {
    }
  }

  formatDate = (date: string | Date): string =>
    this.dateService.formatDate(date);

  // New method to calculate and store the details
private setFormattedSiteDetails(): void {
  const p = this.SelectedSite?.p;
  if (!p) {
    this.formattedSiteDetails = [];
    return;
  }
  
  this.formattedSiteDetails = [
    { label: 'Site Name:', value: p.Name },
    { label: 'Address Line 1:', value: p.AddressLine1 },
    { label: 'Address Line 2:', value: p.AddressLine2 ,isLink: this.isValidUrl(p.AddressLine2) },
    { label: 'City Name:', value: p.CityName },
    { label: 'PinCode:', value: p.PinCode },
    {
      label: 'Estimated Starting Date:',
      value: p.EstimatedStartingDate
        ? this.formatDate(p.EstimatedStartingDate)
        : null,
    },
    {
      label: 'Estimated End Date:',
      value: p.EstimatedEndDate ? this.formatDate(p.EstimatedEndDate) : null,
    },
    { label: 'Number Of Plots:', value: p.NumberOfPlots },
    { label: 'Total Land Area In Sqft:', value: p.TotalLandAreaInSqft },
    { label: 'Total Land Area In Sqm:', value: p.TotalLandAreaInSqm },
  ];
}

isValidUrl(url: string | null): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

async openLink(url: string | null): Promise<void> {
  if (!url) {
    await this.toastService.present('Location link not available.', 1000, 'warning');
    return;
  }

  try {
    await Browser.open({ url });
  } catch (error) {
    await this.toastService.present('Could not open map. Please try again.', 1000, 'danger');
  }
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
      const lst = await Site.FetchEntireListByCompanyRef(
        this.companyRef,
        async (errMsg) => {
          await this.toastService.present(errMsg, 1000, 'danger');
          await this.haptic.error();
        }
      );
      this.MasterList = lst;
      this.DisplayMasterList = lst;
    } catch (error) {
    } finally {
      await this.loadingService.hide();
    }
  };

  async OpenActualStage(site: Site) {
    if (site && site.p) {
      await this.appStateManagement.setSiteRefForMobile(site.p.Ref, site.p.Name);
      this.router.navigate([
        'mobile-app/tabs/dashboard/site-management/site-details',
      ]);
    } else {
      await this.toastService.present('Site data is incomplete', 1000, 'danger');
      await this.haptic.error();
    }
  }
}