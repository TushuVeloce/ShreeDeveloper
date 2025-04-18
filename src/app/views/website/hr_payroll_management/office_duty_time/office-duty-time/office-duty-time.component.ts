import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OfficeDutyandTime } from 'src/app/classes/domain/entities/website/HR_and_Payroll/Office_Duty_and_Time/officedutyandtime';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-office-duty-time',
  templateUrl: './office-duty-time.component.html',
  styleUrls: ['./office-duty-time.component.scss'],
  standalone: false,
})
export class OfficeDutyTimeComponent  implements OnInit {
  Entity: OfficeDutyandTime = OfficeDutyandTime.CreateNewInstance();
  MasterList: OfficeDutyandTime[] = [];
  DisplayMasterList: OfficeDutyandTime[] = [];
  SearchString: string = '';
  SelectedTime: OfficeDutyandTime = OfficeDutyandTime.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Working Time From', 'Working Time To', 'Late Mark Grace Time','Over Time Grace Time','Action'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement
  ) {
    effect(async () => {
      await this.getOfficeDutyandTimeListByCompanyRef();
    });
  }
  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(false);
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }
  
  getFormattedTime(time24: string): string {
    if (!time24) return '';
  
    // Check if the system uses 12-hour format
    const is12HourFormat = new Intl.DateTimeFormat(undefined, {
      hour: 'numeric'
    }).formatToParts(new Date()).some(part => part.type === 'dayPeriod');
  
    if (!is12HourFormat) {
      // If system uses 24-hour format, return the original time
      return time24;
    }
  
    // Convert to 12-hour format
    const [hourStr, minuteStr] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
  
    return `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  }
  

   getOfficeDutyandTimeListByCompanyRef = async () => {
      this.MasterList = [];
      this.DisplayMasterList = [];
      if (this.companyRef() <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }
      let lst = await OfficeDutyandTime.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.MasterList = lst;
      console.log(lst);


      this.DisplayMasterList = this.MasterList;
      this.loadPaginationData();
    }

    onEditClicked = async (item: OfficeDutyandTime) => {
      this.SelectedTime = item.GetEditableVersion();
      OfficeDutyandTime.SetCurrentInstance(this.SelectedTime);
      this.appStateManage.StorageKey.setItem('Editable', 'Edit');
      await this.router.navigate(['/homepage/Website/Office_Duty_Time_Details']);
    };

    onDeleteClicked = async (OfficeDutyandTime: OfficeDutyandTime) => {
      await this.uiUtils.showConfirmationMessage(
        'Delete',
        `This process is <strong>IRREVERSIBLE!</strong> <br/>
      Are you sure that you want to DELETE this Office Duty and Time?`,
        async () => {
          await OfficeDutyandTime.DeleteInstance(async () => {
            await this.uiUtils.showSuccessToster(
              `${OfficeDutyandTime.p.FromTime} to ${OfficeDutyandTime.p.ToTime} has been deleted!`
            );
            await this.getOfficeDutyandTimeListByCompanyRef();
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

    paginatedList = () => {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.DisplayMasterList.slice(start, start + this.pageSize);
    }

    onPageChange = (pageIndex: number): void => {
      this.currentPage = pageIndex; // Update the current page
    };

   AddOfficeTime = async() => {
    this.router.navigate(['/homepage/Website/Office_Duty_Time_Details']);
  }

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

}
