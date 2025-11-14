import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExpenseTypeRefs } from 'src/app/classes/domain/constants';
import { ExpenseType } from 'src/app/classes/domain/entities/website/masters/expensetype/expensetype';
import { Stage } from 'src/app/classes/domain/entities/website/masters/stage/stage';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-expense-type-master',
  standalone: false,
  templateUrl: './expense-type-master.component.html',
  styleUrls: ['./expense-type-master.component.scss'],
})
export class ExpenseTypeMasterComponent implements OnInit {

  Entity: ExpenseType = ExpenseType.CreateNewInstance();
  MasterList: ExpenseType[] = [];
  DisplayMasterList: ExpenseType[] = [];
  SearchString: string = '';
  SelectedExpenseType: ExpenseType = ExpenseType.CreateNewInstance();
  StageList: Stage[] = [];
  IsOtherExpenseApplicable: Boolean = false;
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  ExpenseTypeRef: number = ExpenseTypeRefs.MachinaryExpense
  LabourExpenseRef: number = ExpenseTypeRefs.LabourExpense
  OtherExpenseRef: number = ExpenseTypeRefs.OtherExpense

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Name', 'Action'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement, private payloadPacketFacade: PayloadPacketFacade,
    private serverCommunicator: ServerCommunicatorService
  ) {
    effect(async () => {
      await this.getStageListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }


  getStageListByCompanyRef = async () => {
    this.Entity.p.StageRef = 0;
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Stage.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.StageList = lst;
    if (this.StageList.length > 0) {
      this.Entity.p.StageRef = this.StageList[0].p.Ref;
      this.getExpenseListByStageRef();
    } else {
      this.DisplayMasterList = [];
    }
  }

  getExpenseListByStageRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.Entity.p.StageRef <= 0) {
      await this.uiUtils.showErrorToster('Stage not Selected');
      return;
    }
    let stagedata = await Stage.FetchInstance(this.Entity.p.StageRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.IsOtherExpenseApplicable = false;
    let lst = await ExpenseType.FetchEntireListByStageRef(this.Entity.p.StageRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;

    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  onEditClicked = async (item: ExpenseType) => {
    if (!this.IsOtherExpenseApplicable) {
      this.uiUtils.showErrorToster('This Stage is not applicable for Expense');
      return;
    }
    this.SelectedExpenseType = item.GetEditableVersion();
    ExpenseType.SetCurrentInstance(this.SelectedExpenseType);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Expense_Type_Master_Details']);
  };

  onDeleteClicked = async (ExpenseType: ExpenseType) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
     Are you sure that you want to DELETE this Expense Type?`,
      async () => {
        await ExpenseType.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Expense Type ${ExpenseType.p.Name} has been deleted!`
          );
          await this.getExpenseListByStageRef();
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

  AddExpenseType = () => {
    if (this.Entity.p.StageRef <= 0) {
      this.uiUtils.showWarningToster('Stage not Selected');
      return;
    }
    if (!this.IsOtherExpenseApplicable) {
      this.uiUtils.showErrorToster('This Stage is not applicable for Expense');
      return;
    }
    this.router.navigate(['/homepage/Website/Expense_Type_Master_Details']);
  }
}
