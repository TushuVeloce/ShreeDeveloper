import { Component, OnInit } from '@angular/core';
import {
  ApplicationFeatures,
  LeaveRequestType,
} from 'src/app/classes/domain/domainenums/domainenums';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { LeaveRequest } from 'src/app/classes/domain/entities/website/request/leaverequest/leaverequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { FeatureAccessMobileAppService } from 'src/app/services/feature-access-mobile-app.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';

@Component({
  selector: 'app-leave-approval-mobile-app',
  templateUrl: './leave-approval-mobile-app.component.html',
  styleUrls: ['./leave-approval-mobile-app.component.scss'],
  standalone: false,
})
export class LeaveApprovalMobileAppComponent implements OnInit {
  Entity: LeaveRequest = LeaveRequest.CreateNewInstance();
  MasterList: LeaveRequest[] = [];
  DisplayMasterList: LeaveRequest[] = [];
  FilteredMasterList: LeaveRequest[] = [];
  EmployeeList: Employee[] = [];

  selectedStatus = 0;
  modalOpen = false;
  approvedCount = 0;
  rejectedCount = 0;
  pendingCount = 0;

  readonly LeaveRequestTypeEnum = LeaveRequestType;

  statusOptions = [
    { label: 'Pending', value: 0 },
    { label: 'Approved', value: 1 },
    { label: 'Rejected', value: 2 },
  ];

  isAdmin: boolean = false;
  employeeRef: number = 0;
  companyRef: number = 0;

  imagePreviewUrl: string | null = null;
  selectedFileName: string | null = null;
  TimeStamp = Date.now();
  ImageBaseUrl = '';
  LoginToken = '';
  imageUrl: string | null = null;
  ProfilePicFile: File | null = null;
  featureRef: ApplicationFeatures = ApplicationFeatures.LeaveApproval;

  constructor(
    private utils: Utils,
    private uiUtils: UIUtils,
    private appStateManagement: AppStateManageService,
    private dateConversionService: DateconversionService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    public loadingService: LoadingService,
    private companystatemanagement: CompanyStateManagement,
    private baseUrl: BaseUrlService,
    public access: FeatureAccessMobileAppService
  ) {}

  async ngOnInit() {
    this.access.refresh();
    await this.loadAttendanceDetailsIfEmployeeExists();
  }

  ngOnDestroy(): void {
    // Any cleanup logic
  }

  ionViewWillEnter = async () => {
    this.access.refresh();
    await this.loadAttendanceDetailsIfEmployeeExists();
  };

  async handleRefresh(event: CustomEvent): Promise<void> {
    await this.loadAttendanceDetailsIfEmployeeExists();
    (event.target as HTMLIonRefresherElement).complete();
  }
  async loadAttendanceDetailsIfEmployeeExists(): Promise<void> {
    try {
      await this.loadingService.show();

      this.employeeRef = Number(
        this.appStateManagement.localStorage.getItem('LoginEmployeeRef')
      );
      this.companyRef = Number(
        this.appStateManagement.localStorage.getItem('SelectedCompanyRef')
      );
      this.isAdmin =
        (await this.appStateManagement.localStorage.getItem(
          'IsDefaultUser'
        )) === '1';

      this.LoginToken = this.appStateManagement.getLoginTokenForMobile();
      this.ImageBaseUrl = this.baseUrl.GenerateImageBaseUrl();
      await this.getLeaveApprovalListByCompanyRef();
      await this.getEmployeeListByCompanyRef();
      await this.filterRequestsByStatus();
    } catch (error) {
    } finally {
      this.loadingService.hide();
    }
  }
  loadImageFromBackend(imageUrl: string | null): void {
    if (imageUrl) {
      this.imagePreviewUrl = `${this.ImageBaseUrl}${imageUrl}/${this.LoginToken}?${this.TimeStamp}`;
      this.selectedFileName = imageUrl;
    } else {
      this.imagePreviewUrl = null;
    }
  }

