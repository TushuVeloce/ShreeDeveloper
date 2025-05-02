import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ValidationMessages } from 'src/app/classes/domain/constants';
import { DomainEnums, LeaveRequestType } from 'src/app/classes/domain/domainenums/domainenums';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { LeaveRequest } from 'src/app/classes/domain/entities/website/request/leaverequest/leaverequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BottomsheetMobileAppService } from 'src/app/services/bottomsheet-mobile-app.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateTimePickerService } from 'src/app/services/date-time-picker.service';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-leave-request-mobile-app',
  templateUrl: './add-leave-request-mobile-app.component.html',
  styleUrls: ['./add-leave-request-mobile-app.component.scss'],
  standalone: false
})
export class AddLeaveRequestMobileAppComponent implements OnInit {
  public Entity: LeaveRequest = LeaveRequest.CreateNewInstance();
  public InitialEntity: LeaveRequest = null as any;
  public DetailsFormTitle: 'New Leave Request' | 'Edit Leave Request' = 'New Leave Request';

  public fromDate = '';
  public toDate = '';
  public halfDayDate = '';
  public isHalfDay = false;
  public isLoading = false;


  public TotalWorkingHrs = 0;
  public isSaveDisabled = false;
  public EmployeeRef = 0;
  public SelectedLeaveType: any[] = [];
  public LeaveTypeBottomSheetTitle = 'Select Leave Type';

  public RequiredFieldMsg = ValidationMessages.RequiredFieldMsg;

  public LeaveRequestType = LeaveRequestType;
  public LeaveRequestTypeList = DomainEnums.LeaveRequestTypeList();
  public companyRef = this.companystatemanagement.SelectedCompanyRef;

