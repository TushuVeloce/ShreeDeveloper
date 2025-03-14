import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { Plot } from 'src/app/classes/domain/entities/website/masters/plot/plot';
import { Owner } from 'src/app/classes/domain/entities/website/masters/site/owner/owner';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { State } from 'src/app/classes/domain/entities/website/masters/state/state';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-plot-master-details',
  standalone: false,
  templateUrl: './plot-master-details.component.html',
  styleUrls: ['./plot-master-details.component.scss'],
})
export class PlotMasterDetailsComponent implements OnInit {
  Entity: Plot = Plot.CreateNewInstance();
  private IsNewEntity: boolean = true;
  DetailsFormTitle: 'New Plot' | 'Edit Plot' = 'New Plot';
  isSaveDisabled: boolean = false;
  IsDropdownDisabled: boolean = false;
  InitialEntity: Plot = null as any;
  BookingRemarkList = DomainEnums.BookingRemarkList(true, '---Select Booking Remark---');
  SiteRf: number = 0
  SiteName: string = ''
  CustomerList: Owner[] = [];

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils, private companystatemanagement: CompanyStateManagement
  ) { }

  async ngOnInit() {
    const siteref = this.appStateManage.StorageKey.getItem('siteRf')
    const siteName = this.appStateManage.StorageKey.getItem('siteName')
    this.SiteRf = siteref ? Number(siteref) : 0;
    this.SiteName = siteName ? siteName : '';
    this.appStateManage.setDropdownDisabled(true);
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Plot' : 'Edit Plot';
      this.Entity = Plot.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');
    } else {
      this.Entity = Plot.CreateNewInstance();
      Plot.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(
      Plot.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as Plot;
  }

  getCustomerListBySiteandBookingRef = async (SiteRf:number,bookingremark:number) => {
    this.CustomerList = [];
    if (SiteRf <= 0 && bookingremark <= 0) {
      await this.uiUtils.showErrorToster('Site or Booking Remark not Selected');
      return;
    }
    let lst = await Owner.FetchEntireListBySiteandBookingRemarkRef(SiteRf,bookingremark, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.CustomerList = lst;
    console.log('CustomerList :', this.CustomerList);
  }

  SavePlot = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
    this.Entity.p.SiteManagementRef = this.SiteRf
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    console.log('entityToSave :', entityToSave);
    // await this.Entity.EnsurePrimaryKeysWithValidValues()
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorToster(tr.Message);
      return;
    } else {
      this.isSaveDisabled = false;
      // this.onEntitySaved.emit(entityToSave);
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Plot saved successfully!');
        this.Entity = Plot.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster('Plot Updated successfully!');
      }
    }
  };

  BackPlot() {
    this.router.navigate(['/homepage/Website/Plot_Master']);
  }

}
