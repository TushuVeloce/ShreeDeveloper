import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Kajapa } from 'src/app/classes/domain/entities/website/government_office/kajapa/kajapa';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-k-ja-pa',
  templateUrl: './k-ja-pa.component.html',
  styleUrls: ['./k-ja-pa.component.scss'],
  standalone: false,
})
export class KJaPaComponent implements OnInit {

  SiteRef: number = 0;
  SiteName: string = '';

  Entity: Kajapa = Kajapa.CreateNewInstance();
  isSaveDisabled: boolean = false;
  IsDropdownDisabled: boolean = true;
  InitialEntity: Kajapa = null as any;
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

    this.getKajapaListByCompanyAndSiteRef();

    this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))

    this.InitialEntity = Object.assign(Kajapa.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as Kajapa;
  }

  getKajapaListByCompanyAndSiteRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    if (this.SiteRef <= 0) {
      await this.uiUtils.showErrorToster('Site not Selected');
      return;
    }
    let lst = await Kajapa.FetchEntireListByCompanyAndSiteRef(this.companyRef(), this.SiteRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    if (lst.length > 0) {
      this.Entity = lst[0];

      if (this.Entity.p.TPPatraInwardDate != '') {
        this.Entity.p.TPPatraInwardDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.TPPatraInwardDate)
      }

      if (this.Entity.p.TehsilDate != '') {
        this.Entity.p.TehsilDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.TehsilDate)
      }

      if (this.Entity.p.CircleInwardDate != '') {
        this.Entity.p.CircleInwardDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.CircleInwardDate)
      }
    } else {
      await this.router.navigate(['/homepage/Website/Site_Progress_Report']);
    }
  }

  areAllSubmissionsComplete(Entity: any): boolean {
    let status = false;

    const requiredFields = [
      'IsTPPatraSubmit',
      'IsFinalOrdervaNakashaSubmit',
      'IsSaatBaaraUtaraSubmit',
      'IsKaPratSubmit',
      'IsParishishtaANASubmit',
      'IsTehsilSubmit',
      'IsCircleSubmit',
    ];

    status = requiredFields.every(field => Entity.p?.[field] === true);
    return status;
  }


  SaveKajapa = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
    this.Entity.p.TPPatraInwardDate = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.TPPatraInwardDate)
    this.Entity.p.TehsilDate = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.TehsilDate)
    this.Entity.p.CircleInwardDate = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.CircleInwardDate)

    this.Entity.p.IsKajapaComplete = this.areAllSubmissionsComplete(this.Entity);
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    } else {
      this.isSaveDisabled = false;
      await this.uiUtils.showSuccessToster('T.P. Office Updated successfully');
      await this.router.navigate(['/homepage/Website/Site_Progress_Report']);
    }
  };

  BackProgressReport = async () => {
    await this.router.navigate(['/homepage/Website/Site_Progress_Report']);
  }
}


