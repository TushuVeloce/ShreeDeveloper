import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyHolidays } from 'src/app/classes/domain/entities/website/HR_and_Payroll/company_holidays/companyholidays';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-company-holidays',
  standalone: false,
  templateUrl: './company-holidays.component.html',
  styleUrls: ['./company-holidays.component.scss'],
})
export class CompanyHolidaysComponent implements OnInit {
  Entity: CompanyHolidays = CompanyHolidays.CreateNewInstance();
  MasterList: CompanyHolidays[] = [];
  DisplayMasterList: CompanyHolidays[] = [];
  SearchString: string = '';
  SelectedTime: CompanyHolidays = CompanyHolidays.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Date', 'Reason', 'Action'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement, private DateconversionService: DateconversionService,
  ) {
    effect(async () => {
      await this.getCompanyHolidaysListByCompanyRef();
    });
  }
  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  getCompanyHolidaysListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await CompanyHolidays.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  onEditClicked = async (item: CompanyHolidays) => {
    this.SelectedTime = item.GetEditableVersion();
    CompanyHolidays.SetCurrentInstance(this.SelectedTime);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Company_Holidays_Details']);
  };

  onDeleteClicked = async (CompanyHolidays: CompanyHolidays) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
      Are you sure that you want to DELETE this Overtime?`,
      async () => {
        await CompanyHolidays.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(`${CompanyHolidays.p.Date} has been deleted!`);
          await this.getCompanyHolidaysListByCompanyRef();
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

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

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

  AddCompanyHoliday = async () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    }
    this.router.navigate(['/homepage/Website/Company_Holidays_Details']);
  }
}

