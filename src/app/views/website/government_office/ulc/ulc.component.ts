import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ULC } from 'src/app/classes/domain/entities/website/government_office/ulc/ulc';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-ulc',
  templateUrl: './ulc.component.html',
  styleUrls: ['./ulc.component.scss'],
  standalone: false,
})
export class UlcComponent implements OnInit {


  SiteRef: number = 0;
  SiteName: string = '';

  Entity: ULC = ULC.CreateNewInstance();
  isSaveDisabled: boolean = false;
  IsDropdownDisabled: boolean = true;
  InitialEntity: ULC = null as any;
  companyRef = this.companystatemanagement.SelectedCompanyRef;

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

  async ngOnInit() {
    this.SiteRef = history.state.SiteRef;

    this.getULCListByCompanyAndSiteRef();

    this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))

    this.InitialEntity = Object.assign(ULC.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as ULC;
  }


  getULCListByCompanyAndSiteRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    if (this.SiteRef <= 0) {
      await this.uiUtils.showErrorToster('Site not Selected');
      return;
    }
    let lst = await ULC.FetchEntireListByCompanyAndSiteRef(this.companyRef(), this.SiteRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    if (lst.length > 0) {
      this.Entity = lst[0];

      if (this.Entity.p.UlcDate != '') {
        this.Entity.p.UlcDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.UlcDate)
      }

      if (this.Entity.p.TpOfficeDate != '') {
        this.Entity.p.TpOfficeDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.TpOfficeDate)
      }

      if (this.Entity.p.OutwardDate != '') {
        this.Entity.p.OutwardDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.OutwardDate)
      }
    } else {
      await this.router.navigate(['/homepage/Website/Site_Progress_Report']);
    }
  }


  areAllSubmissionsComplete(Entity: any): boolean {
    let status = false;

    const requiredFields = [
      'IsUlcTpPatraSubmit',
      'IsSaatBaraSubmit',
      'IsTatpurtiOrderVaNakashaSubmit',
      'IsSanadBinshetiSubmit',
      'IsPratigyaPatraSubmit',
      'IsOutwardsubmit',
      'IsMojniTarikhSubmit',
      'IsChalanSubmit',
      'IsTpOfficeSubmit',
    ];

    status = requiredFields.every(field => Entity.p?.[field] === true);
    return status;
  }


  SaveULC = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
    this.Entity.p.UlcDate = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.UlcDate)
    this.Entity.p.TpOfficeDate = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.TpOfficeDate)
    this.Entity.p.OutwardDate = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.OutwardDate)

    this.Entity.p.IsGovernmentUlcComplete = this.areAllSubmissionsComplete(this.Entity);
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    } else {
      this.isSaveDisabled = false;
      await this.uiUtils.showSuccessToster('ULC Updated successfully');
      await this.router.navigate(['/homepage/Website/Site_Progress_Report']);
    }
  };

  BackProgressReport = async () => {
    await this.router.navigate(['/homepage/Website/Site_Progress_Report']);
  }
}



