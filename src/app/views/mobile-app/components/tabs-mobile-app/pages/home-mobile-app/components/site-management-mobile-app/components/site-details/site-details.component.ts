import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonTitle, IonHeader, IonToolbar, IonButtons, IonButton } from "@ionic/angular/standalone";
import { Plot } from 'src/app/classes/domain/entities/website/masters/plot/plot';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';

@Component({
  selector: 'app-site-details',
  templateUrl: './site-details.component.html',
  styleUrls: ['./site-details.component.scss'],
  standalone: false
})
export class SiteDetailsComponent implements OnInit {

  Entity: Plot = Plot.CreateNewInstance();
  SiteList: Site[] = [];
  singleSite: Site | null = null;
  MasterList: Plot[] = [];
  DisplayMasterList: Plot[] = [];
  SelectedPlot: Plot = Plot.CreateNewInstance();
  companyRef: number = 0;
  siteRef: number = 0;
  siteName: string = '';

  constructor(
    private route: Router,
    private loading: LoadingService,
    private toast: ToastService,
    private haptics: HapticService,
    private appStateManagement: AppStateManageService,
  ) { }

  async ngOnInit() {
    this.companyRef = Number(this.appStateManagement.localStorage.getItem('SelectedCompanyRef'));
    if (this.companyRef <= 0) {
      await this.toast.present('Company not selected', 1000, 'danger');
      await this.haptics.error();
      return;
    }
    this.siteRef = Number(this.appStateManagement.localStorage.getItem('siteRf'));
    console.log('this.siteRef :', this.siteRef);
    this.siteName = String(this.appStateManagement.localStorage.getItem('siteName'));
    console.log('this.siteName :', this.siteName);


    await this.getSiteListByCompanyRef(this.siteRef);
    await this.getPlotListBySiteandBookingRemarkRef(this.siteRef, 0);
  }

  async handleRefresh(event: CustomEvent) {
    try {
      await this.getSiteListByCompanyRef(this.siteRef);
      await this.getPlotListBySiteandBookingRemarkRef(this.siteRef, 0);
    } finally {
      (event.target as HTMLIonRefresherElement).complete();
    }
  }


  getPlotListBySiteandBookingRemarkRef = async (siteRef: number, bookingRemarkRef: number) => {
    this.MasterList = [];
    this.DisplayMasterList = [];

    const lst = await Plot.FetchEntireListBySiteandBookingRemarkRef(siteRef, bookingRemarkRef, async (errMsg) => {
      await this.toast.present(errMsg, 1000, 'danger');
      await this.haptics.error();
    });

    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
  }

  getSiteListByCompanyRef = async (ref: number) => {
    try {
      await this.loading.show();
      this.SiteList = [];

      if (this.companyRef <= 0) {
        await this.toast.present('Company not selected', 1000, 'danger');
        await this.haptics.error();
        return;
      }

      const lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async (errMsg) => {
        await this.toast.present(errMsg, 1000, 'danger');
        await this.haptics.error();
      });

      this.SiteList = lst;

      // Use find() safely
      this.singleSite = this.SiteList.find(site => site.p?.Ref === ref) || null;

    } catch (error) {
      await this.toast.present('Something went wrong', 1000, 'danger');
      await this.haptics.error();
    } finally {
      await this.loading.hide();
    }
  };
}
