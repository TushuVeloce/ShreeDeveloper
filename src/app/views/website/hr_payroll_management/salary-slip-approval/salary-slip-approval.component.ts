import { Component, effect, OnInit } from '@angular/core';
import { SalarySlipRequest } from 'src/app/classes/domain/entities/website/request/salarysliprequest/salarysliprequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-salary-slip-approval',
  standalone: false,
  templateUrl: './salary-slip-approval.component.html',
  styleUrls: ['./salary-slip-approval.component.scss'],

})

export class SalarySlipApprovalComponent implements OnInit {
  Entity: SalarySlipRequest = SalarySlipRequest.CreateNewInstance();
  MasterList: SalarySlipRequest[] = [];
  DisplayMasterList: SalarySlipRequest[] = [];
  SearchString: string = '';
  SelectedSalarySlipApproval: SalarySlipRequest = SalarySlipRequest.CreateNewInstance();
  CustomerRef: number = 0;
  isSaveDisabled: boolean = false;
  EmployeeList: Employee[] = [];
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Employee', 'Year', 'Month', 'Approval Status'];

  constructor(
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement,
    private utils: Utils,
  ) {
    effect(async () => {
      await this.getEmployeeListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.getSalarySlipApprovalListByCompanyRef();
    this.pageSize = this.screenSizeService.getPageSize('withDropdown');
  }

  getEmployeeListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Employee.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.EmployeeList = lst;
  }

  getSalarySlipApprovalListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await SalarySlipRequest.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;

    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  getSalarySlipApprovalListByEmployeeRef = async () => {
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


  handleApproval = async (salaryslipapproval: SalarySlipRequest) => {
    await this.uiUtils.showConfirmationMessage(
      'Approval',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
      Are you sure that you want to Approve this Salary Slip?`,
      async () => {
        this.Entity = salaryslipapproval;
        this.Entity.p.IsApproved = 1;
        let entityToSave = this.Entity.GetEditableVersion();
        // let entityToSave = Object.assign(SalarySlipRequest.CreateNewInstance(),
        //   this.utils.DeepCopy(this.Entity)) as SalarySlipRequest;

        let entitiesToSave = [entityToSave];
        let tr = await this.utils.SavePersistableEntities(entitiesToSave);

        if (!tr.Successful) {
          this.isSaveDisabled = false;
          this.uiUtils.showErrorMessage('Error', tr.Message);
          return;
        } else {
          this.isSaveDisabled = false;
          await this.uiUtils.showSuccessToster('Leave Approval Successfully Approved');
          this.getSalarySlipApprovalListByEmployeeRef();
        }
      }
    );
  }

  onDeleteClicked = async (salaryslipapproval: SalarySlipRequest) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
    Are you sure that you want to DELETE this Salary Slip Approval?`,
      async () => {
        await salaryslipapproval.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Salary Slip Approval ${salaryslipapproval.p.EmployeeName} has been deleted!`
          );
          await this.getSalarySlipApprovalListByEmployeeRef();
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

  filterTable = () => {
    if (this.SearchString != '') {
      this.DisplayMasterList = this.MasterList.filter((data: any) => {
        return data.p.Year.indexOf(this.SearchString) > -1
      })
    }
    else {
      this.DisplayMasterList = this.MasterList
    }
  }
}
