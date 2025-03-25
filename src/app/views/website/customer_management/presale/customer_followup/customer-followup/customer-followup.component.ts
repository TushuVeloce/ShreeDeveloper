import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerEnquiry } from 'src/app/classes/domain/entities/website/customer_management/customerenquiry/customerenquiry';
import { CustomerFollowUp } from 'src/app/classes/domain/entities/website/customer_management/customerfollowup/customerfollowup';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';


@Component({
  selector: 'app-customer-followup',
  templateUrl: './customer-followup.component.html',
  styleUrls: ['./customer-followup.component.scss'],
  standalone: false
})
export class CustomerFollowupComponent  implements OnInit {

    Entity: CustomerEnquiry = CustomerEnquiry.CreateNewInstance();
    MasterList: CustomerEnquiry[] = [];
    DisplayMasterList: CustomerEnquiry[] = [];
    SearchString: string = '';
    SelectedFollowUp: CustomerEnquiry = CustomerEnquiry.CreateNewInstance();
    CustomerRef: number = 0;
    pageSize = 10; // Items per page
    currentPage = 1; // Initialize current page
    total = 0;
    companyRef = this.companystatemanagement.SelectedCompanyRef;
    
    headers: string[] = ['Sr.No.','Site Name','Customer Name','Mobile No','Plot No', 'Last Contact Date', 'Reason for Last Contact','Action'];
    constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
      private companystatemanagement: CompanyStateManagement
    ) {}
  
    
    async ngOnInit() {
      this.appStateManage.setDropdownDisabled(false);
      await this.getCustomerFollowUpList();
      // this.DisplayMasterList = [];
      this.loadPaginationData();
      this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
    }
  
     getCustomerFollowUpList = async () => {
        this.MasterList = [];
        this.DisplayMasterList = [];
        if (this.companyRef() <= 0) {
          await this.uiUtils.showErrorToster('Company not Selected');
          return;
        }
        let lst = await CustomerEnquiry.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
        this.MasterList = lst;    
        this.DisplayMasterList = this.MasterList;
        this.loadPaginationData();
      }
      
      onEditClicked = async (item: CustomerEnquiry) => {
        this.SelectedFollowUp = item.GetEditableVersion();
        CustomerEnquiry.SetCurrentInstance(this.SelectedFollowUp);
        this.appStateManage.StorageKey.setItem('Editable', 'Edit');
        await this.router.navigate(['/homepage/Website/Customer_FollowUp_Details']);
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

     async add(){
      await this.router.navigate(['/homepage/Website/Customer_FollowUp_Details']);
      }
    }
    