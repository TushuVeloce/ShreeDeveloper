import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums, LeaveRequestType } from 'src/app/classes/domain/domainenums/domainenums';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { LeaveRequest } from 'src/app/classes/domain/entities/website/request/leaverequest/leaverequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BottomsheetMobileAppService } from 'src/app/services/bottomsheet-mobile-app.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { IonInput } from "@ionic/angular/standalone";

@Component({
  selector: 'app-leave-request-details-mobile-app',
  templateUrl: './leave-request-details-mobile-app.component.html',
  styleUrls: ['./leave-request-details-mobile-app.component.scss'],
  standalone:false
})
export class LeaveRequestDetailsMobileAppComponent  implements OnInit {
  public Entity: LeaveRequest = LeaveRequest.CreateNewInstance();
  public InitialEntity: LeaveRequest = null as any;
  public DetailsFormTitle: 'New Leave Request' | 'Edit Leave Request' = 'New Leave Request';

  public isHalfDay = false;
  public TotalWorkingHrs = 0;
  public isSaveDisabled = false;
  public EmployeeRef = 0;
  public SelectedLeaveType: any[] = [];
  public LeaveRequestTypeList = DomainEnums.LeaveRequestTypeList();
  public companyRef = 0;
  preselectedRefs: any[] = [];
  disabledRefs: any[] = [];

  showFromPicker = false;
  fromDate = '';
  fromDisplayDate = '';

  showToPicker = false;
  toDate = '';
  toDisplayDate = '';

  showHalfPicker = false;
  halfDayDate = '';
  halfDisplayDate = '';

