import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveRequestType } from 'src/app/classes/domain/domainenums/domainenums';
import { LeaveRequest } from 'src/app/classes/domain/entities/website/request/leaverequest/leaverequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { ToastService } from '../../core/toast.service';
import { LoadingService } from '../../core/loading.service';
import { AlertService } from '../../core/alert.service';
import { HapticService } from '../../core/haptic.service';

@Component({
  selector: 'app-leave-mobile',
  templateUrl: './leave-mobile.page.html',
  styleUrls: ['./leave-mobile.page.scss'],
  standalone: false
})
export class LeaveMobilePage implements OnInit, OnDestroy {
  LeaveRequestList: LeaveRequest[] = [];
  filteredLeaveRequestData: LeaveRequest[] = [];

  SelectedLeaveRequest: LeaveRequest = LeaveRequest.CreateNewInstance();
  Entity: LeaveRequest = LeaveRequest.CreateNewInstance();

  companyRef = 0;
  selectedStatus = 1;
  modalOpen = false;

  readonly LeaveRequestTypeEnum = LeaveRequestType;

  statusOptions = [
    { label: 'Approved', value: 1 },
    { label: 'Pending', value: 0 },
    { label: 'Rejected', value: 2 },
  ];

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManagement: AppStateManageService,
    private dateService: DateconversionService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService
  ) { }

  async ngOnInit() {
    await this.loadLeaveRequestsIfEmployeeExists();
  }

  async ionViewWillEnter() {
    await this.loadLeaveRequestsIfEmployeeExists();
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  async handleRefresh(event: CustomEvent) {
    await this.loadLeaveRequestsIfEmployeeExists();
    (event.target as HTMLIonRefresherElement).complete();
  }

  private async loadLeaveRequestsIfEmployeeExists() {
    try {
      this.loadingService.show();

      const employeeRef = this.appStateManagement.getEmployeeRef();
      this.Entity.p.EmployeeRef = employeeRef;
      this.companyRef = Number(this.appStateManagement.localStorage.getItem('SelectedCompanyRef'));

      if (employeeRef > 0) {
        await this.getLeaveRequests();
      } else {
        await this.toastService.present('Employee not selected', 1000, 'danger');
        await this.haptic.error();
      }
    } catch (error) {
      console.error('Error loading leave requests:', error);
      await this.toastService.present('Failed to load leave requests', 1000, 'danger');
      await this.haptic.error();
    } finally {
      this.loadingService.hide();
    }
  }

  formatDate(date: string | Date): string {
    return this.dateService.formatDate(date);
  }

  async getLeaveRequests() {
    try {
      this.loadingService.show();
      if (this.Entity.p.EmployeeRef <= 0) {
        await this.toastService.present('Employee not selected', 1000, 'danger');
        await this.haptic.error();
        return;
      }

      this.LeaveRequestList = await LeaveRequest.FetchEntireListByEmployeeRef(
        this.Entity.p.EmployeeRef,
        async (errMsg) => {
          await this.toastService.present(errMsg, 1000, 'danger');
          await this.haptic.error();
        }
      );

      this.filterLeaveRequests();
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      await this.toastService.present('Unable to fetch leave requests', 1000, 'danger');
      await this.haptic.error();
    } finally {
      this.loadingService.hide();
    }
  }

  filterLeaveRequests() {
    this.filteredLeaveRequestData = this.LeaveRequestList.filter(({ p }) => {
      const { IsApproved, IsCancelled } = p;

      if (this.selectedStatus === 1) return IsApproved === 1;
      if (this.selectedStatus === 0) return IsApproved === 0 && IsCancelled !== 1;
      if (this.selectedStatus === 2) return IsCancelled === 1;

      return true;
    });
  }

  openModal(leave: LeaveRequest) {
    this.SelectedLeaveRequest = leave;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.SelectedLeaveRequest = LeaveRequest.CreateNewInstance();
  }

  async onDeleteClicked(request: LeaveRequest) {
    try {
      this.alertService.presentDynamicAlert({
        header: 'Delete',
        subHeader: 'Confirmation needed',
        message: 'Are you sure you want to delete this Leave Request?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'custom-cancel',
            handler: () => {
              console.log('Leave deletion cancelled.');
            }
          },
          {
            text: 'Yes, Delete',
            cssClass: 'custom-confirm',
            handler: async () => {
              try {
                await request.DeleteInstance(async () => {
                  await this.toastService.present(
                    `Leave request for ${request.p.EmployeeName} deleted!`,
                    1000,
                    'success'
                  );
                  await this.haptic.success();
                });
                await this.getLeaveRequests();
              } catch (err) {
                console.error('Error deleting leave request:', err);
                await this.toastService.present('Failed to delete leave request', 1000, 'danger');
                await this.haptic.error();
              }
            }
          }
        ]
      });
    } catch (error) {
      console.error('Error presenting delete confirmation:', error);
      await this.toastService.present('Something went wrong', 1000, 'danger');
      await this.haptic.error();
    }
  }

  async addLeaveRequest() {
    try {
      if (this.companyRef <= 0) {
        await this.toastService.present('Company not selected', 1000, 'danger');
        await this.haptic.error();
        return;
      }

      this.router.navigate(['/mobileapp/tabs/attendance/leave/add']);
    } catch (error) {
      console.error('Error navigating to add leave request:', error);
      await this.toastService.present('Navigation error', 1000, 'danger');
      await this.haptic.error();
    }
  }
}
