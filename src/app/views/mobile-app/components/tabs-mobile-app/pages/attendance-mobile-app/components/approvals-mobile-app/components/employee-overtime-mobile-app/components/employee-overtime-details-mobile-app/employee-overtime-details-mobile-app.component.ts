import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeOvertime } from 'src/app/classes/domain/entities/website/HR_and_Payroll/Employee_Overtime/employeeovertime';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BottomsheetMobileAppService } from 'src/app/services/bottomsheet-mobile-app.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { Utils } from 'src/app/services/utils.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';

@Component({
  selector: 'app-employee-overtime-details-mobile-app',
  templateUrl: './employee-overtime-details-mobile-app.component.html',
  styleUrls: ['./employee-overtime-details-mobile-app.component.scss'],
  standalone: false,
})
export class EmployeeOvertimeDetailsMobileAppComponent implements OnInit {
  Entity: EmployeeOvertime = EmployeeOvertime.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Employee Overtime' | 'Edit Employee Overtime' =
    'New Employee Overtime';
  Date: string | null = null;
  strCDT: string = '';
  InitialEntity: EmployeeOvertime = null as any;
  EmployeeList: Employee[] = [];
  companyName = this.companystatemanagement.SelectedCompanyName;
  companyRef = 0;
  EmployeeName: string = '';
  selectedEmployee: any[] = [];

  FromTime: string | null = null;
  ToTime: string | null = null;

  constructor(
    private router: Router,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private dtu: DTU,
    private companystatemanagement: CompanyStateManagement,
    private bottomsheetMobileAppService: BottomsheetMobileAppService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private datePipe: DatePipe
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadEmployeeOvertimeIfEmployeeExists();
  }

  ngOnDestroy(): void {}

