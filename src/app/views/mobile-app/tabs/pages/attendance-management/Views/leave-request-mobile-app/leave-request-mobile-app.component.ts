import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveRequest } from 'src/app/classes/domain/entities/website/request/leaverequest/leaverequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

// enum Status {
//   Approved = 100,
//   Pending = 101,
//   Rejected = 102
// }

// enum LeaveType {
//   Sick = 200,
//   Personal = 201,
//   other = 202,
// }


@Component({
  selector: 'app-leave-request-mobile-app',
  templateUrl: './leave-request-mobile-app.component.html',
  styleUrls: ['./leave-request-mobile-app.component.scss'],
  standalone: false
})
export class LeaveRequestMobileAppComponent implements OnInit {
  SelectedLeaveRequest: LeaveRequest = LeaveRequest.CreateNewInstance();
  Entity: LeaveRequest = LeaveRequest.CreateNewInstance();
  MasterList: LeaveRequest[] = [];
  DisplayMasterList: LeaveRequest[] = [];
  SearchString: string = '';
  CustomerRef: number = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement, private DateconversionService: DateconversionService
  ) {
    effect(async () => {
      await this.getLeaveRequestListByEmployeeRef();
    });
  }
  getLeaveRequestListByEmployeeRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.Entity.p.EmployeeRef <= 0) {
      await this.uiUtils.showErrorToster('Employee not Selected');
      return;
    }
    let lst = await LeaveRequest.FetchEntireListByEmployeeRef(this.Entity.p.EmployeeRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
  }
  ngOnInit(): void {
    this.filterApprovedLeaveData();
    this.Entity.p.EmployeeRef = this.appStateManage.getEmployeeRef();
    this.getLeaveRequestListByEmployeeRef()
  }

  onDeleteClicked = async (leaverequest: LeaveRequest) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
    Are you sure that you want to DELETE this Leave Request?`,
      async () => {
        await leaverequest.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Leave Request of ${leaverequest.p.EmployeeName} has been deleted!`
          );
          await this.getLeaveRequestListByEmployeeRef();
          this.SearchString = '';
        });
      }
    );
  };
  statusOptions = [
    { label: 'Approved', value:1 },
    { label: 'Pending', value: 0},
    // { label: 'Rejected', value: 0 }
  ];

  selectedStatus: any = this.statusOptions[0].value;
  filteredLeaveRequestData: LeaveRequest[] = [];
  modalOpen: boolean = false;
  selectedLeave: LeaveRequest | null = null;


  filterApprovedLeaveData(): void {
    this.filteredLeaveRequestData = this.MasterList.filter(
      leave => leave.p.IsApproved === this.selectedLeave?.p.IsApproved
    );
  }
  openModal(leave: LeaveRequest): void {
    this.selectedLeave = leave;
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selectedLeave = null;
  }

  addTask(): void {
    this.router.navigate(['/app_homepage/tabs/attendance-management/add-salary-slip']);
  }



  // getStatusColor(status: Status): string {
  //   switch (status) {
  //     case Status.Approved: return 'var(--ion-color-success)';
  //     case Status.Pending: return 'var(--ion-color-warning)';
  //     case Status.Rejected: return 'var(--ion-color-danger)';
  //     default: return 'var(--ion-color-medium)';
  //   }
  // }
}
