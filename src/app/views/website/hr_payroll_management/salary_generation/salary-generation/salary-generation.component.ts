import {
  Component,
  effect,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Company } from 'src/app/classes/domain/entities/website/masters/company/company';
import {
  SalaryGeneration,
  SalaryGenerationProps,
} from 'src/app/classes/domain/entities/website/HR_and_Payroll/Salary_Generation/salarygeneration';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import {
  ApplicationFeatures,
  DomainEnums,
} from 'src/app/classes/domain/domainenums/domainenums';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { FeatureAccessService } from 'src/app/services/feature-access.service';

@Component({
  selector: 'app-salary-generation',
  standalone: false,
  templateUrl: './salary-generation.component.html',
  styleUrls: ['./salary-generation.component.scss'],
})
export class SalaryGenerationComponent implements OnInit {
  @ViewChild('printSection') printSection!: ElementRef;

  Entity: SalaryGeneration = SalaryGeneration.CreateNewInstance();
  MasterList: SalaryGeneration[] = [];
  DisplayMasterList: SalaryGeneration[] = [];
  SearchString: string = '';
  SelectedSalary: SalaryGeneration = SalaryGeneration.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  CompanyList: Company[] = [];
  EmployeeList: Employee[] = [];
  CompanyAddress: string = '';
  CompanyEmail: string = '';
  EmployeeDesignation: string = '';
  EmployeeBankName: string = '';
  EmployeeBankBranch: string = '';
  EmployeeBankAccountNo: string = '';
  EmployeeBankIFSCCode: string = '';
  Month: number = 0;
  EmployeeRef: number = 0;
  MonthList = DomainEnums.MonthList(true, '--Select Month List--');
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  isModalVisible = false;
  UserDisplayName = this.appStateManage.StorageKey.getItem('UserDisplayName');

  // headers: string[] = [
  //   'Employee Name',
  //   'Month',
  //   'Total Working Days',
  //   'Basic Salary',
  //   'Gross Total',
  //   'Total Deduction',
  //   'Net Salary',
  //   'Action',
  // ];
  headers: string[] = [];
  featureRef: ApplicationFeatures = ApplicationFeatures.SalaryGeneration;
  showActionColumn = false;

  constructor(
    private uiUtils: UIUtils,
    private dateService: DateconversionService,
    private router: Router,
    private appStateManage: AppStateManageService,
    private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement,
    public access: FeatureAccessService
  ) {
    effect(async () => {
      await this.getSalaryListByCompanyRef();
      this.getEmployeeListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.getCompanyList();
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
    this.access.refresh();
    this.showActionColumn =
      this.access.canPrint(this.featureRef) ||
      this.access.canEdit(this.featureRef) ||
      this.access.canDelete(this.featureRef);
    this.headers = [
      'Employee Name',
      'Month',
      'Total Working Days',
      'Basic Salary',
      'Gross Total',
      'Total Deduction',
      'Net Salary',
      ...(this.showActionColumn ? ['Action'] : []),
    ];
  }

  getCompanyList = async () => {
    let lst = await Company.FetchEntireList(
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.CompanyList = lst;
  };

  openSalarySlipModal = async (SalaryGeneration: SalaryGeneration) => {
    this.isModalVisible = true;
    this.Entity = SalaryGeneration;
    if (this.Entity.p.CompanyRef != 0) {
      const companydetails = this.CompanyList.find(
        (item) => item.p.Ref == this.Entity.p.CompanyRef
      );
      {
        this.CompanyAddress = companydetails?.p?.AddressLine1 || '';
        this.CompanyEmail = companydetails?.p?.EmailId || '';
      }
    }
    if (this.Entity.p.EmployeeRef != 0) {
      let lst = await Employee.FetchInstance(
        this.Entity.p.EmployeeRef,
        this.companyRef(),
        async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
      );
      // const employeedetails = this.EmployeeList.find(item => item.p.Ref == this.Entity.p.EmployeeRef);
      this.EmployeeDesignation = lst?.p?.DesignationName || '';
      this.EmployeeBankName = lst?.p?.BankName || '';
      this.EmployeeBankBranch = lst?.p?.BranchName || '';
      this.EmployeeBankAccountNo = lst?.p?.BanckAccountNo || '';
      this.EmployeeBankIFSCCode = lst?.p?.IFSC || '';
    }
  };

  getEmployeeListByCompanyRef = async () => {
    this.EmployeeList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Employee.FetchEntireListByCompanyRef(
      this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.EmployeeList = lst;
  };
  getEmployeeDateOfJoining = (employeeRef: number) => {
    const emp = this.EmployeeList.find((e) => e.p.Ref === employeeRef);
    return emp ? this.formatDate(emp.p.DateOfJoining) : null;
  };

  getSalaryListByEmployeeAndMonth = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst =
      await SalaryGeneration.FetchEmployeeDataForTableByEmployeeRefandMonth(
        this.companyRef(),
        this.EmployeeRef,
        this.Month,
        async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
      );
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  formatDate = (date: string | Date): string =>
    this.dateService.formatDate(date);

  getTotalSalary = () => {
    return this.DisplayMasterList.reduce((total: number, item: any) => {
      return total + Number(item.p?.NetSalary || 0);
    }, 0);
  };

  getSalaryListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await SalaryGeneration.FetchEntireListByCompanyRef(
      this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  onEditClicked = async (item: SalaryGeneration) => {
    this.SelectedSalary = item.GetEditableVersion();
    SalaryGeneration.SetCurrentInstance(this.SelectedSalary);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Salary_Generation_Details']);
  };

  onDeleteClicked = async (SalaryGeneration: SalaryGeneration) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
    Are you sure that you want to DELETE this Salary Generation?`,
      async () => {
        await SalaryGeneration.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Salary Generation of ${SalaryGeneration.p.EmployeeName} has been deleted!`
          );
          await this.getSalaryListByCompanyRef();
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
  };

  // 🔑 Whenever filteredList event is received
  onFilteredList(list: any[]) {
    this.DisplayMasterList = list;
    this.currentPage = 1; // reset to first page after filtering

    this.loadPaginationData();
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };

  AddSalaryDetails = () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    }
    this.router.navigate(['/homepage/Website/Salary_Generation_Details']);
  };

  printPage() {
    window.print();
  }
}
