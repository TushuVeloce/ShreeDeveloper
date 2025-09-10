import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { CustomerEnquiry } from 'src/app/classes/domain/entities/website/customer_management/customerenquiry/customerenquiry';
import { CustomerFollowUp, CustomerFollowUpProps } from 'src/app/classes/domain/entities/website/customer_management/customerfollowup/customerfollowup';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-customer-enquiry',
  templateUrl: './customer-enquiry.component.html',
  styleUrls: ['./customer-enquiry.component.scss'],
  standalone: false,
})
export class CustomerEnquiryComponent implements OnInit {
  Entity: CustomerEnquiry = CustomerEnquiry.CreateNewInstance();
  MasterList: CustomerEnquiry[] = [];
  DisplayMasterList: CustomerEnquiry[] = [];
  SearchString: string = '';
  SelectedCustomerEnquiry: CustomerEnquiry = CustomerEnquiry.CreateNewInstance();
  CustomerRef: number = 0;
  SiteRef: number = 0;
  CustomerProgress: number = 0;
  CustomerProgressList = DomainEnums.CustomerProgressList()
  SiteList: Site[] = [];
  pageSize = 5; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = [
    'Sr.No.',
    'Name',
    'Contact No',
    'City',
    'Pincode',
    'Address',
    'Action',
  ];

  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private appStateManage: AppStateManageService,
    private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement,
    private DateconversionService: DateconversionService
  ) {
    effect(() => {
      this.getRegisterCustomerListByCompanySiteAndcustomerProgressEnum();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  // getCustomerEnquiryListByCompanyRef = async () => {
  //   this.MasterList = [];
  //   this.DisplayMasterList = [];
  //   if (this.companyRef() <= 0) {
  //     await this.uiUtils.showErrorToster('Company not Selected');
  //     return;
  //   }
  //   let lst = await CustomerEnquiry.FetchEntireListByCompanyRef(
  //     this.companyRef(),
  //     async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
  //   );
  //   this.MasterList = lst;
  //   this.MasterList.forEach(e => e.p.CustomerFollowUps.push(CustomerFollowUpProps.Blank()))
  //   this.DisplayMasterList = this.MasterList;
  //   this.loadPaginationData();
  // };

  getRegisterCustomerListByCompanySiteAndcustomerProgressEnum = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    let lst = await CustomerEnquiry.FetchEntireListByCompanySiteAndcustomerProgressEnum(this.companyRef(), this.SiteRef, this.CustomerProgress,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  onEditClicked = async (item: CustomerEnquiry) => {
    item.p.CustomerFollowUps = [];
    item.p.CustomerFollowUps.push(CustomerFollowUpProps.Blank())

    this.SelectedCustomerEnquiry = item.GetEditableVersion();

    CustomerEnquiry.SetCurrentInstance(this.SelectedCustomerEnquiry);

    this.appStateManage.StorageKey.setItem('Editable', 'Edit');

    this.AddCustomerEnquiryForm();
  };

  onDeleteClicked = async (customerenquiry: CustomerEnquiry) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
    Are you sure that you want to DELETE this Customer Enquiry?`,
      async () => {
        await customerenquiry.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Customer Enquiry ${customerenquiry.p.Name} has been deleted!`
          );
          await this.getRegisterCustomerListByCompanySiteAndcustomerProgressEnum();
          this.SearchString = '';
          this.loadPaginationData();
        });
      }
    );
  };

  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  }

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

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  }

  async AddCustomerEnquiryForm() {
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    }
    this.router.navigate(['/homepage/Website/Customer_Enquiry_Details']);
  }
}
