import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExpenseTypeRefs } from 'src/app/classes/domain/constants';
import { ExpenseType } from 'src/app/classes/domain/entities/website/masters/expensetype/expensetype';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Stage } from 'src/app/classes/domain/entities/website/masters/stage/stage';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { ActualStages } from 'src/app/classes/domain/entities/website/site_management/actualstages/actualstages';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-site-management-actual-stages',
  templateUrl: './site-management-actual-stages.component.html',
  styleUrls: ['./site-management-actual-stages.component.scss'],
  standalone: false,
})
export class SiteManagementActualStagesComponent implements OnInit {
  Entity: ActualStages = ActualStages.CreateNewInstance();
  MasterList: ActualStages[] = [];
  DisplayMasterList: ActualStages[] = [];
  MachinaryExpenseList: ActualStages[] = [];
  LabourExpenseList: ActualStages[] = [];
  OtherExpenseList: ActualStages[] = [];
  SiteList: Site[] = [];
  VendorList: Vendor[] = [];
  StageList: Stage[] = [];
  ExpenseTypeList: ExpenseType[] = [];
  SearchString: string = '';
  SelectedActualStages: ActualStages = ActualStages.CreateNewInstance();
  MachinaryPaginationTotal = 0;
  LabourPaginationTotal = 0;
  OtherPaginationTotal = 0;
  FromDate = '';
  ToDate = '';
  pageSize = 5; // Items per page
  currentMachinaryPage = 1; // Initialize current page
  currentLabourPage = 1; // Initialize current page
  currentOtherPage = 1; // Initialize current page
  ExpenseTypeRef: number = ExpenseTypeRefs.MachinaryExpense
  LabourExpenseRef: number = ExpenseTypeRefs.LabourExpense
  OtherExpenseRef: number = ExpenseTypeRefs.OtherExpense
  HideMachinaryTable: boolean = false
  HideLabourTable: boolean = false
  HideOtherTable: boolean = false

  companyRef = this.companystatemanagement.SelectedCompanyRef;
  MachinaryHeaders: string[] = ['Sr.No.', 'Date', 'Chalan No.', 'Site Name', 'Vehicle No', 'Vendor Name', 'Quantity', 'Rate', 'Unit', 'Grand Total', 'Action'];
  LabourHeaders: string[] = ['Sr.No.', 'Date', 'Chalan No.', 'Site Name', 'Vendor Name', 'Grand Total', 'Action'];
  Headers: string[] = ['Sr.No.', 'Date', 'Chalan No.', 'Expense Type', 'Site Name', 'Quantity', 'Rate', 'Grand Total', 'Action'];

