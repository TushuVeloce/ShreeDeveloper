import { Component, OnInit, effect } from '@angular/core';
import { Router } from '@angular/router';
import { BookingRemark } from 'src/app/classes/domain/domainenums/domainenums';
import { CustomerEnquiry } from 'src/app/classes/domain/entities/website/customer_management/customerenquiry/customerenquiry';
import { CustomerFollowUp } from 'src/app/classes/domain/entities/website/customer_management/customerfollowup/customerfollowup';
import { Plot } from 'src/app/classes/domain/entities/website/masters/plot/plot';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-customer-follow-up',
  templateUrl: './customer-follow-up.page.html',
  styleUrls: ['./customer-follow-up.page.scss'],
  standalone: false
})
export class CustomerFollowUpPage implements OnInit {
  Entity: CustomerFollowUp = CustomerFollowUp.CreateNewInstance();
  SiteList: Site[] = [];
  PlotList: Plot[] = [];
  followupList: CustomerFollowUp[] = [];
  FilterFollowupList: CustomerFollowUp[] = [];
  SelectedFollowUp: CustomerFollowUp = CustomerFollowUp.CreateNewInstance();

  CustomerRef: number = 0;
  InterestedPlotRef: number = 0;
  SiteManagementRef: number = 0;
  date: string = '';
  strCDT: string = '';
  ModalOpen: boolean = false;

  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private appStateManage: AppStateManageService,
    private companystatemanagement: CompanyStateManagement,
    private dateconversionService: DateconversionService
  ) {
    effect(async() => {
      await this.loadSitesByCompanyRef();
    });
  }
  
  async ngOnInit() {

    if (!this.date) {
      await this.initializeDate();
    }
  }

  private async initializeDate() {
    this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
    const parts = this.strCDT.substring(0, 16).split('-');

    if (parts.length >= 3) {
      this.date = `${parts[0]}-${parts[1]}-${parts[2]}`;
      this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
      await this.fetchFollowUps();
    }
  }

  async onDateChange(date: string) {
    if (date) {
      const parts = date.split('-');
      if (parts.length >= 3) {
        this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
      }
    } else {
      this.date = '';
      this.strCDT = '';
    }

    await this.fetchFollowUps();
  }

  formatDate(date: string | Date): string {
    return this.dateconversionService.formatDate(date);
  }

  private async fetchFollowUps() {
    const followUps = await CustomerFollowUp.FetchEntireListByDateandPlotRef(
      this.strCDT,
      this.InterestedPlotRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );

    this.followupList = followUps;
    this.FilterFollowupList = followUps;
    console.log('Follow-up list:', this.followupList);
  }

  private async loadSitesByCompanyRef() {
    this.followupList = [];
    this.FilterFollowupList = [];
    this.SiteList = [];

    const companyRef = await this.companystatemanagement.SelectedCompanyRef();
    if (companyRef <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }

    const sites = await Site.FetchEntireListByCompanyRef(
      companyRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );

    this.SiteList = sites;
  }

  async loadPlotsBySiteRef(siteRef: number) {
    if (siteRef <= 0) {
      await this.uiUtils.showWarningToster(`Please select a site`);
      return;
    }

    this.InterestedPlotRef = 0;

    const plots = await Plot.FetchEntireListBySiteandbookingremarkRef(
      siteRef,
      BookingRemark.Booked,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );

    this.PlotList = plots;
  }

  async onFollowUpClick(followup: CustomerFollowUp) {
    this.SelectedFollowUp = followup.GetEditableVersion();
    CustomerFollowUp.SetCurrentInstance(this.SelectedFollowUp);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');

    await this.router.navigate(['/app_homepage/tabs/crm/customer-follow-up/add']);
  }

  async onAddCustomerEnquiry() {
    const companyRef = this.companystatemanagement.SelectedCompanyRef();
    if (companyRef <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }

    await this.router.navigate(['/app_homepage/tabs/crm/customer-follow-up/add']);
  }
}
