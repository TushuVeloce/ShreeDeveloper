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
  isSaveDisabled: boolean = false;
  IsDropdownDisabled: boolean = true;
  InitialEntity: TPOffice = null as any;
  companyRef = this.companystatemanagement.SelectedCompanyRef;


  async ngOnInit() {

    this.SiteRef = history.state.SiteRef;

    this.getTPOfficeListByCompanyAndSiteRef();

    this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))

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
    console.log('lst :', lst);
    if (lst.length > 0) {
      this.Entity = lst[0];
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
    
    if (!Entity.p.ReportNOCAirportNOC && status) {
      status = true;
    } else {
      status = Entity.p.IsReportNOCSubmit && Entity.p.IsAirportNOCSubmit;
    }
    return status;
  }


  SaveTPOffice = async () => {
    // if (!this.Entity.p.IsTentativeLayoutSubmit) {
    //   await this.uiUtils.showErrorToster('IsTentativeLayoutSubmit not Selected');
    // }
    // if (!this.Entity.p.TentativeLayoutInwardNo) {
    //   await this.uiUtils.showErrorToster('TentativeLayoutInwardNo is empty');
    // }
    // if (!this.Entity.p.TentativeLayoutInwardDate) {
    //   await this.uiUtils.showErrorToster('TentativeLayoutInwardDate is empty');
    // }
    // if (!this.Entity.p.IsTentativeLayoutScrutinyFeesSubmit) {
    //   await this.uiUtils.showErrorToster('IsTentativeLayoutScrutinyFeesSubmit not Selected');
    // }
    // if (!this.Entity.p.IsSurveyRemarkSubmit) {
    //   await this.uiUtils.showErrorToster('IsSurveyRemarkSubmit not Selected');
    // }
    // if (!this.Entity.p.IsATPSiteVisitSubmit) {
    //   await this.uiUtils.showErrorToster('IsATPSiteVisitSubmit not Selected');
    // }
    // if (!this.Entity.p.IsADTPSiteVisitSubmit) {
    //   await this.uiUtils.showErrorToster('IsADTPSiteVisitSubmit not Selected');
    // }
    // if (!this.Entity.p.IsDDTPSiteVisitSubmit) {
    //   await this.uiUtils.showErrorToster('IsDDTPSiteVisitSubmit not Selected');
    // }
    // if (!this.Entity.p.IsProposalSanctionSubmit) {
    //   await this.uiUtils.showErrorToster('IsProposalSanctionSubmit not Selected');
    // }
    // if (!this.Entity.p.IsDevelopmentChargesSubmit) {
    //   await this.uiUtils.showErrorToster('IsDevelopmentChargesSubmit not Selected');
    // }
    // if (!this.Entity.p.IsSubmitToTahsildar) {
    //   await this.uiUtils.showErrorToster('IsSubmitToTahsildar not Selected');
    // }
    // if (!this.Entity.p.ParishisthaNaUlcInwardNo) {
    //   await this.uiUtils.showErrorToster('ParishisthaNaUlcInwardNo is empty');
    // }
    // if (!this.Entity.p.ParishisthaNaUlcInwardDate) {
    //   await this.uiUtils.showErrorToster('ParishisthaNaUlcInwardDate is empty');
    // }
    // if (!this.Entity.p.IsSubmitToUpadhaykshaAndBhumiAdhilekh) {
    //   await this.uiUtils.showErrorToster('IsSubmitToUpadhaykshaAndBhumiAdhilekh not Selected');
    // }
    // if (!this.Entity.p.MojniInwardNo) {
    //   await this.uiUtils.showErrorToster('MojniInwardNo is empty');
    // }
    // if (!this.Entity.p.MojniInwardDate) {
    //   await this.uiUtils.showErrorToster('MojniInwardDate is empty');
    // }
    // if (!this.Entity.p.IsGramSevakSubmit) {
    //   await this.uiUtils.showErrorToster('IsGramSevakSubmit not Selected');
    // }
    // if (!this.Entity.p.GramSevakInwardNo) {
    //   await this.uiUtils.showErrorToster('GramSevakInwardNo is empty');
    // }
    // if (!this.Entity.p.GramSevakInwardDate) {
    //   await this.uiUtils.showErrorToster('GramSevakInwardDate is empty');
    // }
    // if (!this.Entity.p.IsULCSubmit) {
    //   await this.uiUtils.showErrorToster('IsULCSubmit not Selected');
    // }
    // if (!this.Entity.p.ULCInwardNo) {
    //   await this.uiUtils.showErrorToster('ULCInwardNo is empty');
    // }
    // if (!this.Entity.p.ULCInwardDate) {
    //   await this.uiUtils.showErrorToster('ULCInwardDate is empty');
    // }
    // if (!this.Entity.p.ReportNOCAirportNOC) {
    //   await this.uiUtils.showErrorToster('ReportNOCAirportNOC not Selected');
    // }
    // if (!this.Entity.p.IsReportNOCSubmit) {
    //   await this.uiUtils.showErrorToster('IsReportNOCSubmit not Selected');
    // }
    // if (!this.Entity.p.ReportNOCInwardNo) {
    //   await this.uiUtils.showErrorToster('ReportNOCInwardNo is empty');
    // }
    // if (!this.Entity.p.ReportNOCInwardDate) {
    //   await this.uiUtils.showErrorToster('ReportNOCInwardDate is empty');
    // }
    // if (!this.Entity.p.IsAirportNOCSubmit) {
    //   await this.uiUtils.showErrorToster('IsAirportNOCSubmit not Selected');
    // }
    // if (!this.Entity.p.AirportNOCInwardNo) {
    //   await this.uiUtils.showErrorToster('AirportNOCInwardNo is empty');
    // }
    // if (!this.Entity.p.AirportNOCInwardDate) {
    //   await this.uiUtils.showErrorToster('AirportNOCInwardDate is empty');
    // }


    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
    this.Entity.p.IsTPOfficeComplete = this.areAllSubmissionsComplete(this.Entity);
    console.log(' this.Entity.p.IsTPOfficeComplete :', this.Entity.p.IsTPOfficeComplete);
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
