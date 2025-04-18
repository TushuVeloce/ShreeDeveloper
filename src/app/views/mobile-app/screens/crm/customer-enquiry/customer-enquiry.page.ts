import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerStatus } from 'src/app/classes/domain/domainenums/domainenums';
import { CustomerEnquiry } from 'src/app/classes/domain/entities/website/customer_management/customerenquiry/customerenquiry';
import { CustomerFollowUpProps } from 'src/app/classes/domain/entities/website/customer_management/customerfollowup/customerfollowup';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-customer-enquiry',
  templateUrl: './customer-enquiry.page.html',
  styleUrls: ['./customer-enquiry.page.scss'],
  standalone: false
})
export class CustomerEnquiryPage implements OnInit {
  Entity: CustomerEnquiry = CustomerEnquiry.CreateNewInstance();
  CustomerEnquiryList: CustomerEnquiry[] = [];
  FilteredCustomerEnquiryList: CustomerEnquiry[] = [];
  SelectedCustomerEnquiry: CustomerEnquiry = CustomerEnquiry.CreateNewInstance();
  SearchString: string = '';
  ModalOpen: boolean = false;

  CustomerStatusEnum = CustomerStatus;
  selectedStatus: number = this.CustomerStatusEnum.Interested;
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  statusOptions = [
    { label: 'Interested', value: this.CustomerStatusEnum.Interested },
    { label: 'In-process', value: this.CustomerStatusEnum.LeadInprocess },
    { label: 'Closed', value: this.CustomerStatusEnum.LeadClosed },
    { label: 'Converted', value: this.CustomerStatusEnum.ConvertToDeal }
  ];

  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private appStateManage: AppStateManageService,
    private companystatemanagement: CompanyStateManagement
  ) { }

  ngOnInit(): void {
    this.getCustomerEnquiryListByCompanyRef();
  }

  async getCustomerEnquiryListByCompanyRef() {
    this.CustomerEnquiryList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }

    let list = await CustomerEnquiry.FetchEntireListByCompanyRef(
      this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );

    list.forEach((e) => e.p.CustomerFollowUps.push(CustomerFollowUpProps.Blank()));
    this.CustomerEnquiryList = list;
    this.filterCustomerList(); // Default filter
  }

  onEditClicked = async (item: CustomerEnquiry) => {
    item.p.CustomerFollowUps = [CustomerFollowUpProps.Blank()];
    this.SelectedCustomerEnquiry = item.GetEditableVersion();
    CustomerEnquiry.SetCurrentInstance(this.SelectedCustomerEnquiry);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    this.router.navigate(['/app_homepage/tabs/crm/customer-enquiry/edit']);
  };

  onDeleteClicked = async (item: CustomerEnquiry) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong><br/>Are you sure that you want to DELETE this Customer Enquiry?`,
      async () => {
        await item.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(`Customer Enquiry ${item.p.Name} has been deleted!`);
          await this.getCustomerEnquiryListByCompanyRef();
        });
      }
    );
  };

  onViewClicked = (item: CustomerEnquiry) => {
    this.SelectedCustomerEnquiry = item;
    this.ModalOpen = true;
  };

  async AddCustomerEnquiryForm() {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.router.navigate(['/app_homepage/tabs/crm/customer-enquiry/add']);
  }

  filterCustomerList() {
    this.FilteredCustomerEnquiryList = this.CustomerEnquiryList.filter(
      (customer) => customer.p.CustomerStatus === this.selectedStatus
    );
  }

  closeModal() {
    this.ModalOpen = false;
  }
}
