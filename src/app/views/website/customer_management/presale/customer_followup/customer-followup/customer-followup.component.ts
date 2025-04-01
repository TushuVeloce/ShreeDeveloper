import { DatePipe } from '@angular/common';
import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerEnquiry } from 'src/app/classes/domain/entities/website/customer_management/customerenquiry/customerenquiry';
import { CustomerFollowUp } from 'src/app/classes/domain/entities/website/customer_management/customerfollowup/customerfollowup';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
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
  MasterList: CustomerEnquiry[] = [];
  DisplayMasterList: CustomerEnquiry[] = [];
  SearchString: string = '';
  SelectedCustomerEnquiry: CustomerEnquiry = CustomerEnquiry.CreateNewInstance();
  SelectedFollowUp: CustomerFollowUp = CustomerFollowUp.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  followup: CustomerFollowUp[] = [];
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  siteref: number = 0
  date: string = ''

  headers: string[] = [
    'Sr.No.',
    'Name',
    'Contact No',
    'Date',
    'Customer Status',
    'Action',
  ]; constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement, private dtu: DTU, private datePipe: DatePipe
  ) {
    effect(() => {
      this.getCustomerFollowUpListByEnquiryRef()
      this.FormulateSiteListByCompanyRef();
      // this.getCustomerFollowUpListByEnquiryRef();
    });
  }


  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(false);
    if (this.date == '') {
      let strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
      let parts = strCDT.substring(0, 16).split('-');
      // Construct the new date format
      const formattedDate = `${parts[0]}-${parts[1]}-${parts[2]}`;
      strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
      this.date = formattedDate;
      this.getCustomerFollowUpListByDateandSiteRef(strCDT, this.siteref);
    }
    
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  // getCustomerFollowUpListByCompanyRef = async () => {
  //   this.MasterList = [];
  //   this.DisplayMasterList = [];
  //   console.log('companyRef :', this.companyRef());
  //   if (this.companyRef() <= 0) {
  //     await this.uiUtils.showErrorToster('Company not Selected');
  //     return;
  //   }
  //   let lst = await CustomerEnquiry.FetchEntireListByCompanyRef(
  //     this.companyRef(),
  //     async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
  //   );
  //   this.MasterList = lst;
  //   console.log('CustomerEnquiryList :', this.MasterList);

  //   this.DisplayMasterList = this.MasterList;
  //   this.loadPaginationData();
  //   this.getCustomerFollowUpListByEnquiryRef()
  //   // New for customerfollowup

  // };

  getCustomerFollowUpListByEnquiryRef = async () => {
    // this.MasterList = [];
    // this.DisplayMasterList = [];

    // let CustomerEnquiryRefs = this.DisplayMasterList[0].p.CustomerFollowUps[0].CustomerEnquiryRef;
    // console.log('CustomerEnquiryRefs :', CustomerEnquiryRefs);
    let FollowUp = await CustomerFollowUp.FetchEntireListByCustomerEnquiryRef(
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
    console.log(FollowUp);
    this.followup = FollowUp
    // this.MasterList = FollowUp;
    // this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  onSiteReforDateChange(selectedSiteRef?: number, date?: string) {
    if (selectedSiteRef && date) {
      this.getCustomerFollowUpListByDateandSiteRef(date, selectedSiteRef);
    } else if (selectedSiteRef) {
      this.getCustomerFollowUpListBySiteRef(selectedSiteRef);
    } else if (date) {
      this.getCustomerFollowUpListByDate(date);
    }
  }

  getCustomerFollowUpListByDate = async (date: string) => {
    console.log('date :', date);
    // this.MasterList = [];
    // this.DisplayMasterList = [];

    // let CustomerEnquiryRefs = this.DisplayMasterList[0].p.CustomerFollowUps[0].CustomerEnquiryRef;
    // console.log('CustomerEnquiryRefs :', CustomerEnquiryRefs);
    let FollowUp = await CustomerFollowUp.FetchEntireListByDate(this.date,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
    console.log(FollowUp);
    this.followup = FollowUp
    // this.MasterList = FollowUp;
    // this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  getCustomerFollowUpListBySiteRef = async (siteref: number) => {
    console.log('siteref :', siteref);
    // this.MasterList = [];
    // this.DisplayMasterList = [];

    // let CustomerEnquiryRefs = this.DisplayMasterList[0].p.CustomerFollowUps[0].CustomerEnquiryRef;
    // console.log('CustomerEnquiryRefs :', CustomerEnquiryRefs);
    let FollowUp = await CustomerFollowUp.FetchEntireListBySiteRef(siteref,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
    console.log(FollowUp);
    this.followup = FollowUp
    // this.MasterList = FollowUp;
    // this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  getCustomerFollowUpListByDateandSiteRef = async (date: string, site: number) => {
    console.log('site and ref :', date, this.siteref);
    // this.MasterList = [];
    // this.DisplayMasterList = [];

    // let CustomerEnquiryRefs = this.DisplayMasterList[0].p.CustomerFollowUps[0].CustomerEnquiryRef;
    // console.log('CustomerEnquiryRefs :', CustomerEnquiryRefs);
    let FollowUp = await CustomerFollowUp.FetchEntireListByandDateSiteRef(date, site,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
    console.log(FollowUp);
    this.followup = FollowUp
    // this.MasterList = FollowUp;
    // this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  FormulateSiteListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    this.SiteList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
    this.loadPaginationData();
  }


  onEditClicked = async (followup: CustomerFollowUp) => {

    // // this.SelectedCustomerEnquiry = item.GetEditableVersion();
    // this.SelectedFollowUp = (followup ? followup.GetEditableVersion() : {}) as CustomerFollowUp
    // CustomerEnquiry.SetCurrentInstance(this.SelectedCustomerEnquiry);
    // CustomerFollowUp.SetCurrentInstance(this.SelectedFollowUp);
    this.SelectedFollowUp = followup.GetEditableVersion();
    CustomerFollowUp.SetCurrentInstance(this.SelectedFollowUp);
    // console.log(CustomerFollowUp.GetCurrentInstance);

    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Customer_FollowUp_Details']);
  };


  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  };
  get paginatedList() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.followup.slice(start, start + this.pageSize);
  }

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
