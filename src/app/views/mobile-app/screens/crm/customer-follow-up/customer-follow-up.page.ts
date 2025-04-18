import { Component, effect, OnInit } from '@angular/core';
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
  Entity: CustomerEnquiry = CustomerEnquiry.CreateNewInstance();
  SiteList: Site[] = [];
  PlotList: Plot[] = [];
  followupList: CustomerFollowUp[] = [];
  FilterFollowupList: CustomerFollowUp[] = [];
  SelectedFollowUp: CustomerFollowUp = CustomerFollowUp.CreateNewInstance();

  CustomerRef: number = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;
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
    private DateconversionService: DateconversionService
  ) {
    effect(() => {
      this.formulateSiteListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(false);

    if (this.date == '') {
      this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
      let parts = this.strCDT.substring(0, 16).split('-');

      this.date = `${parts[0]}-${parts[1]}-${parts[2]}`;
      this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;

      if (this.strCDT != '') {
        this.getCustomerFollowUpListByDateandPlotRef();
      }
    }
  }

  DateToStandardDateTime = async (date: string) => {
    if (date != '') {
      let parts = date.substring(0, 16).split('-');
      this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
    } else {
      this.date = '';
      this.strCDT = '';
    }

    this.getCustomerFollowUpListByDateandPlotRef();
  }

  formatDate(date: string | Date): string {
    return this.DateconversionService.formatDate(date);
  }

  getCustomerFollowUpListByDateandPlotRef = async () => {
    const FollowUp = await CustomerFollowUp.FetchEntireListByDateandPlotRef(
      this.strCDT,
      this.InterestedPlotRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );

    this.followupList = FollowUp;
    console.log('followup', this.followupList);
  };

  formulateSiteListByCompanyRef = async () => {
    this.followupList = [];
    this.FilterFollowupList = [];
    this.SiteList = [];

    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }

    const lst = await Site.FetchEntireListByCompanyRef(
      this.companyRef(),
      async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg)
    );

    this.SiteList = lst;
  }

  getPlotBySiteRefList = async (siteRef: number) => {
    if (siteRef <= 0) {
      await this.uiUtils.showWarningToster(`Please Select Site`);
      return;
    }

    this.InterestedPlotRef = 0;

    const lst = await Plot.FetchEntireListBySiteandbookingremarkRef(
      siteRef,
      BookingRemark.Booked,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );

    this.PlotList = lst;
  };

  onFollowUPClicked = async (followup: CustomerFollowUp) => {
    this.SelectedFollowUp = followup.GetEditableVersion();
    CustomerFollowUp.SetCurrentInstance(this.SelectedFollowUp);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/app_homepage/tabs/crm/customer-follow-up/edit']);
  };

  async AddCustomerEnquiryForm() {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }

    this.router.navigate(['/app_homepage/tabs/crm/customer-follow-up/add']);
  }
}
