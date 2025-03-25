import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerEnquiry } from 'src/app/classes/domain/entities/website/customer_management/customerenquiry/customerenquiry';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
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
  SelectedCustomerEnquiry: CustomerEnquiry =
    CustomerEnquiry.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = [
    'Sr.No.',
    'Name',
    'Contact No',
    'Date',
    'Customer Status',
    'Action',
  ];
  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private appStateManage: AppStateManageService,
    private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement
  ) {
    effect(() => {
      this.getCustomerEnquiryListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(false);
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  getCustomerEnquiryListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    console.log('companyRef :', this.companyRef());
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await CustomerEnquiry.FetchEntireListByCompanyRef(
      this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.MasterList = lst;
    console.log('CustomerEnquiryList :', this.MasterList);

    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  onEditClicked = async (item: CustomerEnquiry) => {
    // let props = Object.assign(CustomerEnquiryProps.Blank(),item.p);
    // this.SelectedCustomerEnquiry = CustomerEnquiry.CreateInstance(props,true);

    this.SelectedCustomerEnquiry = item.GetEditableVersion();

    CustomerEnquiry.SetCurrentInstance(this.SelectedCustomerEnquiry);

    this.appStateManage.StorageKey.setItem('Editable', 'Edit');

    this.router.navigate(['/homepage/Website/Customer_Enquiry_Details']);
  };

  onDeleteClicked = async (customerenquiry: CustomerEnquiry) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
    Are you sure that you want to DELETE this CustomerEnquiry?`,
      async () => {
        await customerenquiry.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Customer Enquiry ${customerenquiry.p.Name} has been deleted!`
          );
          await this.getCustomerEnquiryListByCompanyRef();
          this.SearchString = '';
          this.loadPaginationData();
        });
      }
    );
  };

  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  };
  get paginatedList() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };
  async AddCustomerEnquiryForm() {
    if (this.companyRef() <= 0) {
      this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.router.navigate(['/homepage/Website/Customer_Enquiry_Details']);
  }
  filterTable = () => {
    if (this.SearchString != '') {
      this.DisplayMasterList = this.MasterList.filter((data: any) => {
        return (
          data.p.Name.toLowerCase().indexOf(this.SearchString.toLowerCase()) >
          -1
        );
      });
    } else {
      this.DisplayMasterList = this.MasterList;
    }
  };
}
