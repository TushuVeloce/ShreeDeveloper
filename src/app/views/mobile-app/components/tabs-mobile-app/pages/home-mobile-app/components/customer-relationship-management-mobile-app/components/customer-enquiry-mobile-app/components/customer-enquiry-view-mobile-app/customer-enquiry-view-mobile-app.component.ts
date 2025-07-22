import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerStatus, DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { CustomerEnquiry } from 'src/app/classes/domain/entities/website/customer_management/customerenquiry/customerenquiry';
import { CustomerFollowUpProps } from 'src/app/classes/domain/entities/website/customer_management/customerfollowup/customerfollowup';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { FilterService } from 'src/app/services/filter.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { FilterItem } from 'src/app/views/mobile-app/components/shared/chip-filter-mobile-app/chip-filter-mobile-app.component';

@Component({
  selector: 'app-customer-enquiry-view-mobile-app',
  templateUrl: './customer-enquiry-view-mobile-app.component.html',
  styleUrls: ['./customer-enquiry-view-mobile-app.component.scss'],
  standalone: false
})
export class CustomerEnquiryViewMobileAppComponent implements OnInit {
  Entity: CustomerEnquiry = CustomerEnquiry.CreateNewInstance();
  CustomerEnquiryList: CustomerEnquiry[] = [];
  FilteredCustomerEnquiryList: CustomerEnquiry[] = [];
  SelectedCustomerEnquiry: CustomerEnquiry = CustomerEnquiry.CreateNewInstance();

  SearchString: string = '';
  ModalOpen: boolean = false;
  selectedStatus: number = 0;
  // isLoading: boolean = false;
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
  filters: FilterItem[] = [];
  // Store current selected values here to preserve selections on filter reload
  selectedFilterValues: Record<string, any> = {};


  constructor(
    // private uiUtils: UIUtils,
    private router: Router,
    private appStateManagement: AppStateManageService,
    private filterService: FilterService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    public loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    // this.loadCRMIfCompanyExists();
  }

  ionViewWillEnter = async () => {
    await this.loadCRMIfCompanyExists();
    await this.loadFilters();
  };

  async handleRefresh(event: CustomEvent): Promise<void> {
    await this.loadCRMIfCompanyExists();
    // await this.filterCustomerList();
    await this.loadFilters();
    (event.target as HTMLIonRefresherElement).complete();
  }

  loadFilters() {
    this.filters = [
      {
        key: 'status',
        label: 'Status',
        multi: false,
        options: this.CustomerStatusList.map(item => ({
          Ref: item.Ref,
          Name: item.Name,
        })),
        selected: this.selectedFilterValues['status'] > 0 ? this.selectedFilterValues['status'] : null,
      }
    ];
  }

  async onFiltersChanged(updatedFilters: any[]) {
    // debugger
    console.log('Updated Filters:', updatedFilters);

    for (const filter of updatedFilters) {
      const selected = filter.selected;
      const selectedValue = (selected === null || selected === undefined) ? null : selected;

      // Save selected value to preserve after reload
      this.selectedFilterValues[filter.key] = selectedValue ?? null;

      switch (filter.key) {
        case 'status':
          this.selectedStatus = selectedValue ?? 0;
          break;
      }
    }
    await this.filterCustomerList();
    this.loadFilters(); // Reload filters with updated options & preserve selections
  }
  private async loadCRMIfCompanyExists(): Promise<void> {
    this.companyRef = Number(this.appStateManagement.localStorage.getItem('SelectedCompanyRef'));
    if (this.companyRef <= 0) {
       await this.toastService.present('company not selected', 1000, 'danger');
        await this.haptic.error();
      return;
    }
    await this.getCustomerEnquiryListByCompanyRef();
  }

