import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { FileTransferObject } from 'src/app/classes/infrastructure/filetransferobject';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-your-profile',
  standalone: false,
  templateUrl: './your-profile.component.html',
  styleUrls: ['./your-profile.component.scss'],
})
export class YourProfileComponent implements OnInit {
  Entity: Employee = Employee.CreateNewInstance();
  GenderList = DomainEnums.GenderTypeList(true, '--- Select Gender ---');
  currentemployee: number = 0
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  imagePreviewUrl: string | null = null;
  selectedFileName: string | null = null;
  TimeStamp = Date.now()
  ImageBaseUrl: string = "";
  LoginToken = '';
  file: File | null = null;
  imageUrl: string | null = null;  // Add imageUrl to bind to src
  errors = { profile_image: '' };
  allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

  INDPhoneNo: string = ValidationPatterns.INDPhoneNo

  INDPhoneNoMsg: string = ValidationMessages.INDPhoneNoMsg
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg

  @ViewChild('PhoneNosCtrl') phoneNosInputControl!: NgModel;


  constructor(private cdr: ChangeDetectorRef, private DateconversionService: DateconversionService,
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement,
    private baseUrl: BaseUrlService,
    private dtu: DTU,
  ) { }

  ngOnInit() {
    this.currentemployee = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    this.LoginToken = this.appStateManage.getLoginToken();
    this.ImageBaseUrl = this.baseUrl.GenerateImageBaseUrl();
    if (this.currentemployee) {
      this.getEmployeeDetails()
    }
  }

  getEmployeeDetails = async () => {
    if (this.currentemployee && this.companyRef()) {
      let EmployeeData = await Employee.FetchInstance(this.currentemployee, this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.Entity = EmployeeData
      if (this.Entity.p.DOB != '') {
        this.Entity.p.DOB = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.DOB)
      }
      this.imageUrl = this.Entity.p.ProfilePicPath;
      this.loadImageFromBackend(this.Entity.p.ProfilePicPath)
    }
  }

  loadImageFromBackend(imageUrl: string): void {
  console.log('imageUrl :', imageUrl);
    if (imageUrl) {
      this.imagePreviewUrl = `${this.ImageBaseUrl}${imageUrl}/${this.LoginToken}?${this.TimeStamp}`;
      console.log('this.imagePreviewUrl :', this.imagePreviewUrl);
      this.selectedFileName = imageUrl;
    } else {
      this.imagePreviewUrl = null;
    }
  }

   handleFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.Entity.p.ProfilePicFile = input.files[0];
      this.selectedFileName = this.Entity.p.ProfilePicFile.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.Entity.p.ProfilePicFile);
    }
  }

  // Utility function to create object URL
  createObjectURL(file: File): string {
    return URL.createObjectURL(file);
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  SaveProfile = async () => {
  let entityToSave = this.Entity.GetEditableVersion();
  let entitiesToSave = [entityToSave];

  let lstFTO: FileTransferObject[] = [];

  if (this.Entity.p.ProfilePicFile) {
    lstFTO.push(
      FileTransferObject.FromFile(
        "ProfilePicFile",
        this.Entity.p.ProfilePicFile,
        this.Entity.p.ProfilePicFile.name
      )
    );
  }

  await this.Entity.EnsurePrimaryKeysWithValidValues();
  let tr = await this.utils.SavePersistableEntities(entitiesToSave, lstFTO);

  if (!tr.Successful) {
    this.uiUtils.showErrorMessage('Error', tr.Message);
  } else {
    await this.uiUtils.showSuccessToster('Profile Updated successfully!');
    this.router.navigate(['/homepage']);
  }
};


    BackProfile = () => {
    this.router.navigate(['/homepage']);
  }
}