  public LeaveRequestType = LeaveRequestType;
  private IsNewEntity = true;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private dtu: DTU,
    private companystatemanagement: CompanyStateManagement,
    private bottomsheetMobileAppService: BottomsheetMobileAppService,
    private datePipe: DatePipe,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.loadLeaveRequestsIfEmployeeExists();
  }

  ngOnDestroy(): void { }

  private async loadLeaveRequestsIfEmployeeExists(): Promise<void> {
    try {
      this.companyRef = Number(this.appStateManage.localStorage.getItem('SelectedCompanyRef'));
      this.Entity.p.EmployeeRef = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'));

      if (this.Entity.p.EmployeeRef <= 0) {
        await this.toastService.present('Employee not selected', 1000, 'danger');
        await this.haptic.error();
        return;
      }

      const editMode = this.appStateManage.localStorage.getItem('Editable') === 'Edit';
      this.IsNewEntity = !editMode;
      this.DetailsFormTitle = editMode ? 'Edit Leave Request' : 'New Leave Request';

      if (editMode) {
        this.Entity = LeaveRequest.GetCurrentInstance();
        this.fromDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.FromDate);
        this.toDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.ToDate);
        this.halfDayDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.HalfDayDate);
        this.fromDisplayDate = this.fromDate;
        this.toDisplayDate = this.toDate;
        this.halfDisplayDate = this.halfDayDate;
        this.Entity.p.UpdatedBy = this.Entity.p.EmployeeRef;
        this.appStateManage.localStorage.removeItem('Editable');
      } else {
        this.EmployeeRef = this.Entity.p.EmployeeRef;
        this.Entity = LeaveRequest.CreateNewInstance();
        LeaveRequest.SetCurrentInstance(this.Entity);
        this.Entity.p.LeaveRequestType = this.LeaveRequestTypeList[1].Ref;
        this.preselectedRefs = [this.LeaveRequestTypeList[1].Ref];
        await this.getSingleEmployeeDetails();
        this.onToDateChange(new Date());
        this.onHalfDateChange(new Date());
      }

      this.InitialEntity = Object.assign(LeaveRequest.CreateNewInstance(), this.utils.DeepCopy(this.Entity));
    } catch (error) {
      console.error('Error loading leave request:', error);
    }
  }

  private async getSingleEmployeeDetails(): Promise<void> {
    try {
      if (this.companyRef <= 0) {
        await this.toastService.present('Company not Selected', 1000, 'danger');
        await this.haptic.error();
        return;
      }

      const employee = await Employee.FetchInstance(this.EmployeeRef, this.companyRef, async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      });

      this.Entity.p.EmployeeRef = employee.p.Ref;
      this.Entity.p.EmployeeName = employee.p.Name;
      this.TotalWorkingHrs = employee.p.TotalWorkingHrs;
    } catch (error) {
      console.error('Failed to fetch employee:', error);
    }
  }

  public onDateChangeSetDaysandLeaveHours(): void {
    if (this.fromDate && this.toDate) {
      const from = new Date(this.fromDate);
      const to = new Date(this.toDate);
      const diffInMs = Math.abs(to.getTime() - from.getTime()) + 1;
      const dayDiff = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
      this.Entity.p.Days = dayDiff;
      this.Entity.p.LeaveHours = dayDiff * this.TotalWorkingHrs;
    } else {
      this.Entity.p.Days = 0;
      this.Entity.p.LeaveHours = 0;
    }
  }

  public onLeaveRequestTypeChanged(): void {
    if (this.Entity.p.LeaveRequestType === LeaveRequestType.HalfDay) {
      this.isHalfDay = true;
      this.Entity.p.LeaveHours = this.TotalWorkingHrs * 0.5;
      this.fromDate = this.toDate = '';
      this.Entity.p.Days = 0;
    } else {
      this.isHalfDay = false;
      this.halfDayDate = '';
    }
  }

  public async onFromDateChange(date: any): Promise<void> {
    this.fromDate = this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
    this.fromDisplayDate = this.fromDate;
    this.Entity.p.FromDate = this.fromDate;
    this.onDateChangeSetDaysandLeaveHours();
  }

  public async onToDateChange(date: any): Promise<void> {
    this.toDate = this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
    this.toDisplayDate = this.toDate;
    this.Entity.p.ToDate = this.toDate;

    if (!this.fromDate) {
      await this.onFromDateChange(new Date());
    }
    this.onDateChangeSetDaysandLeaveHours();
  }

  public async onHalfDateChange(date: any): Promise<void> {
    this.halfDayDate = this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
    this.halfDisplayDate = this.halfDayDate;
    this.Entity.p.HalfDayDate = this.halfDayDate;
  }

  handleLeaveTypeSelection(selected: any[]) {
    this.Entity.p.LeaveRequestType = selected[0]?.Ref;
    this.Entity.p.LeaveRequestName = selected[0]?.Name;
    this.SelectedLeaveType = selected;
    this.onLeaveRequestTypeChanged();
  }

  handleChipError(msg: string) {
    this.toastService.present(msg, 1000, 'warning');
    this.haptic.warning();
  }

  private async openSelectModal(
    dataList: any[],
    selectedItems: any[],
    multiSelect: boolean,
    title: string,
    MaxSelection: number,
    updateCallback: (selected: any[]) => void
  ): Promise<void> {
    const selected = await this.bottomsheetMobileAppService.openSelectModal(
      dataList,
      selectedItems,
      multiSelect,
      title,
      MaxSelection
    );
    if (selected) updateCallback(selected);
  }

  public async SaveLeaveRequest(): Promise<void> {
    try {
      this.loadingService.show();

      this.Entity.p.CompanyRef = this.companyRef;
      this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();

      if (this.Entity.p.LeaveRequestType === LeaveRequestType.HalfDay) {
        this.Entity.p.HalfDayDate = this.dtu.ConvertStringDateToFullFormat(this.halfDayDate || '');
        this.Entity.p.FromDate = '';
        this.Entity.p.ToDate = '';
      } else {
        this.Entity.p.FromDate = this.dtu.ConvertStringDateToFullFormat(this.fromDate || '');
        this.Entity.p.ToDate = this.dtu.ConvertStringDateToFullFormat(this.toDate || '');
        this.Entity.p.HalfDayDate = '';
      }

      this.Entity.p.Days = this.Entity.p.Days || 0;
      this.Entity.p.LeaveHours = this.Entity.p.LeaveHours || 0;
      this.Entity.p.UpdatedBy = this.Entity.p.UpdatedBy || this.EmployeeRef;
      console.log('this.Entity :', this.Entity);

      const tr = await this.utils.SavePersistableEntities([this.Entity.GetEditableVersion()]);

      if (!tr.Successful) {
        this.isSaveDisabled = false;
        await this.toastService.present(tr.Message, 1000, 'danger');
        await this.haptic.error();
        return;
      }

      await this.toastService.present('Leave Request saved successfully', 1000, 'success');
      await this.haptic.success();

      this.resetForm();
      await this.router.navigate(['/mobile-app/tabs/attendance/leave-request'], { replaceUrl: true });
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      this.loadingService.hide();
    }
  }

  private resetForm(): void {
    this.fromDate = this.toDate = this.halfDayDate = '';
    this.fromDisplayDate = this.toDisplayDate = this.halfDisplayDate = '';
    this.isHalfDay = false;
    this.Entity = LeaveRequest.CreateNewInstance();
    this.SelectedLeaveType = [];
  }

  isDataFilled(): boolean {
    const emptyEntity = LeaveRequest.CreateNewInstance();
    return !this.deepEqualIgnoringKeys(this.Entity, emptyEntity, []);
  }

  deepEqualIgnoringKeys(obj1: any, obj2: any, ignorePaths: string[]): boolean {
    const clean = (obj: any, path = ''): any => {
      if (obj === null || typeof obj !== 'object') return obj;

      const result: any = Array.isArray(obj) ? [] : {};
      for (const key in obj) {
        const fullPath = path ? `${path}.${key}` : key;
        if (ignorePaths.includes(fullPath)) continue;
        result[key] = clean(obj[key], fullPath);
      }
      return result;
    };

    return JSON.stringify(clean(obj1)) === JSON.stringify(clean(obj2));
  }

  goBack = async () => {
    if (this.isDataFilled()) {
      await this.uiUtils.showConfirmationMessage(
        'Warning',
        'You have unsaved data. Are you sure you want to go back? All data will be lost.',
        async () => {
          this.router.navigate(['/mobile-app/tabs/attendance/leave-request'], { replaceUrl: true });
        }
      );
    } else {
      this.router.navigate(['/mobile-app/tabs/attendance/leave-request'], { replaceUrl: true });
    }
  };
}
