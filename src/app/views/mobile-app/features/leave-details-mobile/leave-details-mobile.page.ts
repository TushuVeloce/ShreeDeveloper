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
import { ToastService } from '../../core/toast.service';
import { HapticService } from '../../core/haptic.service';
import { AlertService } from '../../core/alert.service';
import { LoadingService } from '../../core/loading.service';

@Component({
  selector: 'app-leave-details-mobile',
  templateUrl: './leave-details-mobile.page.html',
  styleUrls: ['./leave-details-mobile.page.scss'],
  standalone: false
})
export class LeaveDetailsMobilePage implements OnInit {

  public Entity: LeaveRequest = LeaveRequest.CreateNewInstance();
  public SelectedLeaveRequest: LeaveRequest = LeaveRequest.CreateNewInstance();
  public InitialEntity: LeaveRequest = null as any;
  public DetailsFormTitle: 'New Leave Request' | 'Edit Leave Request' = 'New Leave Request';

  public fromDate: string | null = null;
  public toDate: string | null = null;
  public halfDayDate: string | null = null;
  public isHalfDay = false;
  // public isLoading = false;


  public TotalWorkingHrs = 0;
  public isSaveDisabled = false;
  public EmployeeRef = 0;
  public SelectedLeaveType: any[] = [];
  public LeaveTypeBottomSheetTitle = 'Select Leave Type';

  public LeaveRequestType = LeaveRequestType;
  public LeaveRequestTypeList = DomainEnums.LeaveRequestTypeList();
  public companyRef: number = 0;

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
    // private dateTimePickerService: DateTimePickerService,
    private datePipe: DatePipe,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.loadLeaveRequestsIfEmployeeExists();
  }

  // ionViewWillEnter = async () => {
  //   await this.loadLeaveRequestsIfEmployeeExists();
  // };

  ngOnDestroy(): void {
    // cleanup logic if needed later
  }

  private async loadLeaveRequestsIfEmployeeExists(): Promise<void> {
    try {
      // this.isLoading = true;
      this.loadingService.show();
      this.companyRef = Number(this.appStateManagement.localStorage.getItem('SelectedCompanyRef'));
      this.Entity.p.EmployeeRef = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'));
      if (this.Entity.p.EmployeeRef > 0) {
        const editMode = this.appStateManage.localStorage.getItem('Editable') === 'Edit';

        this.IsNewEntity = !editMode;
        this.DetailsFormTitle = editMode ? 'Edit Leave Request' : 'New Leave Request';

        if (editMode) {
          this.Entity = LeaveRequest.GetCurrentInstance();
          this.fromDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.FromDate);
          this.toDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.ToDate);
          this.Entity.p.UpdatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'));
          this.appStateManage.localStorage.removeItem('Editable');
        } else {
          this.EmployeeRef = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'));
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
        // await this.uiUtils.showErrorToster('Employee not selected');
        await this.toastService.present('Employee not selected', 1000, 'danger');
        await this.haptic.error();
      }
    } catch (error) {


    } finally {
      // this.isLoading = false;
      this.loadingService.hide();
    }
  }

  private async getSingleEmployeeDetails(): Promise<void> {
    try {
      // if (this.companyRef() <= 0) {
      //   await this.uiUtils.showErrorToster('Company not Selected');
      //   return;
      // }
      if (this.companyRef <= 0) {
        // await this.uiUtils.showErrorToster('Company not Selected');
        await this.toastService.present('Company not Selected', 1000, 'danger');
        await this.haptic.error();
        return;
      }
      const employee = await Employee.FetchInstance(
        this.EmployeeRef, this.companyRef,
        async (errMsg) =>{
          await this.toastService.present(errMsg, 1000, 'danger')
          await this.haptic.error()
        }
      );

      this.Entity.p.EmployeeRef = employee.p.Ref;
      this.Entity.p.EmployeeName = employee.p.Name;
      this.TotalWorkingHrs = employee.p.TotalWorkingHrs;
    } catch (error) {

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
  // onDateChange(event: any) {
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

        this.SelectedLeaveType = selected;
        this.Entity.p.LeaveRequestType = selected[0]?.p?.Ref;
        this.Entity.p.LeaveRequestName = selected[0]?.p?.Name;
        this.onLeaveRequestTypeChanged();
      });
    } catch (error) {

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
      // this.isLoading = true;
      this.loadingService.show();

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
        // this.uiUtils.showErrorMessage('Error', tr.Message);
        await this.toastService.present(tr.Message, 1000, 'danger');
        await this.haptic.error();
        return;
      }

      this.isSaveDisabled = false;
      // await this.uiUtils.showSuccessToster('Leave Request saved successfully');
      await this.toastService.present('Leave Request saved successfully', 1000, 'success');
      await this.haptic.success();
      this.Entity = LeaveRequest.CreateNewInstance();
      this.SelectedLeaveType = [];
      this.resetForm();
      await this.router.navigate(['/mobileapp/tabs/attendance/leave'], { replaceUrl: true });
    } catch (error) {

    } finally {
      // this.isLoading = false;
      this.loadingService.hide();
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


  isDataFilled(): boolean {
    const emptyEntity = LeaveRequest.CreateNewInstance();
    console.log('emptyEntity :', emptyEntity);
    console.log('this Entity :', this.Entity);
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

    const cleanedObj1 = clean(obj1);
    const cleanedObj2 = clean(obj2);

    return JSON.stringify(cleanedObj1) === JSON.stringify(cleanedObj2);
  }

  goBack = async () => {
    // Replace this with your actual condition to check if data is filled
    const isDataFilled = this.isDataFilled(); // Implement this function based on your form

    if (isDataFilled) {
      await this.uiUtils.showConfirmationMessage(
        'Warning',
        `You have unsaved data. Are you sure you want to go back? All data will be lost.`,
        async () => {
          this.router.navigate(['/mobileapp/tabs/attendance/leave'], { replaceUrl: true });
        }
      );
    } else {
      this.router.navigate(['/mobileapp/tabs/attendance/leave'], { replaceUrl: true });
    }
  }
}
