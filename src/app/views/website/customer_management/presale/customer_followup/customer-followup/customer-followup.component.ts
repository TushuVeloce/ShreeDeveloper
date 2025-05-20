import { DatePipe } from '@angular/common';
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

  Entity: CustomerEnquiry = CustomerEnquiry.CreateNewInstance();
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

  headers: string[] = [
    'Sr.No.',
    'Name',
    'Contact No',
    'Date',
    'Customer Status',
    'Action',
  ]; constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement, private dtu: DTU, private datePipe: DatePipe, private DateconversionService: DateconversionService
  ) {
    effect(() => {
      this.formulateSiteListByCompanyRef();
    });
  }


  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(false);
    if (this.ReminderDate == '') {
      this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
      let parts = this.strCDT.substring(0, 16).split('-');
      // Construct the new date format
      this.ReminderDate = `${parts[0]}-${parts[1]}-${parts[2]}`;
      this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
      if (this.strCDT != '') {
        this.getCustomerFollowUpListByDateandPlotRef();
      }
    }

    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  DateToStandardDateTime = async (date: string) => {
    if (date != '') {
      let parts = date.substring(0, 16).split('-');
      // Construct the new date format
      this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
    } else {
      this.ReminderDate = ''; // Clears the date variable when input is cleared
      this.strCDT = '';
    }
    this.getCustomerFollowUpListByDateandPlotRef();
  }

  // Extracted from services date conversion //
  // formatDate(date: string | Date): string {
  //   return this.ReminderDateconversionService.formatDate(date);
  // }

  // getCustomerFollowUpListByDate = async () => {
  //   let FollowUp = await CustomerFollowUp.FetchEntireListByDate(this.strCDT,
  //     async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
  //   this.followup = FollowUp
  //   this.loadPaginationData();
  // };

  // getCustomerFollowUpListByPlotRef = async () => {
  //   if (this.InterestedPlotRef != 0) {
  //     let FollowUp = await CustomerFollowUp.FetchEntireListByDateandPlotRef(this.strCDT, this.InterestedPlotRef,
  //       async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
  //     this.followup = FollowUp
  //     this.loadPaginationData();
  //   }
  // };


  getCustomerFollowUpListByDateandPlotRef = async () => {
    let FollowUp = await CustomerFollowUp.FetchEntireListByDateandPlotRef(this.strCDT, this.InterestedPlotRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.followup = FollowUp
    this.DisplayMasterList = FollowUp;
    this.loadPaginationData();
  };


  formulateSiteListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    this.SiteList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
    // this.SiteManagementRef = lst[0].p.Ref;
    // this.getPlotBySiteRefList(this.SiteManagementRef);
    this.loadPaginationData();
  }


  getPlotBySiteRefList = async (siteRef: number) => {
    let BookingRemarkRef = BookingRemark.Booked;
    if (siteRef <= 0) {
      await this.uiUtils.showWarningToster(`Please Select Site`);
      return;
    }
    this.InterestedPlotRef = 0;

    let lst = await Plot.FetchEntireListBySiteandBookingRemarkRef(
      siteRef, BookingRemarkRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.PlotList = lst;
    // this.InterestedPlotRef = lst[0].p.Ref;

  };

  get paginatedList() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }

  onEditClicked = async (followup: CustomerFollowUp) => {

    // // this.SelectedCustomerEnquiry = item.GetEditableVersion();
    // this.SelectedFollowUp = (followup ? followup.GetEditableVersion() : {}) as CustomerFollowUp
    // CustomerEnquiry.SetCurrentInstance(this.SelectedCustomerEnquiry);
    // CustomerFollowUp.SetCurrentInstance(this.SelectedFollowUp);
    this.SelectedFollowUp = followup.GetEditableVersion();
    CustomerFollowUp.SetCurrentInstance(this.SelectedFollowUp);

    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Customer_FollowUp_Details']);
  };


  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  };

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };


  filterTable = () => {
    if (this.SearchString != '') {
      this.DisplayMasterList = this.MasterList.filter((data: any) => {
        return data.p.Name.toLowerCase().indexOf(this.SearchString.toLowerCase()) > -1
      })
    }
    else {
      this.DisplayMasterList = this.MasterList
    }
  }

  async add() {
    await this.router.navigate(['/homepage/Website/Customer_FollowUp_Details']);
  }
}