  async getCustomerEnquiryListByCompanyRef() {
    try {
      this.CustomerEnquiryList = [];
      this.FilteredCustomerEnquiryList = [];
      // this.isLoading = true;
      await this.loadingService.show();
      if (this.companyRef <= 0) {
         await this.toastService.present('company not selected', 1000, 'danger');
        await this.haptic.error();
        return;
      }
      let lst = await CustomerEnquiry.FetchEntireListByCompanyRef(
        this.companyRef,
        async (errMsg) =>{
          //  await this.uiUtils.showErrorMessage('Error', errMsg)
          await this.toastService.present('Error'+errMsg, 1000, 'danger');
          await this.haptic.error();
          }
      );
      this.CustomerEnquiryList = lst;
      this.CustomerEnquiryList.forEach(e => e.p.CustomerFollowUps.push(CustomerFollowUpProps.Blank()))
      this.FilteredCustomerEnquiryList = this.CustomerEnquiryList;
      console.log('FilteredCustomerEnquiryList :', this.FilteredCustomerEnquiryList);
      this.filterCustomerList();
    } catch (error: any) {
      // await this.uiUtils.showErrorMessage('Unexpected Error', error?.message || 'Something went wrong');
    } finally {
      // this.isLoading = false;
      await this.loadingService.hide();
    }
  }

  filterCustomerList() {
    console.log('this.selectedStatus :', this.selectedStatus);
    if (this.selectedStatus === 0) {
      this.FilteredCustomerEnquiryList = this.CustomerEnquiryList;
    } else {
      this.FilteredCustomerEnquiryList = this.CustomerEnquiryList.filter(
        (customer) => customer.p.CustomerStatus === this.selectedStatus
      );
      console.log('this.FilteredCustomerEnquiryList :', this.FilteredCustomerEnquiryList);
    }
  }

  onEditClicked = async (item: CustomerEnquiry) => {
    try {
      item.p.CustomerFollowUps = [CustomerFollowUpProps.Blank()];
      this.SelectedCustomerEnquiry = item.GetEditableVersion();
      CustomerEnquiry.SetCurrentInstance(this.SelectedCustomerEnquiry);
      this.appStateManagement.StorageKey.setItem('Editable', 'Edit');
      this.router.navigate(['mobile-app/tabs/dashboard/customer-relationship-management/customer-enquiry/edit']);
    } catch (error: any) {
      // await this.uiUtils.showErrorMessage('Error', error?.message || 'Could not open edit form.');
    }
  };

  onDeleteClicked = async (item: CustomerEnquiry) => {
    try {
      // await this.uiUtils.showConfirmationMessage(
      //   'Delete',
      //   `This process is <strong>IRREVERSIBLE!</strong><br/>Are you sure that you want to DELETE this Customer Enquiry?`,
      //   async () => {
      //     try {
      //       await item.DeleteInstance(async () => {
      //         await this.uiUtils.showSuccessToster(`Customer Enquiry ${item.p.Name} has been deleted!`);
      //         await this.getCustomerEnquiryListByCompanyRef();
      //       });
      //     } catch (deleteError: any) {
      //       await this.uiUtils.showErrorMessage('Delete Failed', deleteError?.message || 'Could not delete.');
      //     }
      //   }
      // );
      this.alertService.presentDynamicAlert({
        header: 'Delete',
        subHeader: 'Confirmation needed',
        message: 'Are you sure you want to delete this Customer Enquiry?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'custom-cancel',
            handler: () => {
              console.log('Deletion cancelled.');
            }
          },
          {
            text: 'Yes, Delete',
            cssClass: 'custom-confirm',
            handler: async () => {
              try {
                await item.DeleteInstance(async () => {
                  await this.toastService.present(
                    `Customer Enquiry ${item.p.Name} has been deleted!`,
                    1000,
                    'success'
                  );
                  await this.haptic.success();
                });
                await this.getCustomerEnquiryListByCompanyRef();
              } catch (err) {
                console.error('Error deleting Customer Enquiry:', err);
                await this.toastService.present('Failed to delete Customer Enquiry', 1000, 'danger');
                await this.haptic.error();
              }
            }
          }
        ]
      });
    } catch (error: any) {
      // await this.uiUtils.showErrorMessage('Error', error?.message || 'Something went wrong.');
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
         await this.toastService.present('company not selected', 1000, 'danger');
        await this.haptic.error();
        return;
      }
      this.router.navigate(['mobile-app/tabs/dashboard/customer-relationship-management/customer-enquiry/add']);
    } catch (error: any) {
      // await this.uiUtils.showErrorMessage('Error', error?.message || 'Failed to open the add form.');
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
      // console.error('Error in filter selection:', error);
    }
  };
}
