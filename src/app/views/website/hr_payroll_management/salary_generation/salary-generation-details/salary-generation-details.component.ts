import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import {
  SalaryGeneration,
  SalaryGenerationProps,
} from 'src/app/classes/domain/entities/website/HR_and_Payroll/Salary_Generation/salarygeneration';
import { SalaryGenerationCustomRequest } from 'src/app/classes/domain/entities/website/HR_and_Payroll/Salary_Generation/salarygenerationcustomrequest';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';

@Component({
  selector: 'app-salary-generation-details',
  standalone: false,
  templateUrl: './salary-generation-details.component.html',
  styleUrls: ['./salary-generation-details.component.scss'],
})
export class SalaryGenerationDetailsComponent implements OnInit {
  Entity: SalaryGeneration = SalaryGeneration.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Salary Details' | 'Edit Salary Details' =
    'New Salary Details';
  IsDropdownDisabled: boolean = false;
  InitialEntity: SalaryGeneration = null as any;
  EmployeeList: Employee[] = [];
  MonthList = DomainEnums.MonthList(true, '---Select Month---');
  isEmployeeDisabled: boolean = false;
  companyName = this.companystatemanagement.SelectedCompanyName;
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  GrossTotal = 0;
  LateMarkDays: number = 0;
  Holidays: number = 0;
  HolidaysSalary: number = 0;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement,
    private serverCommunicator: ServerCommunicatorService,
    private payloadPacketFacade: PayloadPacketFacade
  ) {}

  ngOnInit() {
    this.getEmployeeListByCompanyRef();
    this.appStateManage.setDropdownDisabled(true);
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.isEmployeeDisabled = true;
      this.DetailsFormTitle = this.IsNewEntity
        ? 'New Salary Details'
        : 'Edit Salary Details';
      this.Entity = SalaryGeneration.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');
      this.Entity.p.UpdatedBy = Number(
        this.appStateManage.StorageKey.getItem('LoginEmployeeRef')
      );
    } else {
      this.Entity = SalaryGeneration.CreateNewInstance();
      SalaryGeneration.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(
      SalaryGeneration.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as SalaryGeneration;
    this.focusInput();
  }

  focusInput = () => {
    let txtName = document.getElementById('EmployeeRef')!;
    txtName.focus();
  };

  getEmployeeListByCompanyRef = async () => {
    let lst = await Employee.FetchEntireListByCompanyRef(
      this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.EmployeeList = lst;
  };

  calculategrosstotal = () => {
    const Total =
      this.GrossTotal +
      this.Entity.p.TotalAllowance +
      this.Entity.p.TotalIncentive +
      this.Entity.p.Other;
    this.Entity.p.GrossTotal = parseFloat(Total.toFixed(2));
    this.calculatenetsalary();
  };

  calculatetotaldeduction = () => {
    const tds = Number(this.Entity.p.TDS) || 0;
    const pf = Number(this.Entity.p.PF) || 0;
    const advance = Number(this.Entity.p.AdvanceDeduction) || 0;
    const advancepayment = Number(this.Entity.p.AdvancePayment) || 0;
    const totalleavededuction = Number(this.Entity.p.TotalLeaveDeduction) || 0;

    const TotalDeduction = tds + pf + advance + totalleavededuction;
    const RemainingAdvance = advancepayment - advance;

    this.Entity.p.RemainingAdvance = parseFloat(RemainingAdvance.toFixed(2));
    this.Entity.p.TotalDeduction = parseFloat(TotalDeduction.toFixed(2));
    this.calculatenetsalary();
  };

  calculatenetsalary = () => {
    const tds = Number(this.Entity.p.TDS) || 0;
    const pf = Number(this.Entity.p.PF) || 0;
    const advance = Number(this.Entity.p.AdvanceDeduction) || 0;
    const SalaryDeduction = tds + pf + advance;
    const NetSalary = this.Entity.p.GrossTotal - SalaryDeduction;

    this.Entity.p.NetSalary = parseFloat(NetSalary.toFixed(2));
  };

  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  ClearValues = () => {
    this.Entity.p.TotalAllowance = 0;
    this.Entity.p.TotalIncentive = 0;
    this.Entity.p.Other = 0;
    this.Entity.p.PF = 0;
    this.Entity.p.TDS = 0;
    this.Entity.p.AdvanceDeduction = 0;
    this.calculategrosstotal();
    this.calculatetotaldeduction();
  };

  EmployeeData = async (employee: number, month: number) => {
    if (month != 0) {
      const selectedMonthData = this.MonthList.find((m) => m.Ref === month);
      if (selectedMonthData) {
        this.Entity.p.TotalDays = selectedMonthData.Days;
      }
    } else {
      this.Entity.p.TotalDays = 0;
    }
    this.Entity.p.TotalWorkingDays = 0;
    this.Entity.p.TotalOverTimeHrs = 0;
    this.Entity.p.BasicSalary = 0;
    this.Entity.p.AdvancePayment = 0;
    if (employee === 0 || month === 0) {
      return;
    }
    let lst = await SalaryGeneration.FetchEmployeeDataByEmployeeRefandMonth(
      this.companyRef(),
      employee,
      month,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );

    if (lst.length > 0) {
      this.Entity.p.TotalWorkingDays = Number(lst[0].p.TotalWorkingDays);
      this.Entity.p.BasicSalary = Number(lst[0].p.BasicSalary);
      this.Entity.p.TotalLeaveDeduction = Number(lst[0].p.TotalLeaveDeduction);
      this.Entity.p.AdvancePayment = Number(lst[0].p.AdvancePayment);
      this.Entity.p.TotalOverTimeHrs = Number(lst[0].p.TotalOverTimeHrs);
      this.Entity.p.DisplayTotalOverTimeHrs = lst[0].p.DisplayTotalOverTimeHrs;
      this.Entity.p.OverTimeHrsRate = Number(lst[0].p.OverTimeHrsRate);
      this.Entity.p.TotalOverTimeSalary = Number(lst[0].p.TotalOverTimeSalary);
      this.Entity.p.TotalWorkedDays = Number(lst[0].p.TotalWorkedDays);
      this.Entity.p.HalfDaySystemGeneratedTotalWorkingHrs = Number(
        lst[0].p.HalfDaySystemGeneratedTotalWorkingHrs
      );
      this.Entity.p.FullDaySystemGeneratedTotalWorkingHrs = Number(
        lst[0].p.FullDaySystemGeneratedTotalWorkingHrs
      );
      this.Entity.p.TotalFullDayLeavesWithAbsent = Number(
        lst[0].p.TotalFullDayLeavesWithAbsent
      );
      this.Entity.p.HalfDayLeaves = Number(lst[0].p.HalfDayLeaves);
      this.Entity.p.FullDayWorked = Number(lst[0].p.FullDayWorked);
      this.Entity.p.TotalFullDaysSalary = Number(lst[0].p.TotalFullDaysSalary);
      this.Entity.p.HalfDaysIncludingLateMarks = Number(
        lst[0].p.HalfDaysIncludingLateMarks
      );
      this.Entity.p.TotalHalfDaysAndLateMarkDaysSalary = Number(
        lst[0].p.TotalHalfDaysAndLateMarkDaysSalary
      );
      this.Entity.p.RemainingAdvance = Number(lst[0].p.RemainingAdvance);
      this.Entity.p.TotalDeduction = Number(lst[0].p.TotalLeaveDeduction);
      this.Entity.p.GrossTotal = Number(lst[0].p.GrossTotal);
      this.GrossTotal = Number(lst[0].p.GrossTotal);
      this.LateMarkDays =
        Number(lst[0].p.HalfDaysIncludingLateMarks) -
        Number(lst[0].p.HalfDayLeaves);
      this.Holidays =
        Number(lst[0].p.TotalDays) - Number(lst[0].p.TotalWorkingDays);
      this.HolidaysSalary =
        Math.round(
          (Number(lst[0].p.GrossTotal) -
            Number(lst[0].p.TotalFullDaysSalary) -
            Number(lst[0].p.TotalHalfDaysAndLateMarkDaysSalary)) *
            100
        ) / 100;

      await this.calculatetotaldeduction();
    }
  };

  SaveSalaryGeneration = async () => {
    this.Entity.p.CompanyRef =
      this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName =
      this.companystatemanagement.getCurrentCompanyName();
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(
        this.appStateManage.StorageKey.getItem('LoginEmployeeRef')
      );
      this.Entity.p.UpdatedBy = Number(
        this.appStateManage.StorageKey.getItem('LoginEmployeeRef')
      );
    }
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];

    let tr = await this.utils.SavePersistableEntities(entitiesToSave);

    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    } else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster(
          'Salary Generation Details saved successfully'
        );
        this.Entity = SalaryGeneration.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster(
          'Salary Generation Details Updated successfully'
        );
        await this.router.navigate(['/homepage/Website/Salary_Generation']);
      }
    }
  };

  BackSalaryGenaration = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage(
        'Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Salary Generation Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Salary_Generation']);
        }
      );
    } else {
      await this.router.navigate(['/homepage/Website/Salary_Generation']);
    }
  };
}
