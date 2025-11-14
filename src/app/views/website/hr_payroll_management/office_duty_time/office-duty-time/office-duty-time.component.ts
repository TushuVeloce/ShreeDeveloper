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
export class OfficeDutyTimeComponent implements OnInit {
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

  headers: string[] = ['Working Time From', 'Working Time To', 'Late Mark Grace Time', 'Action'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement
  ) {
    effect(async () => {
      await this.getOfficeDutyandTimeListByCompanyRef();
    });
  }
  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  getFormattedTime(time: string): string {
    if (!time) return '';

    const date = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    date.setHours(hours, minutes);

    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: this.isSystemUsing12HourFormat()
    };

    return date.toLocaleTimeString([], options);
  }

  isSystemUsing12HourFormat(): boolean {
    const format = new Intl.DateTimeFormat([], { hour: 'numeric' }).format(new Date(2020, 0, 1, 13));
    return format.includes('PM') || format.includes('pm');
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

  // 🔑 Whenever filteredList event is received
  onFilteredList(list: any[]) {
    this.DisplayMasterList = list;
    this.currentPage = 1;   // reset to first page after filtering

    this.loadPaginationData();
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };

  AddOfficeTime = async () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    }
    this.router.navigate(['/homepage/Website/Office_Duty_Time_Details']);
  }
}