  formatDate(date: string | Date): string {
    return this.dateConversionService.formatDate(date);
  }

  filterRequestsByStatus() {
    this.approvedCount = 0;
    this.pendingCount = 0;
    this.rejectedCount = 0;

    this.FilteredMasterList = this.MasterList.filter(({ p }) => {
      const approved = p.IsApproved === 1;
      const pending = p.IsApproved === 0 && p.IsCancelled !== 1;
      const rejected = p.IsCancelled === 1;

      if (approved) this.approvedCount++;
      if (pending) this.pendingCount++;
      if (rejected) this.rejectedCount++;

      switch (this.selectedStatus) {
        case 1:
          return approved;
        case 0:
          return pending;
        case 2:
          return rejected;
        default:
          return true;
      }
    });
  }

  getEmployeeListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Employee.FetchEntireListByCompanyRef(
      this.companyRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.EmployeeList = lst;
  };

  getLeaveApprovalListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await LeaveRequest.FetchEntireListByCompanyRef(
      this.companyRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.MasterList = lst;

    this.DisplayMasterList = this.MasterList;
  };

  getLeaveApprovalListByEmployeeRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.Entity.p.EmployeeRef <= 0) {
      this.getLeaveApprovalListByCompanyRef();
      return;
    }
    let lst = await LeaveRequest.FetchEntireListByEmployeeRef(
      this.Entity.p.EmployeeRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.MasterList = lst;

    this.DisplayMasterList = this.MasterList;
  };

  handleApproval = async (
    leaveapproval: LeaveRequest,
    selectedStatus: string
  ) => {
    this.Entity = leaveapproval;
    // Save original state in case backend fails
    const originalApprovalStatus = this.Entity.p.IsApproved;
    const originalCancelStatus = this.Entity.p.IsCancelled;
    const originalApprovedBy = this.Entity.p.LeaveApprovedBy;
    const originalCancelledBy = this.Entity.p.LeaveCancelledBy;

    const currentEmployeeRef = Number(
      this.appStateManagement.localStorage.getItem('LoginEmployeeRef')
    );
    this.Entity.p.LeaveApprovedBy = currentEmployeeRef;
    this.Entity.p.LeaveCancelledBy = currentEmployeeRef;

    if (selectedStatus === 'Approved') {
      this.Entity.p.IsApproved = 1;
      this.Entity.p.LeaveApprovedBy = currentEmployeeRef;
      this.Entity.p.LeaveCancelledBy = currentEmployeeRef;
      this.Entity.p.IsCancelled = 0;
    } else if (selectedStatus === 'Rejected') {
      this.Entity.p.IsApproved = 0;
      this.Entity.p.LeaveApprovedBy = currentEmployeeRef;
      this.Entity.p.LeaveCancelledBy = currentEmployeeRef;
      this.Entity.p.IsCancelled = 1;
    }
    const entityToSave = this.Entity.GetEditableVersion();
    const tr = await this.utils.SavePersistableEntities([entityToSave]);
    if (!tr.Successful) {
      this.Entity.p.IsApproved = originalApprovalStatus;
      this.Entity.p.IsCancelled = originalCancelStatus;
      this.Entity.p.LeaveApprovedBy = originalApprovedBy;
      this.Entity.p.LeaveCancelledBy = originalCancelledBy;
      // this.uiUtils.showErrorMessage('Error', tr.Message);
      await this.toastService.present(tr.Message, 1000, 'danger');
      return;
    } else {
      if (selectedStatus === 'Approved') {
        // await this.uiUtils.showSuccessToster(
        //   `Leave has been approved successfully`
        // );
        await this.toastService.present(
          'Leave has been approved successfully',
          1000,
          'success'
        );
      } else if (selectedStatus === 'Rejected') {
        // await this.uiUtils.showSuccessToster(
        //   `Leave has been rejected  successfully`
        // );
        await this.toastService.present(
          'Leave has been rejected  successfully',
          1000,
          'success'
        );
      }
      this.getLeaveApprovalListByEmployeeRef();
    }
  };
}
