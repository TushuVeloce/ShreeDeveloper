import { DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { RegistrarOffice, RegistrarOfficeProps } from 'src/app/classes/domain/entities/website/registraroffice/registraroffice';
import { FileTransferObject } from 'src/app/classes/infrastructure/filetransferobject';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
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
  IsNewEntity: boolean = true;
  isChecked = false; // Default value
  Entity: RegistrarOffice = RegistrarOffice.CreateNewInstance();
  DetailsFormTitle: string = 'Registrar Office';
  InitialEntity: RegistrarOffice = null as any;
  companyName = this.companystatemanagement.SelectedCompanyName;
  localagreementdate: string = '';
  localsaledeeddate: string = '';
  localtalathidate: string = '';
  TimeStamp = Date.now()
  LoginToken = '';

  ImageBaseUrl: string = "";

  selectedFileNames: { [key: string]: string } = {};

  uploadedFiles: { label: string; file: File; filename: string }[] = [];
  filePrevViews: { [key: string]: string } = {};
  filePostViews: { [key: string]: string } = {};
  filePostViewsURL: { [key: string]: string } = {};
  errors: { [key: string]: string } = {};

  NameWithNos: string = ValidationPatterns.NameWithNos

  NameWithNosMsg: string = ValidationMessages.NameWithNosMsg
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg

  @ViewChild('AgreementDocumentNoCtrl') AgreementDocumentNoInputControl!: NgModel;
  @ViewChild('SaleDeedDocumentNoCtrl') SaleDeedDocumentNoInputControl!: NgModel;
  @ViewChild('TalathiInwardNoCtrl') TalathiInwardNoInputControl!: NgModel;

  @ViewChild('CustomerAadharFileInput', { static: false }) CustomerAadharFileInputRef!: ElementRef;
  @ViewChild('CustomerPanFileInput', { static: false }) CustomerPanFileInputRef!: ElementRef;
  @ViewChild('Witness1IsAadharSubmit', { static: false }) Witness1IsAadharSubmitRef!: ElementRef;
  @ViewChild('Witness1IsPanSubmit', { static: false }) Witness1IsPanSubmitRef!: ElementRef;
  @ViewChild('Witness2IsAadharSubmit', { static: false }) Witness2IsAadharSubmitRef!: ElementRef;
  @ViewChild('Witness2IsPanSubmit', { static: false }) Witness2IsPanSubmitRef!: ElementRef;
  @ViewChild('AgreementDocument', { static: false }) AgreementDocumentRef!: ElementRef;
  @ViewChild('SaleDeedDocument', { static: false }) SaleDeedDocumentRef!: ElementRef;
  @ViewChild('IndexOriginalDocument', { static: false }) IndexOriginalDocumentRef!: ElementRef;
  @ViewChild('DastZeroxDocument', { static: false }) DastZeroxDocumentRef!: ElementRef;
  @ViewChild('FerfarNoticeDocument', { static: false }) FerfarNoticeDocumentRef!: ElementRef;
  @ViewChild('FinalCustomer712Document', { static: false }) FinalCustomer712DocumentRef!: ElementRef;

  // 🔸 Prevent F5 and Ctrl+R
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'F5' || (event.ctrlKey && event.key.toLowerCase() === 'r')) {
      event.preventDefault();
    }
  }

  @HostListener('window:contextmenu', ['$event'])
  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

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

    this.appStateManage.setDropdownDisabled(true);
    this.ImageBaseUrl = this.baseUrl.GenerateImageBaseUrl();
    this.LoginToken = this.appStateManage.getLoginToken();
    this.Entity = RegistrarOffice.GetCurrentInstance();

    this.filePostViews['CustomerAadharFile'] = `${this.ImageBaseUrl}${this.Entity.p.CustomerAadharPath}/${this.LoginToken}?${this.TimeStamp}`;
    this.selectedFileNames['CustomerAadharFile'] = this.Entity.p.CustomerAadharPath;

    this.filePostViews['CustomerPanFile'] = `${this.ImageBaseUrl}${this.Entity.p.CustomerPanPath}/${this.LoginToken}?${this.TimeStamp}`;
    this.selectedFileNames['CustomerPanFile'] = this.Entity.p.CustomerPanPath;

    this.filePostViews['Witness1AadharFile'] = `${this.ImageBaseUrl}${this.Entity.p.Witness1AadharPath}/${this.LoginToken}?${this.TimeStamp}`;
    this.selectedFileNames['Witness1AadharFile'] = this.Entity.p.Witness1AadharPath;

    this.filePostViews['Witness1PanFile'] = `${this.ImageBaseUrl}${this.Entity.p.Witness1PanPath}/${this.LoginToken}?${this.TimeStamp}`;
    this.selectedFileNames['Witness1PanFile'] = this.Entity.p.Witness1PanPath;

    this.filePostViews['Witness2AadharFile'] = `${this.ImageBaseUrl}${this.Entity.p.Witness2AadharPath}/${this.LoginToken}?${this.TimeStamp}`;
    this.selectedFileNames['Witness2AadharFile'] = this.Entity.p.Witness2AadharPath;

    this.filePostViews['Witness2PanFile'] = `${this.ImageBaseUrl}${this.Entity.p.Witness2PanPath}/${this.LoginToken}?${this.TimeStamp}`;
    this.selectedFileNames['Witness2PanFile'] = this.Entity.p.Witness2PanPath;

    this.filePostViews['AgreementDocumentFile'] = `${this.ImageBaseUrl}${this.Entity.p.AgreementDocumentPath}/${this.LoginToken}?${this.TimeStamp}`;
    this.selectedFileNames['AgreementDocumentFile'] = this.Entity.p.AgreementDocumentPath;

    this.filePostViews['SaleDeedDocumentFile'] = `${this.ImageBaseUrl}${this.Entity.p.SaleDeedDocumentPath}/${this.LoginToken}?${this.TimeStamp}`;
    this.selectedFileNames['SaleDeedDocumentFile'] = this.Entity.p.SaleDeedDocumentPath;

    this.filePostViews['IndexOriginalDocumentFile'] = `${this.ImageBaseUrl}${this.Entity.p.IndexOriginalDocumentPath}/${this.LoginToken}?${this.TimeStamp}`;
    this.selectedFileNames['IndexOriginalDocumentFile'] = this.Entity.p.IndexOriginalDocumentPath;

    this.filePostViews['DastZeroxDocumentFile'] = `${this.ImageBaseUrl}${this.Entity.p.DastZeroxDocumentPath}/${this.LoginToken}?${this.TimeStamp}`;
    this.selectedFileNames['DastZeroxDocumentFile'] = this.Entity.p.DastZeroxDocumentPath;

    this.filePostViews['FerfarNoticeDocumentFile'] = `${this.ImageBaseUrl}${this.Entity.p.FerfarNoticeDocumentPath}/${this.LoginToken}?${this.TimeStamp}`;
    this.selectedFileNames['FerfarNoticeDocumentFile'] = this.Entity.p.FerfarNoticeDocumentPath;

    this.filePostViews['FinalCustomer712DocumentFile'] = `${this.ImageBaseUrl}${this.Entity.p.FinalCustomer712DocumentPath}/${this.LoginToken}?${this.TimeStamp}`;
    this.selectedFileNames['FinalCustomer712DocumentFile'] = this.Entity.p.FinalCustomer712DocumentPath;


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
    this.InitialEntity = Object.assign(RegistrarOffice.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)) as RegistrarOffice;
  }

  isImageFile(filePath: string): boolean {
    if (!filePath) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const ext = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();
    return imageExtensions.includes(ext);
  }

  // for value 0 selected while click on Input //
  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  onFileUpload(event: Event, type: string, pathKey: 'CustomerPanPath' | 'CustomerAadharPath' | 'Witness1AadharPath' | 'Witness1PanPath' | 'Witness2AadharPath' | 'Witness2PanPath' | 'AgreementDocumentPath' | 'SaleDeedDocumentPath' | 'IndexOriginalDocumentPath' | 'DastZeroxDocumentPath' | 'FerfarNoticeDocumentPath' | 'FinalCustomer712DocumentPath'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      const maxSizeMB = 2;

      if (file) {
        const isPdf = file.type === 'application/pdf';
        const isImage = file.type.startsWith('image/');

        if (isPdf || isImage) {
          this.filePostViewsURL[type] = URL.createObjectURL(file);
          this.Entity.p[pathKey] = '';
        } else {
          this.uiUtils.showWarningToster('Only PDF or image files are supported.')
        }
      }

      if (!allowedTypes.includes(file.type)) {
        this.errors[type] = 'Only JPG, PNG, GIF, and PDF files are allowed.';
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

      const reader = new FileReader();
      reader.onload = () => {
        this.filePrevViews[type] = reader.result as string;
        this.selectedFileNames[type] = fileEntry.filename;

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
    this.isSaveDisabled = true;
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
    this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    this.Entity.p.SiteRef = Number(this.appStateManage.StorageKey.getItem('siteRef'))

    // convert date 2025-02-23 to 2025-02-23-00-00-00-000
    this.Entity.p.AgreementDate = this.dtu.ConvertStringDateToFullFormat(this.localagreementdate)
    this.Entity.p.SaleDeedDate = this.dtu.ConvertStringDateToFullFormat(this.localsaledeeddate)
    this.Entity.p.TalathiDate = this.dtu.ConvertStringDateToFullFormat(this.localtalathidate)

    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave]

    const lstFTO: FileTransferObject[] = this.uploadedFiles.map(f =>
      FileTransferObject.FromFile(f.label, f.file, f.filename)
    );

    let tr = await this.utils.SavePersistableEntities(entitiesToSave, lstFTO);

    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return
    }
    else {
      this.isSaveDisabled = false;
      this.BackRegistrarOffice()
    }
  }

  fileNavigation = (File: string, Type: string) => {
    if (File) {
      window.open(this.filePostViews[Type], '_blank');
    } else {
      window.open(this.filePostViewsURL[Type], '_blank');
    }
  }

  BackRegistrarOffice = () => {
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
