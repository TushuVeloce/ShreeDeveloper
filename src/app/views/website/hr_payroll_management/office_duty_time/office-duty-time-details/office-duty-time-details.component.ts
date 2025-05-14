import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  localFromTime: string = ""
  localToTime: string = ""

  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils, private companystatemanagement: CompanyStateManagement) { }

  ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Office Duty and Time' : 'New Office Duty and Time';
      this.Entity = OfficeDutyandTime.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    } else {
      this.Entity = OfficeDutyandTime.CreateNewInstance();
      OfficeDutyandTime.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(
      OfficeDutyandTime.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as OfficeDutyandTime;
    this.focusInput();
  }

  focusInput = () => {
    let txtName = document.getElementById('FromTime')!;
    txtName.focus();
  }

  BackOfficeTime = async () => {
    this.router.navigate(['/homepage/Website/Office_Duty_Time']);
  }

  SaveOfficeDutyTimeMaster = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
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
        await this.uiUtils.showSuccessToster('Office Duty and Time saved successfully!');
        this.Entity = OfficeDutyandTime.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster('Office Duty and Time  Updated successfully!');
        await this.router.navigate(['/homepage/Website/Office_Duty_Time']);
      }
    }
  };
}
