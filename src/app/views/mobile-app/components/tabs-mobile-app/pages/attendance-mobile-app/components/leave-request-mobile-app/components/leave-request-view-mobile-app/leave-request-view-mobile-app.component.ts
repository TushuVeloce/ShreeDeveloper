import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveRequestType } from 'src/app/classes/domain/domainenums/domainenums';
import { LeaveRequest } from 'src/app/classes/domain/entities/website/request/leaverequest/leaverequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';

@Component({
  selector: 'app-leave-request-view-mobile-app',
  templateUrl: './leave-request-view-mobile-app.component.html',
  styleUrls: ['./leave-request-view-mobile-app.component.scss'],
  standalone:false
})
export class LeaveRequestViewMobileAppComponent  implements OnInit {
  leaveRequests: LeaveRequest[] = [];
  filteredRequests: LeaveRequest[] = [];
  selectedLeave: LeaveRequest = LeaveRequest.CreateNewInstance();
  entity: LeaveRequest = LeaveRequest.CreateNewInstance();

  companyRef = 0;
  selectedStatus = 1;
  modalOpen = false;
  approvedCount = 0;
  rejectedCount = 0;
  pendingCount = 0;

  readonly LeaveRequestTypeEnum = LeaveRequestType;

  statusOptions = [
    { label: 'Approved', value: 1 },
    { label: 'Pending', value: 0 },
    { label: 'Rejected', value: 2 },
  ];

  constructor(
    private router: Router,
    private appState: AppStateManageService,
    private dateService: DateconversionService,
    private toast: ToastService,
    private haptic: HapticService,
    private alert: AlertService,
    public loadingService: LoadingService
  ) { }

  async ngOnInit() {
    await this.initializeLeaveRequests();
  }

  async ionViewWillEnter() {
    await this.initializeLeaveRequests();
  }

  ngOnDestroy() { }

  async handleRefresh(event: CustomEvent) {
    await this.initializeLeaveRequests();
    (event.target as HTMLIonRefresherElement).complete();
  }

  private async initializeLeaveRequests() {
    try {
      this.loadingService.show();
      const employeeRef = this.appState.getEmployeeRef();
      this.entity.p.EmployeeRef = employeeRef;
      this.companyRef = Number(this.appState.localStorage.getItem('SelectedCompanyRef'));

      if (employeeRef > 0) {
        await this.fetchLeaveRequests();
      } else {
        await this.toast.present('Employee not selected', 1000, 'danger');
        await this.haptic.error();
      }
    } catch (err) {
      console.error(err);
      await this.toast.present('Failed to load data', 1000, 'danger');
      await this.haptic.error();
    } finally {
      this.loadingService.hide();
    }
  }

  formatDate(date: string | Date): string {
    return this.dateService.formatDate(date);
  }

  async fetchLeaveRequests() {
    try {
      if (this.entity.p.EmployeeRef <= 0) return;

      this.leaveRequests = await LeaveRequest.FetchEntireListByEmployeeRef(
        this.entity.p.EmployeeRef,
        async (errMsg) => {
          await this.toast.present(errMsg, 1000, 'danger');
          await this.haptic.error();
        }
      );

      this.filterRequestsByStatus();
    } catch (err) {
      console.error(err);
      await this.toast.present('Failed to fetch leave requests', 1000, 'danger');
      await this.haptic.error();
    }
  }

  filterRequestsByStatus() {
    this.approvedCount = 0;
    this.pendingCount = 0;
    this.rejectedCount = 0;

    this.filteredRequests = this.leaveRequests.filter(({ p }) => {
      const approved = p.IsApproved === 1;
      const pending = p.IsApproved === 0 && p.IsCancelled !== 1;
      const rejected = p.IsCancelled === 1;

      if (approved) this.approvedCount++;
      if (pending) this.pendingCount++;
      if (rejected) this.rejectedCount++;

      switch (this.selectedStatus) {
        case 1: return approved;
        case 0: return pending;
        case 2: return rejected;
        default: return true;
      }
    });
  }

  openModal(leave: LeaveRequest) {
    this.selectedLeave = leave;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedLeave = LeaveRequest.CreateNewInstance();
  }

  async onDeleteClicked(request: LeaveRequest) {
    this.alert.presentDynamicAlert({
      header: 'Delete',
      subHeader: 'Confirmation',
      message: 'Delete this leave request?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Yes, Delete',
          handler: async () => {
            try {
              await request.DeleteInstance(async () => {
                await this.toast.present(`Deleted leave for ${request.p.EmployeeName}`, 1000, 'success');
                await this.haptic.success();
              });
              await this.fetchLeaveRequests();
            } catch (err) {
              await this.toast.present('Deletion failed', 1000, 'danger');
              await this.haptic.error();
            }
          }
        }
      ]
    });
  }

  async addLeaveRequest() {
    if (this.companyRef <= 0) {
      await this.toast.present('Company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    this.router.navigate(['/mobile-app/tabs/attendance/leave-request/add']);
  }
}
