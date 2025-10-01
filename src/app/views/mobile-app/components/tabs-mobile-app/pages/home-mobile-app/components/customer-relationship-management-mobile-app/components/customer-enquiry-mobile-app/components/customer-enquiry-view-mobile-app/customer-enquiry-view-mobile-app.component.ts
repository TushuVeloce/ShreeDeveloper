import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerStatus, DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { CustomerEnquiry } from 'src/app/classes/domain/entities/website/customer_management/customerenquiry/customerenquiry';
import { CustomerFollowUpProps } from 'src/app/classes/domain/entities/website/customer_management/customerfollowup/customerfollowup';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { FilterService } from 'src/app/services/filter.service';
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
    private router: Router,
    private appStateManagement: AppStateManageService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    public loadingService: LoadingService,
    private DateconversionService: DateconversionService,
  ) { }

  ngOnInit = (): void => {
    // this.loadCRMIfCompanyExists();
  }

  ionViewWillEnter = async () => {
    await this.loadCRMIfCompanyExists();
    this.loadFilters();
  };

  handleRefresh = async (event: CustomEvent): Promise<void> => {
    await this.loadCRMIfCompanyExists();
    this.loadFilters();
    (event.target as HTMLIonRefresherElement).complete();
  }

  loadFilters = () => {
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

  onFiltersChanged = async (updatedFilters: any[]) => {
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
    this.filterCustomerList();
    this.loadFilters(); // Reload filters with updated options & preserve selections
  }
  private loadCRMIfCompanyExists = async (): Promise<void> => {
    this.companyRef = Number(this.appStateManagement.localStorage.getItem('SelectedCompanyRef'));
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    await this.getCustomerEnquiryListByCompanyRef();
  }

  getCustomerEnquiryListByCompanyRef = async () => {
    try {
      this.CustomerEnquiryList = [];
      this.FilteredCustomerEnquiryList = [];
      await this.loadingService.show();
      if (this.companyRef <= 0) {
        await this.toastService.present('company not selected', 1000, 'danger');
        await this.haptic.error();
        return;
      }
      let lst = await CustomerEnquiry.FetchEntireListByCompanyRef(
        this.companyRef,
        async (errMsg) => {
          await this.toastService.present(errMsg, 1000, 'danger');
          await this.haptic.error();
        }
      );
      this.CustomerEnquiryList = lst;
      this.CustomerEnquiryList.forEach(e => e.p.CustomerFollowUps.push(CustomerFollowUpProps.Blank()))
      this.FilteredCustomerEnquiryList = this.CustomerEnquiryList;
      this.filterCustomerList();
    } catch (error: any) {
    } finally {
      await this.loadingService.hide();
    }
  }

  filterCustomerList = () => {
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
      this.router.navigate(['mobile-app/tabs/dashboard/customer-relationship-management/customer-enquiry/edit']);
    } catch (error: any) {
    }
  };

  onDeleteClicked = async (item: CustomerEnquiry) => {
    try {
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
                });
                await this.getCustomerEnquiryListByCompanyRef();
              } catch (err) {
              }
            }
          }
        ]
      });
    } catch (error: any) {
    }
  };

  onViewClicked = async (item: CustomerEnquiry) => {
    this.SelectedCustomerEnquiry = item;
    this.ModalOpen = true;
  }

  closeModal = () => {
    this.ModalOpen = false;
  }

  AddCustomerEnquiryForm = async () => {
    try {
      if (this.companyRef <= 0) {
        await this.toastService.present('company not selected', 1000, 'danger');
        await this.haptic.error();
        return;
      }
      this.router.navigate(['mobile-app/tabs/dashboard/customer-relationship-management/customer-enquiry/add']);
    } catch (error: any) {
    }
  }

  formatData = (list: any[]) => {
    return list.map(item => ({
      Ref: item.p.Ref,
      Name: item.p.Name
    }));
  };

  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

}
