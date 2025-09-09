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
  selector: 'app-tp-office',
  templateUrl: './tp-office.component.html',
  styleUrls: ['./tp-office.component.scss'],
  standalone: false,
})
export class TpOfficeComponent implements OnInit {

  SiteRef: number = 0;
  SiteName: string = '';
  Entity: TPOffice = TPOffice.CreateNewInstance();
  isSaveDisabled: boolean = false;
  IsDropdownDisabled: boolean = true;
  InitialEntity: TPOffice = null as any;
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

    this.getTPOfficeListByCompanyAndSiteRef();

    this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'));

    this.InitialEntity = Object.assign(TPOffice.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as TPOffice;
  }


  getTPOfficeListByCompanyAndSiteRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    if (this.SiteRef <= 0) {
      await this.uiUtils.showErrorToster('Site not Selected');
      return;
    }
    let lst = await TPOffice.FetchEntireListByCompanyAndSiteRef(this.companyRef(), this.SiteRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    if (lst.length > 0) {
      this.Entity = lst[0];
      if (this.Entity.p.TentativeLayoutInwardDate != '') {
        this.Entity.p.TentativeLayoutInwardDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.TentativeLayoutInwardDate)
      }

      if (this.Entity.p.ParishisthaNaUlcInwardDate != '') {
        this.Entity.p.ParishisthaNaUlcInwardDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.ParishisthaNaUlcInwardDate)
      }

      if (this.Entity.p.MojniInwardDate != '') {
        this.Entity.p.MojniInwardDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.MojniInwardDate)
      }

      if (this.Entity.p.GramSevakInwardDate != '') {
        this.Entity.p.GramSevakInwardDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.GramSevakInwardDate)
      }

      if (this.Entity.p.ULCInwardDate != '') {
        this.Entity.p.ULCInwardDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.ULCInwardDate)
      }

      if (this.Entity.p.ReportNOCInwardDate != '') {
        this.Entity.p.ReportNOCInwardDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.ReportNOCInwardDate)
      }

      if (this.Entity.p.AirportNOCInwardDate != '') {
        this.Entity.p.AirportNOCInwardDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.AirportNOCInwardDate)
      }
    } else {
      await this.router.navigate(['/homepage/Website/Site_Progress_Report']);
    }
  }

  areAllSubmissionsComplete(Entity: any): boolean {
    let status = false;

    const requiredFields = [
      'IsTentativeLayoutSubmit',
      'IsTentativeLayoutScrutinyFeesSubmit',
      'IsSurveyRemarkSubmit',
      'IsATPSiteVisitSubmit',
      'IsADTPSiteVisitSubmit',
      'IsDDTPSiteVisitSubmit',
      'IsProposalSanctionSubmit',
      'IsDevelopmentChargesSubmit',
      'IsSubmitToTahsildar',
      'IsSubmitToUpadhaykshaAndBhumiAdhilekh',
      'IsGramSevakSubmit',
      'IsULCSubmit',
    ];

    status = requiredFields.every(field => Entity.p?.[field] === true);
    if (status) {
      if (!Entity.p.ReportNOCAirportNOC) {
        status = true;
      } else {
        status = Entity.p.IsReportNOCSubmit && Entity.p.IsAirportNOCSubmit;
      }
    }
    return status;
  }

  ResetNOC = () => {
    if (!this.Entity.p.ReportNOCAirportNOC) {
      this.Entity.p.IsReportNOCSubmit = false;
      this.Entity.p.IsAirportNOCSubmit = false;
    }
  }

  SaveTPOffice = async () => {
    this.isSaveDisabled = true;
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
    this.Entity.p.TentativeLayoutInwardDate = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.TentativeLayoutInwardDate)
    this.Entity.p.ParishisthaNaUlcInwardDate = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.ParishisthaNaUlcInwardDate)
    this.Entity.p.MojniInwardDate = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.MojniInwardDate)
    this.Entity.p.GramSevakInwardDate = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.GramSevakInwardDate)
    this.Entity.p.ULCInwardDate = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.ULCInwardDate)
    this.Entity.p.ReportNOCInwardDate = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.ReportNOCInwardDate)
    this.Entity.p.AirportNOCInwardDate = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.AirportNOCInwardDate)

    this.Entity.p.IsTPOfficeComplete = this.areAllSubmissionsComplete(this.Entity);
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
