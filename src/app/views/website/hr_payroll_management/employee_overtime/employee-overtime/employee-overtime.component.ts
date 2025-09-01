import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeOvertime } from 'src/app/classes/domain/entities/website/HR_and_Payroll/Employee_Overtime/employeeovertime';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-employee-overtime',
  standalone: false,
  templateUrl: './employee-overtime.component.html',
  styleUrls: ['./employee-overtime.component.scss'],
})
export class EmployeeOvertimeComponent implements OnInit {
  Entity: EmployeeOvertime = EmployeeOvertime.CreateNewInstance();
  MasterList: EmployeeOvertime[] = [];
  DisplayMasterList: EmployeeOvertime[] = [];
  SearchString: string = '';
  SelectedTime: EmployeeOvertime = EmployeeOvertime.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Date', 'Employee Name', 'From Time', 'To Time', 'Total Over Time', 'Status', 'Action'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement, private utils: Utils, private DateconversionService: DateconversionService,
  ) {
    effect(async () => {
      await this.getEmployeeOvertimeListByCompanyRef();
    });
  }
  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  getEmployeeOvertimeListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await EmployeeOvertime.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  convertTo12Hour = (time24: string): string => {
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;
    hour = hour === 0 ? 12 : hour; // Handle midnight (0 -> 12 AM) and noon (12 -> 12 PM)

    return `${hour}:${minute} ${ampm}`;
  }

  onEditClicked = async (item: EmployeeOvertime) => {
    this.SelectedTime = item.GetEditableVersion();
    EmployeeOvertime.SetCurrentInstance(this.SelectedTime);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Employee_Overtime_Details']);
  };

  ChangeOvertimeStatus = async (Entity: EmployeeOvertime) => {
    await this.uiUtils.showConfirmationMessage(
      'Approval',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
        Are you sure that you want to Approve this Overtime?`,
      async () => {
        this.Entity = Entity;
        this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
        this.Entity.p.IsOverTimeVerified = true;
        let entityToSave = this.Entity.GetEditableVersion();
        let entitiesToSave = [entityToSave]
        let tr = await this.utils.SavePersistableEntities(entitiesToSave);
        if (!tr.Successful) {
          this.uiUtils.showErrorMessage('Error', tr.Message);
          Entity.p.IsOverTimeVerified = false;
          return
        }
        else {
          await this.uiUtils.showSuccessToster('Attendance Updated successfully');
        }
      }
    );
  }

  onDeleteClicked = async (EmployeeOvertime: EmployeeOvertime) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
      Are you sure that you want to DELETE this Overtime?`,
      async () => {
        await EmployeeOvertime.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(`${EmployeeOvertime.p.EmployeeRef} has been deleted!`);
          await this.getEmployeeOvertimeListByCompanyRef();
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

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };

  AddEmployeeOvertime = async () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    }
    this.router.navigate(['/homepage/Website/Employee_Overtime_Details']);
  }
}
