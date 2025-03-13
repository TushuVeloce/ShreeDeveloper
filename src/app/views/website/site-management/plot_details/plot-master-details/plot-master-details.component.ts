import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { City } from 'src/app/classes/domain/entities/website/masters/city/city';
import { Country } from 'src/app/classes/domain/entities/website/masters/country/country';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { Plot } from 'src/app/classes/domain/entities/website/masters/plot/plot';
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
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Plot' | 'Edit Plot' = 'New Plot';
  IsDropdownDisabled: boolean = false;
  InitialEntity: Plot = null as any;
  BookingRemarkList = DomainEnums.BookingRemarkList(true, '---Select Booking Remark---');
  SiteRf:number =0
  SiteName:string =''

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils, private companystatemanagement: CompanyStateManagement
  ) { }

  async ngOnInit() {
    const siteref = this.appStateManage.StorageKey.getItem('siteRf')
    const siteName = this.appStateManage.StorageKey.getItem('SiteName')
    this.SiteRf = Number(siteref)
    this.appStateManage.setDropdownDisabled(true);
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;

      this.DetailsFormTitle = this.IsNewEntity
        ? 'New Plot'
        : 'Edit Plot';
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

  SavePlot = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
    this.Entity.p.SiteRef = this.SiteRf
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
        await this.uiUtils.showSuccessToster('Site saved successfully!');
        this.Entity = Plot.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster('Site Updated successfully!');
      }
    }
  };

  BackPlot() {
    this.router.navigate(['/homepage/Website/Plot_Master']);
  }

}
