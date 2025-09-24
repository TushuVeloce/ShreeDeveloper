import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { SalarySlipRequest } from 'src/app/classes/domain/entities/website/request/salarysliprequest/salarysliprequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';

@Component({
  selector: 'app-salary-slip-approval-mobile-app',
  templateUrl: './salary-slip-approval-mobile-app.component.html',
  styleUrls: ['./salary-slip-approval-mobile-app.component.scss'],
  standalone: false,
})
export class SalarySlipApprovalMobileAppComponent implements OnInit {
  Entity: SalarySlipRequest = SalarySlipRequest.CreateNewInstance();
  MasterList: SalarySlipRequest[] = [];
  DisplayMasterList: SalarySlipRequest[] = [];
  FilteredMasterList: SalarySlipRequest[] = [];
  SelectedSalarySlipApproval: SalarySlipRequest =
    SalarySlipRequest.CreateNewInstance();
  EmployeeList: Employee[] = [];
  isApprovalDisabled: boolean = false;

  selectedStatus = 0;
  modalOpen = false;
  approvedCount = 0;
  rejectedCount = 0;
  pendingCount = 0;

  // readonly LeaveRequestTypeEnum = LeaveRequestType;

  statusOptions = [
    { label: 'Pending', value: 0 },
    { label: 'Approved', value: 1 },
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
    private baseUrl: BaseUrlService
  ) {}

  async ngOnInit() {
    await this.loadAttendanceDetailsIfEmployeeExists();
  }

  ngOnDestroy(): void {
    // Any cleanup logic
  }

  ionViewWillEnter = async () => {
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
      await this.getSalarySlipApprovalListByCompanyRef();
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
      const pending = p.IsApproved === 0;
      // && p.IsCancelled !== 1;
      // const rejected = p.IsCancelled === 1;

      if (approved) this.approvedCount++;
      if (pending) this.pendingCount++;
      // if (rejected) this.rejectedCount++;

      switch (this.selectedStatus) {
        case 1:
          return approved;
        case 0:
          return pending;
        // case 2:
        //   return rejected;
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

  getSalarySlipApprovalListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await SalarySlipRequest.FetchEntireListByCompanyRef(
      this.companyRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.MasterList = lst;

    this.DisplayMasterList = this.MasterList;
  };

  getSalarySlipApprovalListByEmployeeRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.Entity.p.EmployeeRef <= 0) {
      await this.uiUtils.showErrorToster('Employee not Selected');
      return;
    }
    let lst = await SalarySlipRequest.FetchEntireListByEmployeeRef(
      this.Entity.p.EmployeeRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.MasterList = lst;

    this.DisplayMasterList = this.MasterList;
  };

  handleApproval = async (
    salaryslipapproval: SalarySlipRequest,
    status: String
  ) => {
    return;
    this.Entity = salaryslipapproval;
    this.Entity.p.IsApproved = 1;
    let entityToSave = this.Entity.GetEditableVersion();
    // let entityToSave = Object.assign(SalarySlipRequest.CreateNewInstance(),
    //   this.utils.DeepCopy(this.Entity)) as SalarySlipRequest;

    let entitiesToSave = [entityToSave];
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);

    if (!tr.Successful) {
      this.isApprovalDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    } else {
      this.isApprovalDisabled = false;
      await this.uiUtils.showSuccessToster(
        'Leave Approval Successfully Approved'
      );
      this.getSalarySlipApprovalListByEmployeeRef();
    }
  };
}
