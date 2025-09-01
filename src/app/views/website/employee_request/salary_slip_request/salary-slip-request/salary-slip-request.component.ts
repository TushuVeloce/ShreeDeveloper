import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SalarySlipRequest } from 'src/app/classes/domain/entities/website/request/salarysliprequest/salarysliprequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';

@Component({
  selector: 'app-salarysliprequest-master',
  standalone: false,
  templateUrl: './salary-slip-request.component.html',
  styleUrls: ['./salary-slip-request.component.scss'],

})

export class SalarySlipRequestComponent implements OnInit {
  Entity: SalarySlipRequest = SalarySlipRequest.CreateNewInstance();
  MasterList: SalarySlipRequest[] = [];
  DisplayMasterList: SalarySlipRequest[] = [];
  SearchString: string = '';
  SelectedSalarySlipRequest: SalarySlipRequest = SalarySlipRequest.CreateNewInstance();
  CustomerRef: number = 0;
  EmployeeList: Employee[] = [];
  MonthList = DomainEnums.MonthList(true, '--Select Month Type--');
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Year', 'Months', 'Approval Status', 'Action'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement
  ) {
    effect(async () => {
      await this.getSalarySlipRequestListByEmployeeRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.Entity.p.EmployeeRef = this.appStateManage.getEmployeeRef();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  getMonthName(): string {
    return this.MonthList[1].Name;
  }

  getSalarySlipRequestListByEmployeeRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.Entity.p.EmployeeRef <= 0) {
      await this.uiUtils.showErrorToster('Employee not Selected');
      return;
    }
    let lst = await SalarySlipRequest.FetchEntireListByEmployeeRef(this.Entity.p.EmployeeRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;

    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  onDeleteClicked = async (salarysliprequest: SalarySlipRequest) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
    Are you sure that you want to DELETE this Salary Slip Request?`,
      async () => {
        await salarysliprequest.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Salary Slip Request ${salarysliprequest.p.EmployeeName} has been deleted!`
          );
          await this.getSalarySlipRequestListByEmployeeRef();
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

  AddSalarySlipRequest = () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    }
    this.router.navigate(['/homepage/Website/Salary_Slip_Request_Details']);
  }
}
