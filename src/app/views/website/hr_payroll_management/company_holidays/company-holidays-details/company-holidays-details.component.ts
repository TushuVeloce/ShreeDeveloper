import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages } from 'src/app/classes/domain/constants';
import { CompanyHolidays } from 'src/app/classes/domain/entities/website/HR_and_Payroll/company_holidays/companyholidays';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-company-holidays-details',
  standalone: false,
  templateUrl: './company-holidays-details.component.html',
  styleUrls: ['./company-holidays-details.component.scss'],
})
export class CompanyHolidaysDetailsComponent implements OnInit {
  Entity: CompanyHolidays = CompanyHolidays.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Holiday' | 'Edit Holiday' = 'New Holiday';
  IsDropdownDisabled: boolean = false;
  InitialEntity: CompanyHolidays = null as any;
  companyName = this.companystatemanagement.SelectedCompanyName;
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg;

  @ViewChild('companyForm') companyForm!: NgForm;
  @ViewChild('DateCtrl') DateInputControl!: NgModel;
  @ViewChild('ReasonCtrl') ReasonInputControl!: NgModel;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement,
    private dtu: DTU,
  ) { }

  ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity
        ? 'New Holiday'
        : 'New Holiday';
      this.Entity = CompanyHolidays.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');
      this.Entity.p.UpdatedBy = Number(
        this.appStateManage.StorageKey.getItem('LoginEmployeeRef')
      );
      this.Entity.p.Date = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date)
    } else {
      this.Entity = CompanyHolidays.CreateNewInstance();
      CompanyHolidays.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(
      CompanyHolidays.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as CompanyHolidays;
    this.focusInput();
  }

  focusInput = () => {
    let txtName = document.getElementById('Date')!;
    txtName.focus();
  };

  // for value 0 selected while click on Input //
  selectAllValue = (event: MouseEvent): void => {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  SaveCompanyHoliday = async () => {
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
    this.Entity.p.Date = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.Date)
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    console.log('entitiesToSave :', entitiesToSave);
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
        this.Entity = CompanyHolidays.CreateNewInstance();
        this.resetAllControls();
      } else {
        await this.uiUtils.showSuccessToster(
          'Office Duty and Time  Updated successfully'
        );
        await this.router.navigate(['/homepage/Website/Plot_Master']);
      }
    }
  };

  BackCompanyHoliday = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Company Holidays Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Company_Holidays']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Company_Holidays']);
    }
  }

  resetAllControls() {
    this.companyForm.resetForm(); // this will reset all form controls to their initial state
  }
}
