import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveRequest } from 'src/app/classes/domain/entities/website/request/leaverequest/leaverequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-leaverequest-master',
  standalone: false,
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.scss'],

})

export class LeaveRequestComponent implements OnInit {
  Entity: LeaveRequest = LeaveRequest.CreateNewInstance();
  MasterList: LeaveRequest[] = [];
  DisplayMasterList: LeaveRequest[] = [];
  SearchString: string = '';
  SelectedLeaveRequest: LeaveRequest = LeaveRequest.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Code', 'LeaveRequest Name', 'LeaveRequest Unit', 'Action'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement
  ) {
    effect(async () => {
      await this.getLeaveRequestListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(false);
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  getLeaveRequestListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    // let lst = await LeaveRequest.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    // this.MasterList = lst;

    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  onEditClicked = async (item: LeaveRequest) => {
    this.SelectedLeaveRequest = item.GetEditableVersion();
    LeaveRequest.SetCurrentInstance(this.SelectedLeaveRequest);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Leave_Request_Details']);
  };

  onDeleteClicked = async (leaverequest: LeaveRequest) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
    Are you sure that you want to DELETE this LeaveRequest?`,
      async () => {
        await leaverequest.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `LeaveRequest ${leaverequest.p.EmployeeName} has been deleted!`
          );
          await this.getLeaveRequestListByCompanyRef();
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

  AddLeaveRequest = () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.router.navigate(['/homepage/Website/Leave_Request_Details']);
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
