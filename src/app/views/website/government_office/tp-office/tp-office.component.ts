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


    if (!this.Entity.p.IsTentativeLayoutSubmit) {
      await this.uiUtils.showErrorToster('IsTentativeLayoutSubmit not Selected');
    }
    if (!this.Entity.p.TentativeLayoutInwardNo) {
      await this.uiUtils.showErrorToster('TentativeLayoutInwardNo is empty');
    }
    if (!this.Entity.p.TentativeLayoutInwardDate) {
      await this.uiUtils.showErrorToster('TentativeLayoutInwardDate is empty');
    }
    if (!this.Entity.p.IsTentativeLayoutScrutinyFeesSubmit) {
      await this.uiUtils.showErrorToster('IsTentativeLayoutScrutinyFeesSubmit not Selected');
    }
    if (!this.Entity.p.IsSurveyRemarkSubmit) {
      await this.uiUtils.showErrorToster('IsSurveyRemarkSubmit not Selected');
    }
    if (!this.Entity.p.IsATPSiteVisitSubmit) {
      await this.uiUtils.showErrorToster('IsATPSiteVisitSubmit not Selected');
    }
    if (!this.Entity.p.IsADTPSiteVisitSubmit) {
      await this.uiUtils.showErrorToster('IsADTPSiteVisitSubmit not Selected');
    }
    if (!this.Entity.p.IsDDTPSiteVisitSubmit) {
      await this.uiUtils.showErrorToster('IsDDTPSiteVisitSubmit not Selected');
    }
    if (!this.Entity.p.IsProposalSanctionSubmit) {
      await this.uiUtils.showErrorToster('IsProposalSanctionSubmit not Selected');
    }
    if (!this.Entity.p.IsDevelopmentChargesSubmit) {
      await this.uiUtils.showErrorToster('IsDevelopmentChargesSubmit not Selected');
    }
    if (!this.Entity.p.IsSubmitToTahsildar) {
      await this.uiUtils.showErrorToster('IsSubmitToTahsildar not Selected');
    }
    if (!this.Entity.p.ParishisthaNaUlcInwardNo) {
      await this.uiUtils.showErrorToster('ParishisthaNaUlcInwardNo is empty');
    }
    if (!this.Entity.p.ParishisthaNaUlcInwardDate) {
      await this.uiUtils.showErrorToster('ParishisthaNaUlcInwardDate is empty');
    }
    if (!this.Entity.p.IsSubmitToUpadhaykshaAndBhumiAdhilekh) {
      await this.uiUtils.showErrorToster('IsSubmitToUpadhaykshaAndBhumiAdhilekh not Selected');
    }
    if (!this.Entity.p.MojniInwardNo) {
      await this.uiUtils.showErrorToster('MojniInwardNo is empty');
    }
    if (!this.Entity.p.MojniInwardDate) {
      await this.uiUtils.showErrorToster('MojniInwardDate is empty');
    }
    if (!this.Entity.p.IsGramSevakSubmit) {
      await this.uiUtils.showErrorToster('IsGramSevakSubmit not Selected');
    }
    if (!this.Entity.p.GramSevakInwardNo) {
      await this.uiUtils.showErrorToster('GramSevakInwardNo is empty');
    }
    if (!this.Entity.p.GramSevakInwardDate) {
      await this.uiUtils.showErrorToster('GramSevakInwardDate is empty');
    }
    if (!this.Entity.p.IsULCSubmit) {
      await this.uiUtils.showErrorToster('IsULCSubmit not Selected');
    }
    if (!this.Entity.p.ULCInwardNo) {
      await this.uiUtils.showErrorToster('ULCInwardNo is empty');
    }
    if (!this.Entity.p.ULCInwardDate) {
      await this.uiUtils.showErrorToster('ULCInwardDate is empty');
    }
    if (!this.Entity.p.ReportNOCAirportNOC) {
      await this.uiUtils.showErrorToster('ReportNOCAirportNOC not Selected');
    }
    if (!this.Entity.p.IsReportNOCSubmit) {
      await this.uiUtils.showErrorToster('IsReportNOCSubmit not Selected');
    }
    if (!this.Entity.p.ReportNOCInwardNo) {
      await this.uiUtils.showErrorToster('ReportNOCInwardNo is empty');
    }
    if (!this.Entity.p.ReportNOCInwardDate) {
      await this.uiUtils.showErrorToster('ReportNOCInwardDate is empty');
    }
    if (!this.Entity.p.IsAirportNOCSubmit) {
      await this.uiUtils.showErrorToster('IsAirportNOCSubmit not Selected');
    }
    if (!this.Entity.p.AirportNOCInwardNo) {
      await this.uiUtils.showErrorToster('AirportNOCInwardNo is empty');
    }
    if (!this.Entity.p.AirportNOCInwardDate) {
      await this.uiUtils.showErrorToster('AirportNOCInwardDate is empty');
    }


    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
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
        await this.uiUtils.showSuccessToster('T.P. Office saved successfully');
        this.Entity = TPOffice.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster('T.P. Office Updated successfully');
        await this.router.navigate(['/homepage/Website/Site_Progress_Report']);
      }
    }
  };

  BackProgressReport = async () => {
    await this.router.navigate(['/homepage/Website/Site_Progress_Report']);
  }
}
