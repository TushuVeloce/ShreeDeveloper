import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrarOffice } from 'src/app/classes/domain/entities/website/registraroffice/registraroffice';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';


@Component({
  selector: 'app-registrar-office-detail',
  standalone: false,
  templateUrl: './registrar-office-detail.component.html',
  styleUrls: ['./registrar-office-detail.component.scss'],
})
export class RegistrarOfficeDetailComponent  implements OnInit {
  isSaveDisabled: boolean = false;
  private IsNewEntity: boolean = true;
  isChecked = false; // Default value
  Entity: RegistrarOffice = RegistrarOffice.CreateNewInstance();
  DetailsFormTitle: 'New Registrar Office' | 'Edit Registrar Office' = 'New Registrar Office';
  InitialEntity: RegistrarOffice = null as any;
  companyName = this.companystatemanagement.SelectedCompanyName;
  agreementdate: string | null = null;
  saledeeddate: string | null = null;
  talathidate: string | null = null;

  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils,private companystatemanagement: CompanyStateManagement, private dtu: DTU,
      private datePipe: DatePipe) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
       if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
          this.IsNewEntity = false;
          this.DetailsFormTitle = this.IsNewEntity ? 'New Registrar Office' : 'Edit Registrar Office';
          this.Entity = RegistrarOffice.GetCurrentInstance();

           // While Edit Converting date String into Date Format //
      this.agreementdate = this.datePipe.transform(
        this.dtu.FromString(this.Entity.p.AgreementDate),
        'yyyy-MM-dd'
      );
           // While Edit Converting date String into Date Format //
           this.saledeeddate = this.datePipe.transform(
            this.dtu.FromString(this.Entity.p.SaleDeedDate),
            'yyyy-MM-dd'
          );
               // While Edit Converting date String into Date Format //
      this.talathidate = this.datePipe.transform(
        this.dtu.FromString(this.Entity.p.TalathiDate),
        'yyyy-MM-dd'
      );
          this.appStateManage.StorageKey.removeItem('Editable')
    
        } else {
          this.Entity = RegistrarOffice.CreateNewInstance();
          RegistrarOffice.SetCurrentInstance(this.Entity);
         
        }
        this.InitialEntity = Object.assign(RegistrarOffice.CreateNewInstance(),
        this.utils.DeepCopy(this.Entity)) as RegistrarOffice;      
   }
   selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }
    SaveRegistrarOfficeMaster = async () => {
      this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
      this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
      let entityToSave = this.Entity.GetEditableVersion();

        // ------ Code For Save Date Of Agreement Date Format ---------------//
    if (this.agreementdate) {
      let dateValue = new Date(this.agreementdate);

      if (!isNaN(dateValue.getTime())) {
        entityToSave.p.AgreementDate =
          this.dtu.DateStartStringFromDateValue(dateValue);
      } else {
        entityToSave.p.AgreementDate = '';
      }
    }
      // ------ Code For Save Date Of SaleDeed Date Format ---------------//
      if (this.saledeeddate) {
        let dateValue = new Date(this.saledeeddate);
  
        if (!isNaN(dateValue.getTime())) {
          entityToSave.p.SaleDeedDate =
            this.dtu.DateStartStringFromDateValue(dateValue);
        } else {
          entityToSave.p.SaleDeedDate = '';
        }
      }

      // ------ Code For Save Date Of Talathi Date Format ---------------//
      if (this.talathidate) {
        let dateValue = new Date(this.talathidate);
  
        if (!isNaN(dateValue.getTime())) {
          entityToSave.p.TalathiDate =
            this.dtu.DateStartStringFromDateValue(dateValue);
        } else {
          entityToSave.p.TalathiDate = '';
        }
      }

      let entitiesToSave = [entityToSave]
      console.log('entitiesToSave :', entitiesToSave);
      // await this.Entity.EnsurePrimaryKeysWithValidValues()
      let tr = await this.utils.SavePersistableEntities(entitiesToSave);
      if (!tr.Successful) {
        this.isSaveDisabled = false;
        this.uiUtils.showErrorMessage('Error',tr.Message);
        return
      }
      else {
        this.isSaveDisabled = false;
        // this.onEntitySaved.emit(entityToSave);
        if (this.IsNewEntity) {
          await this.uiUtils.showSuccessToster('Registrar Office saved successfully!');
          this.Entity = RegistrarOffice.CreateNewInstance();
        } else {
          await this.router.navigate(['/homepage/Website/Registrar_Office'])
          await this.uiUtils.showSuccessToster('Registrar Office Updated successfully!');
        }
      }
    }

  BackRegistrarOffice() {
    this.router.navigate(['/homepage/Website/Registrar_Office']);
  }

}