  private IsNewEntity = true;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private dtu: DTU,
    private companystatemanagement: CompanyStateManagement,
    private bottomsheetMobileAppService: BottomsheetMobileAppService,
    private dateTimePickerService: DateTimePickerService,
    private datePipe: DatePipe
  ) { }

  async ngOnInit(): Promise<void> {
    await this.loadLeaveRequestsIfEmployeeExists();
  }

  // ionViewWillEnter = async () => {
  //   await this.loadLeaveRequestsIfEmployeeExists();
  //   // console.log('Leave request refreshed on view enter');
  // };

  ngOnDestroy(): void {
    // cleanup logic if needed later
  }

  private async loadLeaveRequestsIfEmployeeExists(): Promise<void> {
    try {
      this.isLoading = true;
      this.Entity.p.EmployeeRef = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'));
      // this.EmployeeRef = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'));
      if (this.Entity.p.EmployeeRef > 0) {
        const editMode = this.appStateManage.StorageKey.getItem('Editable') === 'Edit';

        this.IsNewEntity = !editMode;
        this.DetailsFormTitle = editMode ? 'Edit Leave Request' : 'New Leave Request';

        if (editMode) {
          this.Entity = LeaveRequest.GetCurrentInstance();
          this.fromDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.FromDate);
          this.toDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.ToDate);
          this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'));
          this.appStateManage.StorageKey.removeItem('Editable');
        } else {
          this.EmployeeRef = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'));
          this.Entity = LeaveRequest.CreateNewInstance();
          LeaveRequest.SetCurrentInstance(this.Entity);
          this.Entity.p.LeaveRequestType = this.LeaveRequestTypeList[1].Ref;
          await this.getSingleEmployeeDetails();
        }

        this.InitialEntity = Object.assign(
          LeaveRequest.CreateNewInstance(),
          this.utils.DeepCopy(this.Entity)
        ) as LeaveRequest;
      } else {
        await this.uiUtils.showErrorToster('Employee not selected');
      }
    } catch (error) {
      // console.log('error :', error);

    } finally {
      this.isLoading = false;
    }
  }

  private async getSingleEmployeeDetails(): Promise<void> {
    try {
      // if (this.companyRef() <= 0) {
      //   await this.uiUtils.showErrorToster('Company not Selected');
      //   return;
      // }
      const companyRef = await this.companystatemanagement.SelectedCompanyRef();
      if (companyRef <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }
      const employee = await Employee.FetchInstance(
        this.EmployeeRef, companyRef,
        async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
      );

      this.Entity.p.EmployeeRef = employee.p.Ref;
      this.Entity.p.EmployeeName = employee.p.Name;
      this.TotalWorkingHrs = employee.p.TotalWorkingHrs;
    } catch (error) {
      // console.log('error :', error);
    }
  }

  private setLeaveHoursByDays(): void {
    if (this.fromDate && this.Entity.p.Days) {
      this.Entity.p.LeaveHours = this.Entity.p.Days * this.TotalWorkingHrs;
    }
  }

  public onDaysChanged(): void {
    if (this.fromDate && this.Entity.p.Days) {
      const from = new Date(this.fromDate);
      const to = new Date(from);
      to.setDate(from.getDate() + this.Entity.p.Days - 1);
      this.setLeaveHoursByDays();
    }
  }

  public onDateChangeSetDaysandLeaveHours(): void {
    if (this.fromDate && this.toDate) {
      const from = new Date(this.fromDate);
      const to = new Date(this.toDate);
      const diffInMs = Math.abs(to.getTime() - from.getTime()) + 1;
      const dayDiff = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
      this.Entity.p.Days = dayDiff;
      this.setLeaveHoursByDays();
    } else {
      this.Entity.p.Days = 0;
    }
  }

  public onLeaveRequestTypeChanged(): void {
    if (this.Entity.p.LeaveRequestType === LeaveRequestType.HalfDay) {
      this.isHalfDay = true;
      this.Entity.p.LeaveHours = this.TotalWorkingHrs * 0.5;
      this.Entity.p.FromDate = '';
      this.fromDate = '';
      this.Entity.p.ToDate = '';
      this.toDate = '';
      this.Entity.p.Days = 0;
    } else {
      this.isHalfDay = false;
      this.halfDayDate = '';
    }
  }

  public async selectFromDate(): Promise<void> {
    const pickedDate = await this.dateTimePickerService.open({
      mode: 'date',
      label: 'Select Start Date',
      value: this.fromDate,
    });

    if (pickedDate) {
      this.fromDate = this.datePipe.transform(pickedDate, 'yyyy-MM-dd') ?? '';
      this.Entity.p.FromDate = this.fromDate;
      this.onDateChangeSetDaysandLeaveHours();
    }
  }

  public async selectToDate(): Promise<void> {
    const pickedDate = await this.dateTimePickerService.open({
      mode: 'date',
      label: 'Select End Date',
      value: this.toDate,
    });

    if (pickedDate) {
      this.toDate = this.datePipe.transform(pickedDate, 'yyyy-MM-dd') ?? '';
      this.Entity.p.ToDate = this.toDate;
      this.onDateChangeSetDaysandLeaveHours();
    }
  }

  public async selectHalfDayDate(): Promise<void> {
    const pickedDate = await this.dateTimePickerService.open({
      mode: 'date',
      label: 'Select Half Day',
      value: this.halfDayDate,
    });

    if (pickedDate) {
      this.halfDayDate = this.datePipe.transform(pickedDate, 'yyyy-MM-dd') ?? '';
      this.Entity.p.HalfDayDate = this.halfDayDate;
    }
  }

  public selectLeaveType(): void {
    const options = this.LeaveRequestTypeList.map(item => ({ p: item }));
    this.openSelectModal(
      options,
      this.SelectedLeaveType,
      this.LeaveTypeBottomSheetTitle,
      (selected) => {
        this.SelectedLeaveType = selected;
        this.Entity.p.LeaveRequestType = selected[0]?.p?.Ref;
        this.Entity.p.LeaveRequestName = selected[0]?.p?.Name;
        this.onLeaveRequestTypeChanged();
      }
    );
  }

  private async openSelectModal(
    dataList: any[],
    selectedItems: any[],
    title: string,
    updateCallback: (selected: any[]) => void
  ): Promise<void> {
    const selected = await this.bottomsheetMobileAppService.openSelectModal(
      dataList,
      selectedItems,
      false,
      title
    );

    if (selected) updateCallback(selected);
  }

  public async SaveLeaveRequest(): Promise<void> {
    try {
      this.isLoading = true;
      this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
      this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();

      if (this.Entity.p.LeaveRequestType === LeaveRequestType.HalfDay) {
        this.Entity.p.HalfDayDate = this.dtu.ConvertStringDateToFullFormat(this.halfDayDate);
      } else {
        this.Entity.p.FromDate = this.dtu.ConvertStringDateToFullFormat(this.fromDate);
        this.Entity.p.ToDate = this.dtu.ConvertStringDateToFullFormat(this.toDate);
      }

      if (!this.Entity.p.Days) this.Entity.p.Days = 0;
      if (!this.Entity.p.LeaveHours) this.Entity.p.LeaveHours = 0;
      if (this.Entity.p.UpdatedBy === 0) this.Entity.p.UpdatedBy = this.EmployeeRef;

      const entityToSave = this.Entity.GetEditableVersion();
      const tr = await this.utils.SavePersistableEntities([entityToSave]);

      if (!tr.Successful) {
        this.isSaveDisabled = false;
        this.uiUtils.showErrorMessage('Error', tr.Message);
        return;
      }

      this.isSaveDisabled = false;
      await this.uiUtils.showSuccessToster('Leave Request saved successfully!');
      this.Entity = LeaveRequest.CreateNewInstance();
      this.SelectedLeaveType = [];
      this.resetForm();
      await this.router.navigate(['app_homepage/tabs/attendance-management/leave-request'], { replaceUrl: true });
    } catch (error) {
      // console.log('error :', error);
    } finally {
      this.isLoading = false;
    }
  }

  private resetForm(): void {
    this.fromDate = '';
    this.toDate = '';
    this.halfDayDate = '';
    this.isHalfDay = false;
    this.Entity.p.Days = 0;
    this.Entity.p.LeaveHours = 0;
  }

  goBack() {
    this.router.navigate(['app_homepage/tabs/attendance-management/leave-request'], { replaceUrl: true });
  }

}
