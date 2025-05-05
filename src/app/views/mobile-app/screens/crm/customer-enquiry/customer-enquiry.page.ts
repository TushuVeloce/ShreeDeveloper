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
  selectedStatus: number = CustomerStatus.Interested;
  isLoading: boolean = false;

  CustomerStatusEnum = CustomerStatus;
  statusOptions = [
    { label: 'Interested', value: CustomerStatus.Interested },
    { label: 'In-process', value: CustomerStatus.LeadInprocess },
    { label: 'Closed', value: CustomerStatus.LeadClosed },
    { label: 'Converted', value: CustomerStatus.ConvertToDeal }
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

  ionViewWillEnter = async () => {
    await this.getCustomerEnquiryListByCompanyRef();
  };

  companyRef(): number {
    return this.companystatemanagement.SelectedCompanyRef();
  }

  async getCustomerEnquiryListByCompanyRef() {
    this.CustomerEnquiryList = [];
    this.FilteredCustomerEnquiryList = [];
    this.isLoading = true;

    try {
      if (this.companyRef() <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }

      const list = await CustomerEnquiry.FetchEntireListByCompanyRef(
        this.companyRef(),
        async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
      );

      list.forEach((e) => e.p.CustomerFollowUps.push(CustomerFollowUpProps.Blank()));

      this.CustomerEnquiryList = list;
      this.filterCustomerList();
    } catch (error: any) {
      await this.uiUtils.showErrorMessage('Unexpected Error', error?.message || 'Something went wrong');
    } finally {
      this.isLoading = false;
    }
  }

  filterCustomerList() {
    this.FilteredCustomerEnquiryList = this.CustomerEnquiryList.filter(
      (customer) => customer.p.CustomerStatus === this.selectedStatus
    );
  }

  onEditClicked = async (item: CustomerEnquiry) => {
    try {
      item.p.CustomerFollowUps = [CustomerFollowUpProps.Blank()];
      this.SelectedCustomerEnquiry = item.GetEditableVersion();
      CustomerEnquiry.SetCurrentInstance(this.SelectedCustomerEnquiry);
      this.appStateManage.StorageKey.setItem('Editable', 'Edit');
      this.router.navigate(['/app_homepage/tabs/crm/customer-enquiry/edit']);
    } catch (error: any) {
      await this.uiUtils.showErrorMessage('Error', error?.message || 'Could not open edit form.');
    }
  };

  onDeleteClicked = async (item: CustomerEnquiry) => {
    try {
      await this.uiUtils.showConfirmationMessage(
        'Delete',
        `This process is <strong>IRREVERSIBLE!</strong><br/>Are you sure that you want to DELETE this Customer Enquiry?`,
        async () => {
          try {
            await item.DeleteInstance(async () => {
              await this.uiUtils.showSuccessToster(`Customer Enquiry ${item.p.Name} has been deleted!`);
              await this.getCustomerEnquiryListByCompanyRef();
            });
          } catch (deleteError: any) {
            await this.uiUtils.showErrorMessage('Delete Failed', deleteError?.message || 'Could not delete.');
          }
        }
      );
    } catch (error: any) {
      await this.uiUtils.showErrorMessage('Error', error?.message || 'Something went wrong.');
    }
  };

  onViewClicked(item: CustomerEnquiry) {
    this.SelectedCustomerEnquiry = item;
    this.ModalOpen = true;
  }

  closeModal() {
    this.ModalOpen = false;
  }

  async AddCustomerEnquiryForm() {
    try {
      if (this.companyRef() <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }
      this.router.navigate(['homepage/Website/Customer_Enquiry_Details']);
    } catch (error: any) {
      await this.uiUtils.showErrorMessage('Error', error?.message || 'Failed to open the add form.');
    }
  }
}
