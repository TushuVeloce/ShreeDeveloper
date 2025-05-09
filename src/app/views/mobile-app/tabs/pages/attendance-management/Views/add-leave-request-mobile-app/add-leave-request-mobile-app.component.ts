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
  public SelectedLeaveRequest: LeaveRequest = LeaveRequest.CreateNewInstance();
  public InitialEntity: LeaveRequest = null as any;
  public DetailsFormTitle: 'New Leave Request' | 'Edit Leave Request' = 'New Leave Request';

  public fromDate: string | null = null;
  public toDate: string | null = null;
  public halfDayDate: string | null = null;
  public isHalfDay = false;
  public isLoading = false;


  public TotalWorkingHrs = 0;
  public isSaveDisabled = false;
  public EmployeeRef = 0;
  public SelectedLeaveType: any[] = [];
  public LeaveTypeBottomSheetTitle = 'Select Leave Type';

  public LeaveRequestType = LeaveRequestType;
  public LeaveRequestTypeList = DomainEnums.LeaveRequestTypeList();
  public companyRef : number = 0;

  private IsNewEntity = true;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private dtu: DTU,
    private companystatemanagement: CompanyStateManagement,
    private appStateManagement: AppStateManageService,
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
      this.companyRef = Number(this.appStateManagement.StorageKey.getItem('SelectedCompanyRef'));
      this.Entity.p.EmployeeRef = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'));
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
          this.onToDateChange(new Date());
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
      if (this.companyRef <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }
      const employee = await Employee.FetchInstance(
        this.EmployeeRef, this.companyRef,
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
    console.log('this.fromDate && this.toDate :', this.fromDate ,this.toDate);
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
  // onDateChange(event: any) {
  //   console.log('Selected date:', event.detail.value);
  // }
  public async onFromDateChange(date: any): Promise<void> {
    this.fromDate = this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
    this.Entity.p.FromDate = this.fromDate;
    this.onDateChangeSetDaysandLeaveHours();
  }
  public async onToDateChange(date: any): Promise<void> {
    this.toDate = this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
    this.Entity.p.ToDate = this.toDate;

    if (this.fromDate) {
      this.onDateChangeSetDaysandLeaveHours();
    } else {
      const today = new Date();
      await this.onFromDateChange(today);
      this.onDateChangeSetDaysandLeaveHours();
    }
  }

  public async onHalfDateChange(date: any): Promise<void> {
    this.halfDayDate = this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
    this.Entity.p.HalfDayDate = this.halfDayDate;
    this.onDateChangeSetDaysandLeaveHours();
  }

  public async selectedLeaveTypeBottomsheet(): Promise<void> {
    try {
      // Filter the list before mapping
      // const filteredList = this.CustomerStatusList.filter(
      //   (item) => item.Ref !== CustomerStatus.ConvertToDeal && item.Ref !== CustomerStatus.LeadClosed
      // );

      const options = this.LeaveRequestTypeList.map((item) => ({ p: item }));


      let selectData: any[] = [];

      this.openSelectModal(options, selectData, false, 'Select Leave Type', 1, (selected) => {
        selectData = selected;
        // console.log('selected :', selected);
        this.SelectedLeaveType = selected;
        this.Entity.p.LeaveRequestType = selected[0]?.p?.Ref;
        this.Entity.p.LeaveRequestName = selected[0]?.p?.Name;
        this.onLeaveRequestTypeChanged();
      });
    } catch (error) {
      // console.log('error :', error);
    }
  }

  private async openSelectModal(
    dataList: any[],
    selectedItems: any[],
    multiSelect: boolean,
    title: string,
    MaxSelection: number,
    updateCallback: (selected: any[]) => void
  ): Promise<void> {
    const selected = await this.bottomsheetMobileAppService.openSelectModal(dataList, selectedItems, multiSelect, title, MaxSelection);
    if (selected) updateCallback(selected);
  }

  public async SaveLeaveRequest(): Promise<void> {
    try {
      this.isLoading = true;
      this.Entity.p.CompanyRef = this.companyRef;
      this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();

      if (this.Entity.p.LeaveRequestType === LeaveRequestType.HalfDay) {
        this.Entity.p.HalfDayDate = this.dtu.ConvertStringDateToFullFormat(this.halfDayDate ? this.halfDayDate : '');
      } else {
        this.Entity.p.FromDate = this.dtu.ConvertStringDateToFullFormat(this.fromDate ? this.fromDate : '');
        this.Entity.p.ToDate = this.dtu.ConvertStringDateToFullFormat(this.toDate ? this.toDate : '');
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
