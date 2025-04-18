import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerEnquiry } from 'src/app/classes/domain/entities/website/customer_management/customerenquiry/customerenquiry';
import { CustomerFollowUpProps } from 'src/app/classes/domain/entities/website/customer_management/customerfollowup/customerfollowup';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
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
  SearchString: string = '';
  SelectedCustomerEnquiry: CustomerEnquiry = CustomerEnquiry.CreateNewInstance();
  CustomerRef: number = 0;

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  ModalOpen = false;
  selectedItem: any = [];

  // customerList = [
  //   {
  //     date: '2024-04-14',
  //     name: 'John Doe',
  //     contact: '9876543210',
  //     status: 'Active',
  //     siteName: 'Skyline Villas',
  //     plotNo: 'A-12',
  //   },
  //   {
  //     date: '2024-04-13',
  //     name: 'Jane Smith',
  //     contact: '8765432109',
  //     status: 'Inactive',
  //     siteName: 'Green Heights',
  //     plotNo: 'B-7',
  //   }
  // ];

  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private appStateManage: AppStateManageService,
    private companystatemanagement: CompanyStateManagement
  ) {
    effect(() => {
      this.getCustomerEnquiryListByCompanyRef();
    });
  }

  ngOnInit() { }


  getCustomerEnquiryListByCompanyRef = async () => {
    this.CustomerEnquiryList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await CustomerEnquiry.FetchEntireListByCompanyRef(
      this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.CustomerEnquiryList = lst;
    this.CustomerEnquiryList.forEach(e => e.p.CustomerFollowUps.push(CustomerFollowUpProps.Blank()))
    this.FilteredCustomerEnquiryList = this.CustomerEnquiryList;
  };

  onEditClicked = async (item: CustomerEnquiry) => {
    item.p.CustomerFollowUps = [];
    item.p.CustomerFollowUps.push(CustomerFollowUpProps.Blank())

    this.SelectedCustomerEnquiry = item.GetEditableVersion();

    CustomerEnquiry.SetCurrentInstance(this.SelectedCustomerEnquiry);

    this.appStateManage.StorageKey.setItem('Editable', 'Edit');

    this.router.navigate(['/app_homepage/tabs/crm/customer-enquiry/edit']);
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
        });
      }
    );
  };
  onViewClicked = async (customerenquiry: CustomerEnquiry) => {
    console.log('Viewing', customerenquiry);
    this.SelectedCustomerEnquiry = customerenquiry;
    this.openModal();
  };

  async AddCustomerEnquiryForm() {
    if (this.companyRef() <= 0) {
      this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.router.navigate(['/app_homepage/tabs/crm/customer-enquiry/add']);
  }
  // Open Modal
  openModal = () => {
    this.ModalOpen = true;
  }

  // Close Modal
  ModelClose = () => {
    this.ModalOpen = false;
  }

  // Handle View Action
  // onViewClicked(item: any) {
  //   console.log('Viewing', item);
  //   this.selectedItem = item;
  //   this.openModal();
  // }


  // Handle Edit
  // onEdit(item: any) {
  //   console.log('Editing', item);
  //   this.router.navigate(['/app_homepage/tabs/crm/customer-enquiry/edit', item.plotNo]);
  // }

  // Handle Delete
  // onDelete(item: any) {
  //   console.log('Deleting', item);
  //   // Add actual delete logic here
  // }

  // Navigate to Add Page
  // NavigateToRgbPicker() {
  //   this.router.navigate(['/app_homepage/tabs/crm/customer-enquiry/smart-light']);
  // }

  // Example filter action
  filterCustomerList() {
    console.log('Filtering customers...');
    // You can later implement actual filters here
  }

}
