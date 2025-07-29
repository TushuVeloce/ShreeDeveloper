import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages } from 'src/app/classes/domain/constants';
import { OfficeDutyandTime } from 'src/app/classes/domain/entities/website/HR_and_Payroll/Office_Duty_and_Time/officedutyandtime';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-office-duty-time-details',
  standalone: false,
  templateUrl: './office-duty-time-details.component.html',
  styleUrls: ['./office-duty-time-details.component.scss'],
})
export class OfficeDutyTimeDetailsComponent implements OnInit {
  Entity: OfficeDutyandTime = OfficeDutyandTime.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Office Duty and Time' | 'Edit Office Duty and Time' = 'New Office Duty and Time';
  IsDropdownDisabled: boolean = false;
  InitialEntity: OfficeDutyandTime = null as any;
  companyName = this.companystatemanagement.SelectedCompanyName;
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  localFromTime: string = '';
  localToTime: string = '';
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg;

  FromTime: Date | null = null;
  ToTime: Date | null = null;

  @ViewChild('officedutyandtimeForm') officedutyandtimeForm!: NgForm;
  @ViewChild('FromTimeCtrl') FromTimeInputControl!: NgModel;
  @ViewChild('ToTimeCtrl') ToTimeInputControl!: NgModel;
  @ViewChild('LateMarkGraceTimeInMinsCtrl')
  LateMarkGraceTimeInMinsInputControl!: NgModel;
  @ViewChild('OvertimeGraceTimeInMinsCtrl')
  OvertimeGraceTimeInMinsInputControl!: NgModel;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement,
  ) { }

  ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity
        ? 'New Office Duty and Time'
        : 'New Office Duty and Time';
      this.Entity = OfficeDutyandTime.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');
      this.Entity.p.UpdatedBy = Number(
        this.appStateManage.StorageKey.getItem('LoginEmployeeRef')
      );

      this.FromTime = this.convertToFullTime(this.Entity.p.FromTime);
      this.ToTime = this.convertToFullTime(this.Entity.p.ToTime);

    } else {
      this.Entity = OfficeDutyandTime.CreateNewInstance();
      OfficeDutyandTime.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(
      OfficeDutyandTime.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as OfficeDutyandTime;
    // this.focusInput();
  }

  convertToFullTime(timeStr: string): Date {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
  }


  convertIOS12To24HoursFormat = (value: Date | null) => {
    if (value) {
      const hours = value.getHours().toString().padStart(2, '0');
      const minutes = value.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } else {
      return '';
    }

    // const isPM = value.getHours() >= 12;
    // const hours12 = (value.getHours() % 12 || 12).toString().padStart(2, '0');
    // const time12 = `${hours12}:${minutes} ${isPM ? 'PM' : 'AM'}`;
    // console.log('Time in 12-hour format:', time12);
  };

  getFromTime = () => {
    this.Entity.p.FromTime = this.convertIOS12To24HoursFormat(this.FromTime);
  }

  getToTime = () => {
    this.Entity.p.ToTime = this.convertIOS12To24HoursFormat(this.ToTime);
  }

  focusInput = () => {
    let txtName = document.getElementById('FromTime')!;
    txtName.focus();
  };

  SaveOfficeDutyTimeMaster = async () => {
    this.Entity.p.CompanyRef =
      this.companystatemanagement.getCurrentCompanyRef();
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
          'Office Duty and Time saved successfully'
        );
        this.Entity = OfficeDutyandTime.CreateNewInstance();
        this.resetAllControls();
      } else {
        await this.uiUtils.showSuccessToster(
          'Office Duty and Time  Updated successfully'
        );
        await this.router.navigate(['/homepage/Website/Office_Duty_Time']);
      }
    }
  };

  BackOfficeTime = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Office Duty Time Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Office_Duty_Time']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Office_Duty_Time']);
    }
  }

  resetAllControls() {
    this.officedutyandtimeForm.resetForm(); // this will reset all form controls to their initial state
  }
}