  private async loadEmployeeOvertimeIfEmployeeExists(): Promise<void> {
    try {
      this.companyRef = Number(
        this.appStateManage.localStorage.getItem('SelectedCompanyRef')
      );
      this.appStateManage.setDropdownDisabled(true);
      this.getEmployeeListByCompanyRef();
      if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
        this.IsNewEntity = false;
        this.DetailsFormTitle = this.IsNewEntity
          ? 'New Employee Overtime'
          : 'New Employee Overtime';
        this.Entity = EmployeeOvertime.GetCurrentInstance();
        this.appStateManage.StorageKey.removeItem('Editable');
        this.Entity.p.UpdatedBy = Number(
          this.appStateManage.StorageKey.getItem('LoginEmployeeRef')
        );
        this.Date = this.Entity.p.Date
          ? this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date)
          : null;
        this.FromTime = this.convertHHMMToISOString(this.Entity.p.FromTime);
        this.ToTime = this.convertHHMMToISOString(this.Entity.p.ToTime);
        this.calculateOvertimeHours();
        this.selectedEmployee = [
          {
            p: {
              Ref: this.Entity.p.EmployeeRef,
              Name: this.Entity.p.EmployeeRef,
            },
          },
        ];
        this.EmployeeName = this.Entity.p.EmployeeName;
      } else {
        this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
        let parts = this.strCDT.substring(0, 16).split('-');
        // Construct the new date format
        this.Date = `${parts[0]}-${parts[1]}-${parts[2]}`;
        this.Entity = EmployeeOvertime.CreateNewInstance();
        EmployeeOvertime.SetCurrentInstance(this.Entity);
      }
      this.InitialEntity = Object.assign(
        EmployeeOvertime.CreateNewInstance(),
        this.utils.DeepCopy(this.Entity)
      ) as EmployeeOvertime;
    } catch (error) {}
  }

  public async onDateChange(date: any): Promise<void> {
    this.Date = this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
    this.Entity.p.Date = this.Date;
  }

  public async selectEmployeeBottomsheet(): Promise<void> {
    try {
      const options = this.EmployeeList;
      this.openSelectModal(
        options,
        this.selectedEmployee,
        false,
        'Select Site',
        1,
        (selected) => {
          this.selectedEmployee = selected;
          this.Entity.p.EmployeeRef = selected[0].p.Ref;
          this.EmployeeName = selected[0].p.Name;
        }
      );
    } catch (error) {}
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

  FromTimeChange = (value: string) => {
    this.FromTime = value;
    this.Entity.p.FromTime = this.formatTimeToHHMM(value);
    this.calculateOvertimeHours();
  };

  ToTimeChange = (value: string) => {
    if (!this.FromTime) {
      const now = new Date();
      this.FromTimeChange(this.formatToTrimmedISOString(now.toISOString()));
    }
    this.ToTime = value;
    this.Entity.p.ToTime = this.formatTimeToHHMM(value);
    this.calculateOvertimeHours();
  };

  formatTimeToHHMM = (isoString: string): string => {
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  formatToTrimmedISOString = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:00`;
  };

  convertHHMMToISOString = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);
    return this.formatToTrimmedISOString(now.toISOString());
  };

  calculateOvertimeHours = () => {
    const start = this.Entity.p.FromTime;
    const end = this.Entity.p.ToTime;

    if (start && end) {
      const [startHour, startMin] = start.split(':').map(Number);
      const [endHour, endMin] = end.split(':').map(Number);

      const startDate = new Date();
      startDate.setHours(startHour, startMin, 0);

      const endDate = new Date();
      endDate.setHours(endHour, endMin, 0);

      let diffMs = endDate.getTime() - startDate.getTime();

      // If end time is before start time, assume it's the next day
      if (diffMs < 0) {
        endDate.setDate(endDate.getDate() + 1);
        diffMs = endDate.getTime() - startDate.getTime();
      }

      const diffMinutes = diffMs / (1000 * 60); // convert ms to hours
      // HH:mm format
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;

      this.Entity.p.OverTimeInHrs = +diffMinutes;
      this.Entity.p.DisplayOverTime = `${hours}h ${minutes
        .toString()
        .padStart(2, '0')}m`;
    } else {
      this.Entity.p.OverTimeInHrs = 0;
      this.Entity.p.DisplayOverTime = `0h 0m`;
    }
  };

  getEmployeeListByCompanyRef = async () => {
    let lst = await Employee.FetchEntireListByCompanyRef(
      this.companyRef,
      async (errMsg) => {
        await this.toastService.present('Error' + errMsg);
      }
    );
    this.EmployeeList = lst;
  };

  SaveEmployeeOvertime = async () => {
    this.isSaveDisabled = true;
    this.Entity.p.CompanyRef = Number(
      this.appStateManage.localStorage.getItem('SelectedCompanyRef')
    );
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(
        this.appStateManage.localStorage.getItem('LoginEmployeeRef')
      );
      this.Entity.p.UpdatedBy = Number(
        this.appStateManage.localStorage.getItem('LoginEmployeeRef')
      );
    }
    this.Entity.p.Date = this.dtu.ConvertStringDateToFullFormat(
      this.Date ? this.Date : ''
    );
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      await this.toastService.present('Error' + tr.Message, 1000, 'danger');

      return;
    } else {
      if (this.IsNewEntity) {
        await this.toastService.present(
          'Employee Overtime saved successfully',
          1000,
          'success'
        );
        await this.router.navigate(
          ['/mobile-app/tabs/attendance/approvals/employee-overtime'],
          { replaceUrl: true }
        );
        this.Entity = EmployeeOvertime.CreateNewInstance();
      } else {
        await this.toastService.present(
          'Employee Overtime  Updated successfully',
          1000,
          'success'
        );
        await this.router.navigate(
          ['/mobile-app/tabs/attendance/approvals/employee-overtime'],
          { replaceUrl: true }
        );
      }
    }
  };

  private resetForm(): void {
    // this.fromDate = this.toDate = this.halfDayDate = '';
    // // this.fromDisplayDate = this.toDisplayDate = this.halfDisplayDate = '';
    // this.isHalfDay = false;
    // this.Entity = LeaveRequest.CreateNewInstance();
    // this.SelectedLeaveType = [];
  }

  isDataFilled(): boolean {
    const emptyEntity = EmployeeOvertime.CreateNewInstance();
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
      this.alertService.presentDynamicAlert({
        header: 'Warning',
        subHeader: 'Confirmation needed',
        message:
          'You have unsaved data. Are you sure you want to go back? All data will be lost.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'custom-cancel',
            handler: async () => {
            },
          },
          {
            text: 'Yes, Close',
            cssClass: 'custom-confirm',
            handler: async () => {
              this.router.navigate(
                ['/mobile-app/tabs/attendance/approvals/employee-overtime'],
                { replaceUrl: true }
              );
            },
          },
        ],
      });
    } else {
      this.router.navigate(
        ['/mobile-app/tabs/attendance/approvals/employee-overtime'],
        {
          replaceUrl: true,
        }
      );
    }
  };
}
