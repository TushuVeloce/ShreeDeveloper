import { DatePipe } from '@angular/common';
import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingRemark, DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { CustomerEnquiry } from 'src/app/classes/domain/entities/website/customer_management/customerenquiry/customerenquiry';
import { CustomerFollowUp } from 'src/app/classes/domain/entities/website/customer_management/customerfollowup/customerfollowup';
import { Plot } from 'src/app/classes/domain/entities/website/masters/plot/plot';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';


@Component({
  selector: 'app-customer-followup',
  templateUrl: './customer-followup.component.html',
  styleUrls: ['./customer-followup.component.scss'],
  standalone: false
})
export class CustomerFollowupComponent implements OnInit {

  Entity: CustomerFollowUp = CustomerFollowUp.CreateNewInstance();
  SiteList: Site[] = [];
  PlotList: Plot[] = [];
  MasterList: CustomerFollowUp[] = [];
  DisplayMasterList: CustomerFollowUp[] = [];
  SearchString: string = '';
  SelectedCustomerEnquiry: CustomerEnquiry = CustomerEnquiry.CreateNewInstance();
  SelectedFollowUp: CustomerFollowUp = CustomerFollowUp.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  followup: CustomerFollowUp[] = [];
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  InterestedPlotRef: number = 0
  SiteManagementRef: number = 0;
  ReminderDate: string = ''
  strCDT: string = ''

  ContactModeList = DomainEnums.ContactModeList(
    true,
    '--Select Contact Type--'
  );

  headers: string[] = [
    'Name',
    'Contact No',
    'Date',
    'Customer Status',
    'Action',
  ]; constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement, private dtu: DTU, private datePipe: DatePipe, private DateconversionService: DateconversionService
  ) {
    effect(() => {
      // this.getCustomerFollowUpListByDateCompanyAndContactModeRef();
    });
  }


  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    try {
      this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
    } catch (error) {
      // Optionally, show a toaster or alert
      await this.uiUtils.showErrorToster('Failed to get current date and time');
    }

    let parts = this.strCDT.substring(0, 16).split('-');
    // Construct the new date format
    this.ReminderDate = `${parts[0]}-${parts[1]}-${parts[2]}`;
    this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
    if (this.strCDT != '') {
      this.getCustomerFollowUpListByDateCompanyAndContactModeRef();
    }

    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withDropdown');
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  getCustomerFollowUpListByDateCompanyAndContactModeRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.strCDT = this.dtu.ConvertStringDateToFullFormat(this.ReminderDate);
    let FollowUp = await CustomerFollowUp.FetchEntireListByDateComapanyAndContactModeRef(this.companyRef(), this.strCDT, this.Entity.p.ContactMode,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.followup = FollowUp
    this.DisplayMasterList = FollowUp;
    this.loadPaginationData();
  };

  get paginatedList() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }

  // 🔑 Whenever filteredList event is received
  onFilteredList(list: any[]) {
    this.DisplayMasterList = list;
    this.currentPage = 1;   // reset to first page after filtering

    this.loadPaginationData();
  }

  onEditClicked = async (followup: CustomerFollowUp) => {
    this.SelectedFollowUp = followup.GetEditableVersion();
    CustomerFollowUp.SetCurrentInstance(this.SelectedFollowUp);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    this.AddFollowUp();
  };


  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  };

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };

  AddFollowUp = () => {
    this.router.navigate(['/homepage/Website/Customer_FollowUp_Details']);
  }
}
