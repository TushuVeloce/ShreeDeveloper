import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { RegistrarOffice } from 'src/app/classes/domain/entities/website/registraroffice/registraroffice';
import { FileTransferObject } from 'src/app/classes/infrastructure/filetransferobject';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
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
export class RegistrarOfficeDetailComponent implements OnInit {
  isSaveDisabled: boolean = false;
  private IsNewEntity: boolean = true;
  isChecked = false; // Default value
  Entity: RegistrarOffice = RegistrarOffice.CreateNewInstance();
  DetailsFormTitle: 'New Registrar Office' | 'Edit Registrar Office' = 'New Registrar Office';
  InitialEntity: RegistrarOffice = null as any;
  companyName = this.companystatemanagement.SelectedCompanyName;
  localagreementdate: string = '';
  localsaledeeddate: string = '';
  localtalathidate: string = '';

  ImageBaseUrl: string = "";

  selectedFileNames: { [key: string]: string } = {};

  uploadedFiles: { label: string; file: File; filename: string }[] = [];
  filePreviews: { [key: string]: string } = {};
  errors: { [key: string]: string } = {};

  NameWithNos: string = ValidationPatterns.NameWithNos

  NameWithNosMsg: string = ValidationMessages.NameWithNosMsg
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg

  @ViewChild('AgreementDocumentNoCtrl') AgreementDocumentNoInputControl!: NgModel;
  @ViewChild('SaleDeedDocumentNoCtrl') SaleDeedDocumentNoInputControl!: NgModel;
  @ViewChild('TalathiInwardNoCtrl') TalathiInwardNoInputControl!: NgModel;