  constructor(private uiUtils: UIUtils,
    private router: Router,
    private appStateManage: AppStateManageService,
    private DateconversionService: DateconversionService,
    private companystatemanagement: CompanyStateManagement,
    private dtu: DTU,

  ) {
    effect(async () => {
      await this.getActualStageListByCompanyRef();
      await this.getSiteListByCompanyRef();
      await this.getStageListByCompanyRef();
      await this.getVendorListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
  }

  getSiteListByCompanyRef = async () => {
    this.Entity.p.SiteRef = 0;
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
  }

  getStageListByCompanyRef = async () => {
    this.Entity.p.StageRef = 0;
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Stage.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.StageList = lst;
    this.Entity.p.ExpenseTypeRef = 0;
    this.ExpenseTypeList = [];
  }

  getVendorListByCompanyRef = async () => {
    this.Entity.p.VendorRef = 0;
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Vendor.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.VendorList = lst;
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  OnStageChange = async () => {
    this.getActualStageListByAllFilters();
    await this.getExpenseListByStageRef();
  }

  getExpenseListByStageRef = async () => {
    this.Entity.p.ExpenseTypeRef = 0;
    if (this.Entity.p.StageRef <= 0) {
      await this.uiUtils.showErrorToster('Stage not Selected');
      return;
    }
    let lst = await ExpenseType.FetchEntireListByStageRef(this.Entity.p.StageRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.ExpenseTypeList = lst;
  }

  getActualStageListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    this.MachinaryExpenseList = [];
    this.LabourExpenseList = [];
    this.OtherExpenseList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await ActualStages.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    for (const item of lst) {
      switch (item.p.ExpenseTypeRef) {
        case this.ExpenseTypeRef:
          this.MachinaryExpenseList.push(item);
          break;
        case this.LabourExpenseRef:
          this.LabourExpenseList.push(item);
          break;
        default:
          this.OtherExpenseList.push(item);
          break;
      }
    }
    this.loadPaginationData();
  }

  getActualStageListByAllFilters = async () => {
    const ExpenseValue = ExpenseTypeRefs.MachinaryExpense
    const LabourValue = ExpenseTypeRefs.LabourExpense
    this.MasterList = [];
    this.DisplayMasterList = [];
    this.MachinaryExpenseList = [];
    this.LabourExpenseList = [];
    this.OtherExpenseList = [];
    let FromDate = this.dtu.ConvertStringDateToFullFormat(this.FromDate);
    let ToDate = this.dtu.ConvertStringDateToFullFormat(this.ToDate);
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await ActualStages.FetchEntireListByAllFilters(this.companyRef(), FromDate, ToDate, this.Entity.p.SiteRef, this.Entity.p.VendorRef, this.Entity.p.StageRef, this.Entity.p.ExpenseTypeRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    for (const item of lst) {
      switch (item.p.ExpenseTypeRef) {
        case ExpenseValue:
          this.MachinaryExpenseList.push(item);
          break;
        case LabourValue:
          this.LabourExpenseList.push(item);
          break;
        default:
          this.OtherExpenseList.push(item);
          break;
      }
    }
    if (this.Entity.p.ExpenseTypeRef == this.ExpenseTypeRef) {
      this.HideMachinaryTable = false
      this.HideLabourTable = true
      this.HideOtherTable = true
    } else if (this.Entity.p.ExpenseTypeRef == this.LabourExpenseRef) {
      this.HideMachinaryTable = true
      this.HideLabourTable = false
      this.HideOtherTable = true
    } else if (this.Entity.p.ExpenseTypeRef == 0) {
      this.HideMachinaryTable = false
      this.HideLabourTable = false
      this.HideOtherTable = false
    } else {
      this.HideMachinaryTable = true
      this.HideLabourTable = true
      this.HideOtherTable = false
    }
    this.loadPaginationData();
  }


  navigateToPrint = async (item: ActualStages) => {
    this.router.navigate(['/homepage/Website/Actual_Stage_Print'], {
      state: { printData: item.GetEditableVersion() }
    });
  }

  // Machinary Pagination
  paginatedMachinaryList = () => {
    const start = (this.currentMachinaryPage - 1) * this.pageSize;
    return this.MachinaryExpenseList.slice(start, start + this.pageSize);
  }

  onMachinaryPageChange = (pageIndex: number): void => {
    this.currentMachinaryPage = pageIndex; // Update the current page
  }

  // Labour Pagination
  paginatedLabourList = () => {
    const start = (this.currentLabourPage - 1) * this.pageSize;
    return this.LabourExpenseList.slice(start, start + this.pageSize);
  }

  onLabourPageChange = (pageIndex: number): void => {
    this.currentLabourPage = pageIndex; // Update the current page
  }

  // Other Pagination
  paginatedOtherList = () => {
    const start = (this.currentOtherPage - 1) * this.pageSize;
    return this.OtherExpenseList.slice(start, start + this.pageSize);
  }

  onOtherPageChange = (pageIndex: number): void => {
    this.currentOtherPage = pageIndex; // Update the current page
  }

  get totalMachinaryAmount(): number {
    return this.MachinaryExpenseList.reduce((sum, item) => sum + (item.p.GrandTotal || 0), 0);
  }

  get totalLabourAmount(): number {
    return this.LabourExpenseList.reduce((sum, item) => sum + (item.p.GrandTotal || 0), 0);
  }

  get totalOtherAmount(): number {
    return this.OtherExpenseList.reduce((sum, item) => sum + (item.p.GrandTotal || 0), 0);
  }

  onEditClicked = async (item: ActualStages) => {
    this.SelectedActualStages = item.GetEditableVersion();
    ActualStages.SetCurrentInstance(this.SelectedActualStages);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Actual_Stage_Details']);
  };

  onDeleteClicked = async (actualstage: ActualStages) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
       Are you sure that you want to DELETE this Actual Stage?`,
      async () => {
        await actualstage.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Actual Stage ${actualstage.p.StageName} has been deleted!`
          );
          await this.getActualStageListByCompanyRef();
          this.SearchString = '';
          this.loadPaginationData();
        });
      }
    );
  };

  // For Pagination  start ----
  loadPaginationData = () => {
    this.MachinaryPaginationTotal = this.MachinaryExpenseList.length; // Update total based on loaded data
    this.LabourPaginationTotal = this.LabourExpenseList.length; // Update total based on loaded data
    this.OtherPaginationTotal = this.OtherExpenseList.length; // Update total based on loaded data
  };

  AddActualStages = async () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    }
    await this.router.navigate(['/homepage/Website/Actual_Stage_Details']);
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

