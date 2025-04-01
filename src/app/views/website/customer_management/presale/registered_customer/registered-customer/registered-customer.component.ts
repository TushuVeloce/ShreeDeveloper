import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisteredCustomer } from 'src/app/classes/domain/entities/website/customer_management/registeredcustomer/registeredcustomer';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { Utils } from 'src/app/services/utils.service';
import { CustomProcessProps } from 'src/app/classes/domain/entities/website/customer_management/registeredcustomer/Custom Process/customprocess';
import { CustomProcessFetchRequest } from 'src/app/classes/domain/entities/website/customer_management/registeredcustomer/Custom Process/customprocessfetchrequest';


@Component({
  selector: 'app-registered-customer',
  standalone: false,
  templateUrl: './registered-customer.component.html',
  styleUrls: ['./registered-customer.component.scss'],
})
export class RegisteredCustomerComponent  implements OnInit {

  Entity: RegisteredCustomer = RegisteredCustomer.CreateNewInstance();
  MasterList: RegisteredCustomer[] = [];
  DisplayMasterList: RegisteredCustomer[] = [];
  // SearchString: string = '';
  SelectedRegisteredCustomer: RegisteredCustomer = RegisteredCustomer.CreateNewInstance();
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  RegisterCustomerList: any[] = [];  // ✅ Correct

  headers: string[] = [
    'Sr.No.',
    'Site Name',
    'Plot No',
    'Customer Name',
    'Mobile No',
    'Address',
    'Action',
  ];  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement, private payloadPacketFacade: PayloadPacketFacade,
        private serverCommunicator: ServerCommunicatorService
  ) { 
    effect(() => {
      this.getRegisterCustomerListByCompanyRef()
    });
  }


  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(false);
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  getRegisterCustomerListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    console.log('companyRef :', this.companyRef());
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await RegisteredCustomer.FetchEntireListByCompanyRef(this.companyRef(), async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
    console.log('lst :', lst);
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.RegisterCustomerList = lst
    console.log('RegisterCustomerList :',this. RegisterCustomerList[0].p);
    this.loadPaginationData();    
  };

  

  onEditClicked = async (item: RegisteredCustomer) => {

    this.SelectedRegisteredCustomer = item.GetEditableVersion();
    RegisteredCustomer.SetCurrentInstance(this.SelectedRegisteredCustomer);

    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Registered_Customer_Details']);
  };

  Cancel = async () => {
    let confirm = await this.uiUtils.showConfirmationMessage('Confirmation','Are you sure you want to cancel this process?',
      async () => {
        let req = new CustomProcessFetchRequest();   
        let td = req.FormulateTransportData();
        let pkt = this.payloadPacketFacade.CreateNewPayloadPacket2(td);
        let tr = await this.serverCommunicator.sendHttpRequest(pkt);
    
        if (!tr.Successful) {
          await this.uiUtils.showErrorMessage('Error', tr.Message);
          return;
        }
    
        let tdResult = JSON.parse(tr.Tag) as TransportData;
        console.log('tdResult :', tdResult);
        // this.Entity = tdResult
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


  // filterTable = () => {
  //   if (this.SearchString != '') {
  //     this.DisplayMasterList = this.MasterList.filter((data: any) => {
  //       return data.p.Name.toLowerCase().indexOf(this.SearchString.toLowerCase()) > -1
  //     })
  //   }
  //   else {
  //     this.DisplayMasterList = this.MasterList
  //   }
  // }

  async AddRegisteredCustomer() {
    await this.router.navigate(['/homepage/Website/Registered_Customer_Details']);
  }

}
