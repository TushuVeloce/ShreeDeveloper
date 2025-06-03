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

  // CountryCodeList = DomainEnums.CountryCodeList(true, '--Select Status--');


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
      console.log('EmployeeData :', EmployeeData);
      this.Entity = EmployeeData
      if (this.Entity.p.DOB != '') {
        this.Entity.p.DOB = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.DOB)
      }
      this.imageUrl = this.Entity.p.ProfilePicPath;
      console.log('this.Entity.p.ProfilePicPath :', this.Entity.p.ProfilePicPath);
      this.loadImageFromBackend(this.Entity.p.ProfilePicPath)
    }
  }
  loadImageFromBackend(imageUrl: string): void {
    if (imageUrl) {
      this.imagePreviewUrl = `${this.ImageBaseUrl}${imageUrl}/${this.LoginToken}?${this.TimeStamp}`;
      console.log('this.imagePreviewUrl :', this.imagePreviewUrl);
      this.selectedFileName = imageUrl;
    } else {
      this.imagePreviewUrl = null;
    }
  }

  // Handle file selection
  handleFileChange = (event: any) => {
    const fileInput = event.target.files[0];

    // Check if a file was selected
    if (fileInput) {
      // Validate file type
      if (this.allowedImageTypes.includes(fileInput.type)) {
        this.file = fileInput;
        this.errors.profile_image = '';  // Clear error if valid file

        // Create a URL for the image only if the file is not null
        if (this.file) {
          this.imageUrl = this.createObjectURL(this.file);  // No more error here
        }

        // Manually trigger change detection to avoid ExpressionChangedAfterItHasBeenCheckedError
        this.cdr.detectChanges();
      } else {
        // If file type is not an image, show an error message
        this.errors.profile_image = 'Only image files (JPG, PNG, GIF) are allowed';
        this.file = null;  // Reset file if it's invalid
        this.imageUrl = null;  // Clear the image URL
      }
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
    let file: FileTransferObject[] | undefined = []
    if (this.file) {
      let lstFTO: FileTransferObject[] = [FileTransferObject.FromFile("ProfilePicFile", this.file, this.file.name)];
      // let lstFTO: FileTransferObject[] = [FileTransferObject.FromFile("LogoFile", this.Entity.p.ProfilePic, this.Entity.p.ProfilePic.name)];
      console.log(lstFTO);
      file = lstFTO
    }
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    await this.Entity.EnsurePrimaryKeysWithValidValues()
    let tr = await this.utils.SavePersistableEntities(entitiesToSave, file);
    if (!tr.Successful) {
      this.uiUtils.showErrorMessage('Error', tr.Message);
    }
    else {
      await this.uiUtils.showSuccessToster('Employee Updated successfully!');
      // this.Entity = Employee.CreateNewInstance();
      this.router.navigate(['/homepage']);
    }
  }
}

