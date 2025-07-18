import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NaLetter } from 'src/app/classes/domain/entities/website/government_office/naletter/naletter';
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

  SiteRef: number = 0;
  SiteName: string = '';

  Entity: NaLetter = NaLetter.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  IsDropdownDisabled: boolean = false;
  InitialEntity: NaLetter = null as any;
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

    this.getNALetterListByCompanyAndSiteRef();

    this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))

    this.InitialEntity = Object.assign(NaLetter.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as NaLetter;
  }


  getNALetterListByCompanyAndSiteRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    if (this.SiteRef <= 0) {
      await this.uiUtils.showErrorToster('Site not Selected');
      return;
    }
    let lst = await NaLetter.FetchEntireListByCompanyAndSiteRef(this.companyRef(), this.SiteRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
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
      'IsTPPatraSubmit',
      'IsPradhikaranOfficePatraSubmit',
      'IsTentativeOrderMapSubmit',
      'IsZoneDakhalaMapSubmit',
      'IsEkonisheEkonPanasPasuncheSatbaraVaFerfarSubmit',
      'IsEPatrakSubmit',
      'IsInamPatraSubmit',
      'IsTPOfficeSubmit',
      'IsTalathiOfficeSubmit',
    ];

    status = requiredFields.every(field => Entity.p?.[field] === true);

    if (!Entity.p.IsInamPatraSubmitTwo && status) {
      status = true;
    } else {
      status = Entity.p.IsArjSubmit;
    }
    return status;
  }


  SaveNaLetter = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
    this.Entity.p.IsParishisthaNaComplete = this.areAllSubmissionsComplete(this.Entity);
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

