import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerStatus, DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { CustomerEnquiry } from 'src/app/classes/domain/entities/website/customer_management/customerenquiry/customerenquiry';
import { CustomerFollowUpProps } from 'src/app/classes/domain/entities/website/customer_management/customerfollowup/customerfollowup';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { FilterService } from 'src/app/services/filter.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-customer-enquiry-mobile',
  templateUrl: './customer-enquiry-mobile.page.html',
  styleUrls: ['./customer-enquiry-mobile.page.scss'],
  standalone:false
})
export class CustomerEnquiryMobilePage implements OnInit {

  Entity: CustomerEnquiry = CustomerEnquiry.CreateNewInstance();
  CustomerEnquiryList: CustomerEnquiry[] = [];
  FilteredCustomerEnquiryList: CustomerEnquiry[] = [];
  SelectedCustomerEnquiry: CustomerEnquiry = CustomerEnquiry.CreateNewInstance();

  SearchString: string = '';
  ModalOpen: boolean = false;
  selectedStatus: number = 0;
  isLoading: boolean = false;
  companyRef: number = 0;
  selectedFilters: any[] = [];
  CustomerStatusList = DomainEnums.CustomerStatusList();

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
    private appStateManagement: AppStateManageService,
    private filterService: FilterService
  ) { }

  ngOnInit(): void {
    this.loadCRMIfCompanyExists();
  }

  ionViewWillEnter = async () => {
    await this.loadCRMIfCompanyExists();
  };

  async handleRefresh(event: CustomEvent): Promise<void> {
    await this.loadCRMIfCompanyExists();
    await this.filterCustomerList();
    (event.target as HTMLIonRefresherElement).complete();
  }

  private async loadCRMIfCompanyExists(): Promise<void> {
    this.companyRef = Number(this.appStateManagement.StorageKey.getItem('SelectedCompanyRef'));
    if (this.companyRef <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    await this.getCustomerEnquiryListByCompanyRef();
  }

  async getCustomerEnquiryListByCompanyRef() {
    try {
      this.CustomerEnquiryList = [];
      this.FilteredCustomerEnquiryList = [];
      this.isLoading = true;
      if (this.companyRef <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }
      let lst = await CustomerEnquiry.FetchEntireListByCompanyRef(
        this.companyRef,
        async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
      );
      this.CustomerEnquiryList = lst;
      this.CustomerEnquiryList.forEach(e => e.p.CustomerFollowUps.push(CustomerFollowUpProps.Blank()))
      this.FilteredCustomerEnquiryList = this.CustomerEnquiryList;
      console.log('FilteredCustomerEnquiryList :', this.FilteredCustomerEnquiryList);
      this.filterCustomerList();
    } catch (error: any) {
      await this.uiUtils.showErrorMessage('Unexpected Error', error?.message || 'Something went wrong');
    } finally {
      this.isLoading = false;
    }
  }

  filterCustomerList() {
    if (this.selectedStatus === 0) {
      this.FilteredCustomerEnquiryList = this.CustomerEnquiryList;
    } else {
      this.FilteredCustomerEnquiryList = this.CustomerEnquiryList.filter(
        (customer) => customer.p.CustomerStatus === this.selectedStatus
      );
    }
  }

  onEditClicked = async (item: CustomerEnquiry) => {
    try {
      item.p.CustomerFollowUps = [CustomerFollowUpProps.Blank()];
      this.SelectedCustomerEnquiry = item.GetEditableVersion();
      CustomerEnquiry.SetCurrentInstance(this.SelectedCustomerEnquiry);
      this.appStateManagement.StorageKey.setItem('Editable', 'Edit');
      this.router.navigate(['mobileapp/tabs/dashboard/customer-relationship-management/customer-enquiry/edit']);
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
      if (this.companyRef <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }
      this.router.navigate(['mobileapp/tabs/dashboard/customer-relationship-management/customer-enquiry/add']);
    } catch (error: any) {
      await this.uiUtils.showErrorMessage('Error', error?.message || 'Failed to open the add form.');
    }
  }

  formatData = (list: any[]) => {
    return list.map(item => ({
      Ref: item.p.Ref,
      Name: item.p.Name
    }));
  };

  openFilterSheet = async () => {
    const filterData = {
      categories: [
        {
          Name: 'Customer Status',
          Ref: 100,
          multi: false,
          date: false,
          dependUponRef: 0,
          options: this.CustomerStatusList
        }
      ]
    };
    try {
      const res = await this.filterService.openFilter(filterData, this.selectedFilters);
      console.log('res :', res);

      if (res.selected && res.selected.length > 0) {
        this.selectedFilters = res.selected;

        for (const filter of this.selectedFilters) {

          switch (filter.category.Ref) {
            case 100:
              this.selectedStatus = filter.selectedOptions[0].Ref;
              break;
          }
        }
        this.filterCustomerList();
      } else {
        this.selectedStatus = 0;
        this.filterCustomerList();
      }
    } catch (error) {
      console.error('Error in filter selection:', error);
    }
  };
}
