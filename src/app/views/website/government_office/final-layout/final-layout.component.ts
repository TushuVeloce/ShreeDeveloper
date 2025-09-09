import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FinalLayout } from 'src/app/classes/domain/entities/website/government_office/finallayout/finallayout';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-final-layout',
  templateUrl: './final-layout.component.html',
  styleUrls: ['./final-layout.component.scss'],
  standalone: false,

})
export class FinalLayoutComponent implements OnInit {

  SiteRef: number = 0;
  SiteName: string = '';

  Entity: FinalLayout = FinalLayout.CreateNewInstance();
  isSaveDisabled: boolean = false;
  IsDropdownDisabled: boolean = true;
  InitialEntity: FinalLayout = null as any;
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

    this.getFinalLayoutListByCompanyAndSiteRef();

    this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))

    this.InitialEntity = Object.assign(FinalLayout.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as FinalLayout;
  }

  getFinalLayoutListByCompanyAndSiteRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    if (this.SiteRef <= 0) {
      await this.uiUtils.showErrorToster('Site not Selected');
      return;
    }
    let lst = await FinalLayout.FetchEntireListByCompanyAndSiteRef(this.companyRef(), this.SiteRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    if (lst.length > 0) {
      this.Entity = lst[0];
      if (this.Entity.p.ArjInwardDate != '') {
        this.Entity.p.ArjInwardDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.ArjInwardDate)
      }

      if (this.Entity.p.OutwardDate != '') {
        this.Entity.p.OutwardDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.OutwardDate)
      }

      if (this.Entity.p.GramSevakInwardDate != '') {
        this.Entity.p.GramSevakInwardDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.GramSevakInwardDate)
      }

      if (this.Entity.p.TahsilInwardDate != '') {
        this.Entity.p.TahsilInwardDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.TahsilInwardDate)
      }

      if (this.Entity.p.MojniInwardDate != '') {
        this.Entity.p.MojniInwardDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.MojniInwardDate)
      }
    } else {
      await this.router.navigate(['/homepage/Website/Site_Progress_Report']);
    }
  }

  areAllSubmissionsComplete(Entity: any): boolean {
    let status = false;

    const requiredFields = [
      'IsFromSubmit',
      'IsSaatBaaraUtaraSubmit',
      'IsTentativeOrdervaNakashaSubmit',
      'IsSanadBinshetiSubmit',
      'IsKaPratSubmit',
      'IsULCSubmit',
      'IsHamiPatraSubmit',
      'IsBandhPatraSubmit',
      'IsRastavaKhuliJagaKabjepattiSubmit',
      'IsSurveyarRemarkSubmit',
      'IsATPSiteVisitSubmit',
      'IsADTPSiteVisitSubmit',
      'IsGramSevakSubmit',
      'IsTahshilSubmit',
      'IsMojniSubmit',
      'IsCopyReceiveSubmit',
    ];

    status = requiredFields.every(field => Entity.p?.[field] === true);

    if (status) {
      if (!Entity.p.IsRoadNOCSubmit) {
        status = true;
      } else {
        if (Entity.p.IsArjInwardSubmit && Entity.p.IsRoadNOCSaatBaaraUtaraSubmit && Entity.p.IsRoadNOCTentativeOrdervaNakashaSubmit) {
          status = true;
        } else {
          status = false;
        }
      }
    }

    return status;
  }

  ResetRoadNOC = () => {
    if (!this.Entity.p.IsRoadNOCSubmit) {
      this.Entity.p.IsArjInwardSubmit = false;
      this.Entity.p.IsRoadNOCSaatBaaraUtaraSubmit = false;
      this.Entity.p.IsRoadNOCTentativeOrdervaNakashaSubmit = false;
    }
  }


  SaveFinalLayout = async () => {
    this.isSaveDisabled = true;
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }

    this.Entity.p.ArjInwardDate = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.ArjInwardDate)
    this.Entity.p.OutwardDate = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.OutwardDate)
    this.Entity.p.GramSevakInwardDate = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.GramSevakInwardDate)
    this.Entity.p.TahsilInwardDate = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.TahsilInwardDate)
    this.Entity.p.MojniInwardDate = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.MojniInwardDate)


    this.Entity.p.IsFinalLayoutCompleted = this.areAllSubmissionsComplete(this.Entity);
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    } else {
      this.isSaveDisabled = false;
      await this.uiUtils.showSuccessToster('Final Layout Updated successfully');
      await this.router.navigate(['/homepage/Website/Site_Progress_Report']);
    }
  };

  BackProgressReport = async () => {
    await this.router.navigate(['/homepage/Website/Site_Progress_Report']);
  }
}