  @ViewChild('CustomerAadharFileInput', { static: false }) CustomerAadharFileInputRef!: ElementRef;
  @ViewChild('CustomerPanFileInput', { static: false }) CustomerPanFileInputRef!: ElementRef;

  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils, private companystatemanagement: CompanyStateManagement, private dtu: DTU,
    private datePipe: DatePipe) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Registrar Office' : 'Edit Registrar Office';
      this.Entity = RegistrarOffice.GetCurrentInstance();

      // While Edit Converting date String into Date Format //
      if (this.Entity.p.AgreementDate) {
        this.localagreementdate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.AgreementDate)
      }
      if (this.Entity.p.SaleDeedDate) {
        this.localsaledeeddate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.SaleDeedDate)
      }
      if (this.Entity.p.TalathiDate) {
        this.localtalathidate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.TalathiDate)
      }
      this.appStateManage.StorageKey.removeItem('Editable')

    } else {
      this.Entity = RegistrarOffice.CreateNewInstance();
      RegistrarOffice.SetCurrentInstance(this.Entity);

    }
    this.InitialEntity = Object.assign(RegistrarOffice.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)) as RegistrarOffice;
  }

  // for value 0 selected while click on Input //
  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  // onCustomerAadharFileUpload(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files[0]) {
  //     this.Entity.p.CustomerAadharFile = input.files[0];
  //     console.log('this.Entity.p.CustomerAadharFile :', this.Entity.p.CustomerAadharFile);
  //     this.CustomerAadharSelectedFileName = this.Entity.p.CustomerAadharFile.name;
  //     console.log('this.CustomerAadharSelectedFileName :', this.CustomerAadharSelectedFileName);

  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.CustomerAadharFilePreviewUrl = reader.result as string;
  //     };
  //     reader.readAsDataURL(this.Entity.p.CustomerAadharFile);
  //   }
  // }

  // Trigger file input when clicking the image
  CustomerAadharTriggerFileInput(): void {
    this.CustomerAadharFileInputRef.nativeElement.click();
  }

  onFileUpload(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSizeMB = 2;

      if (!allowedTypes.includes(file.type)) {
        this.errors[type] = 'Only JPG, PNG, and GIF files are allowed.';
        return;
      }

      if (file.size / 1024 / 1024 > maxSizeMB) {
        this.errors[type] = 'File size should not exceed 2 MB.';
        return;
      }

      this.errors[type] = '';
      const existingIndex = this.uploadedFiles.findIndex(f => f.label === type);

      const fileEntry = {
        label: type,
        file,
        filename: file.name
      };

      if (existingIndex > -1) {
        this.uploadedFiles[existingIndex] = fileEntry;
      } else {
        this.uploadedFiles.push(fileEntry);
      }
      console.log('this.uploadedFiles :', this.uploadedFiles);

      const reader = new FileReader();
      reader.onload = () => {
        this.filePreviews[type] = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  isWitness1Complete(): boolean {
    const p = this.Entity.p;
    return (
      p.Witness1Name?.trim() !== '' &&
      p.Witness1ContactNo?.toString().trim() !== '' &&
      p.Witness1IsAadharSubmit &&
      p.Witness1IsPanSubmit
    );
  }
  isWitness2Complete(): boolean {
    const p = this.Entity.p;
    return (
      p.Witness2Name?.trim() !== '' &&
      p.Witness2ContactNo?.toString().trim() !== '' &&
      p.Witness2IsAadharSubmit &&
      p.Witness2IsPanSubmit
    );
  }

  isAgreementtoSaleComplete(): boolean {
    const p = this.Entity.p;
    return (
      p.AgreementDocumentNo?.trim() !== '' &&
      this.localagreementdate?.trim() !== ''
    );
  }

  isSaleDeedComplete(): boolean {
    const p = this.Entity.p;
    return (
      p.SaleDeedDocumentNo?.trim() !== '' &&
      this.localsaledeeddate?.trim() !== ''
    );
  }

  isTalathiComplete(): boolean {
    const p = this.Entity.p;
    return (
      p.TalathiInwardNo?.trim() !== '' &&
      this.localtalathidate?.trim() !== '' &&
      p.IsIndexOriginalSubmit &&
      p.IsDastZeroxSubmit &&
      p.IsFerfarNoticeSubmit &&
      p.IsFinalCustomer712Submit
    );
  }

  SaveRegistrarOfficeMaster = async () => {
    // this.isSaveDisabled = true;
    // this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    // this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
    // this.Entity.p.UpdatedDate = await CurrentDateTimeRequest.GetCurrentDateTime();
    // this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))

    // // convert date 2025-02-23 to 2025-02-23-00-00-00-000
    // this.Entity.p.AgreementDate = this.dtu.ConvertStringDateToFullFormat(this.localagreementdate)
    // this.Entity.p.SaleDeedDate = this.dtu.ConvertStringDateToFullFormat(this.localsaledeeddate)
    // this.Entity.p.TalathiDate = this.dtu.ConvertStringDateToFullFormat(this.localtalathidate)

    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave]

    const lstFTO: FileTransferObject[] = this.uploadedFiles.map(f =>
      FileTransferObject.FromFile(f.label, f.file, f.filename)
    );

    console.log('lstFTO:', lstFTO);
    // if (this.Entity.p.CustomerAadharFile != null) {
      let tr = await this.utils.SavePersistableEntities(entitiesToSave, lstFTO);
    // }

    // let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
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
        this.BackRegistrarOffice()
      }
    }
  }

  BackRegistrarOffice() {
    this.router.navigate(['/homepage/Website/Registrar_Office']);
  }

  resetAllControls = () => {
    // reset touched
    this.AgreementDocumentNoInputControl.control.markAsUntouched();
    this.SaleDeedDocumentNoInputControl.control.markAsUntouched();
    this.TalathiInwardNoInputControl.control.markAsUntouched();

    // reset dirty
    this.AgreementDocumentNoInputControl.control.markAsPristine();
    this.SaleDeedDocumentNoInputControl.control.markAsPristine();
    this.TalathiInwardNoInputControl.control.markAsPristine();
  }

}
