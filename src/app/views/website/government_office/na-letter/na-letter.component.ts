import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TPOffice } from 'src/app/classes/domain/entities/website/government_office/tpoffice/tpoffice';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-na-letter',
  templateUrl: './na-letter.component.html',
  styleUrls: ['./na-letter.component.scss'],
  standalone: false,
})
export class NaLetterComponent implements OnInit {

  constructor(
    private router: Router,
    private baseUrl: BaseUrlService,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement,
    private dtu: DTU,
    private datePipe: DatePipe
  ) { }

  Entity: TPOffice = TPOffice.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  IsDropdownDisabled: boolean = false;
  InitialEntity: TPOffice = null as any;
  companyRef = this.companystatemanagement.SelectedCompanyRef;


  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.Entity = TPOffice.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    } else {
      this.Entity = TPOffice.CreateNewInstance();
      TPOffice.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(TPOffice.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as TPOffice;
  }


  SaveTPOffice = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
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
        await this.uiUtils.showSuccessToster('TPOffice saved successfully');
        this.Entity = TPOffice.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster('TPOffice Updated successfully');
        await this.router.navigate(['/homepage/Website/Site_Progress_Report']);
      }
    }
  };

  BackProgressReport = async () => {
    await this.router.navigate(['/homepage/Website/Site_Progress_Report']);
  }
}

