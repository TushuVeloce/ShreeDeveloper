import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

   pageSize = 10; // Items per page
    currentPage = 1; // Initialize current page
    total = 0;
    SearchString: string = '';
  
    companyRef = this.companystatemanagement.SelectedCompanyRef;
    
    headers: string[] = ['Sr.No.','Name','Contact No', 'Date', 'Customer Status','Action'];
    constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
      private companystatemanagement: CompanyStateManagement
    ) {
      effect(() => {
            this.getCustomerEnquiryListByCompanyRef();
      });
    }
  
    
    async ngOnInit() {
      this.appStateManage.setDropdownDisabled(false);
      this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
    }
  
    getCustomerEnquiryListByCompanyRef = async () => {
  
    }
  
  
    onPageChange = (pageIndex: number): void => {
      this.currentPage = pageIndex; // Update the current page
    };
  
    async AddCustomerFollowUpForm() {
      if (this.companyRef() <= 0) {
        this.uiUtils.showErrorToster('Company not Selected');
        return;
      }
      this.router.navigate(['/homepage/Website/Customer_FollowUp_Details']);
    }
  
    filterTable = () => {
      
    }
  

}
