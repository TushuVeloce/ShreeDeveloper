import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { Vehicle } from 'src/app/classes/domain/entities/website/masters/vehicle/vehicle';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-vehicle-master-details',
  standalone: false,
  templateUrl: './vehicle-master-details.component.html',
  styleUrls: ['./vehicle-master-details.component.scss'],
})
export class VehicleMasterDetailsComponent implements OnInit {

  isSaveDisabled: boolean = false;
  private IsNewEntity: boolean = true;
  Entity: Vehicle = Vehicle.CreateNewInstance();
  DetailsFormTitle: 'New Vehicle' | 'Edit Vehicle' = 'New Vehicle';
  InitialEntity: Vehicle = null as any;
  companyName = this.companystatemanagement.SelectedCompanyName;

  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils,private companystatemanagement: CompanyStateManagement) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Vehicle' : 'Edit Vehicle';
      this.Entity = Vehicle.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable')

    } else {
      this.Entity = Vehicle.CreateNewInstance();
      Vehicle.SetCurrentInstance(this.Entity);

    }
    this.InitialEntity = Object.assign(Vehicle.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)) as Vehicle;
  }

  SaveVehicleMaster = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave]
    // await this.Entity.EnsurePrimaryKeysWithValidValues()
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorToster(tr.Message);
      return
    }
    else {
      this.isSaveDisabled = false;
      // this.onEntitySaved.emit(entityToSave);
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Vehicle saved successfully!');
        this.Entity = Vehicle.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster('Vehicle Updated successfully!');
      }
    }
  }

  BackVehicle() {
    this.router.navigate(['/homepage/Website/Vehicle_Master']);
  }

}
