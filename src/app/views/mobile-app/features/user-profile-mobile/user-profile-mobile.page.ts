import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController } from '@ionic/angular';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { DomainEnums, Gender } from 'src/app/classes/domain/domainenums/domainenums';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { FileTransferObject } from 'src/app/classes/infrastructure/filetransferobject';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';
import { ToastService } from '../../core/toast.service';
import { HapticService } from '../../core/haptic.service';
import { AlertService } from '../../core/alert.service';
import { LoadingService } from '../../core/loading.service';
import { BottomsheetMobileAppService } from 'src/app/services/bottomsheet-mobile-app.service';

@Component({
  selector: 'app-user-profile-mobile',
  templateUrl: './user-profile-mobile.page.html',
  styleUrls: ['./user-profile-mobile.page.scss'],
  standalone: false
})
export class UserProfileMobilePage implements OnInit {
  Entity: Employee = Employee.CreateNewInstance();
  employeeForm!: FormGroup;
  isLoggingIn = false;
  GenderList = DomainEnums.GenderTypeList();
  currentemployee: number = 0
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  imagePreviewUrl: string | null = null;
  selectedFileName: string | null = null;
  TimeStamp = Date.now()
  ImageBaseUrl: string = "";
  LoginToken = '';
  file: File | null = null;
  imageUrl: string | null = null;  // Add imageUrl to bind to src
  ProfilePicFile: File = null as any
  errors = { profile_image: '' };
  allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
  isLoading: boolean = false;
  Date: string | null = null;
  selectedGender: any[] = [];


  INDPhoneNo: string = ValidationPatterns.INDPhoneNo

  INDPhoneNoMsg: string = ValidationMessages.INDPhoneNoMsg
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg

  constructor(private cdr: ChangeDetectorRef, private DateconversionService: DateconversionService,
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement,
    private baseUrl: BaseUrlService,
    private dtu: DTU,
    private actionSheetController: ActionSheetController,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private fb: FormBuilder,
    private bottomsheetMobileAppService: BottomsheetMobileAppService,
  ) { }

  ngOnInit() {
    this.currentemployee = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
    this.LoginToken = this.appStateManage.getLoginToken();
    this.ImageBaseUrl = this.baseUrl.GenerateImageBaseUrl();
    if (this.currentemployee != 0 && this.currentemployee != 1001) {
      this.getEmployeeDetails()
    }
    this.employeeForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      address: ['', Validators.required],
      gender: ['', Validators.required],
      mobilenumber: ['', Validators.required],
      DOB: new FormControl(new Date().toISOString(), Validators.required),
    });
  }

  ionViewWillEnter = async () => {
    await this.loadingService.show();
    this.currentemployee = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
    this.LoginToken = this.appStateManage.getLoginToken();
    this.ImageBaseUrl = this.baseUrl.GenerateImageBaseUrl();
    if (this.currentemployee != 0 && this.currentemployee != 1001) {
      this.getEmployeeDetails()
    }
    await this.loadingService.hide();
  }

  DateChange(value: string) {
    this.Date = value;
    console.log('value :', value);
    // this.Entity.p.Date = value || '';
  }

  public async selectGenderBottomsheet(): Promise<void> {
    try {
      const options = this.GenderList.map((item) => ({ p: item }));

      this.openSelectModal(
        options,
        this.selectedGender,
        false,
        'Select Gender',
        1,
        (selected) => {
          this.selectedGender = selected;

          // Optional: update the form control with selected gender
          const selectedRef = selected?.[0]?.p?.Ref;
          const selectedName = selected?.[0]?.p?.Name;
          if (selectedRef) {
            this.employeeForm.get('gender')?.setValue(selectedName);
          }
        }
      );
    } catch (error) {
      console.error('Error in selectGenderBottomsheet:', error);
    }
  }

  // private async openSelectModal(
  //   dataList: any[],
  //   selectedItems: any[],
  //   multiSelect: boolean,
  //   title: string,
  //   MaxSelection: number,
  //   updateCallback: (selected: any[]) => void
  // ): Promise<void> {
  //   const selected = await this.bottomsheetMobileAppService.openSelectModal(
  //     dataList,
  //     selectedItems,
  //     multiSelect,
  //     title,
  //     MaxSelection
  //   );

  //   if (selected) {
  //     updateCallback(selected);
  //   }
  // }
  private async openSelectModal(
    dataList: any[],
    selectedItems: any[],
    multiSelect: boolean,
    title: string,
    MaxSelection: number,
    updateCallback: (selected: any[]) => void
  ): Promise<void> {
    const selected = await this.bottomsheetMobileAppService.openSelectModal(dataList, selectedItems, multiSelect, title, MaxSelection);
    if (selected) updateCallback(selected);
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

  async addImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image Source',
      buttons: [
        {
          text: 'Take Photo',
          icon: 'camera',
          handler: () => {
            this.pickImage(CameraSource.Camera);
          },
        },
        {
          text: 'Choose from Gallery',
          icon: 'image',
          handler: () => {
            this.pickImage(CameraSource.Photos);
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  private async pickImage(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: source,
      });

      this.imageUrl = image.dataUrl!;
      this.imagePreviewUrl = this.imageUrl;
    } catch (error) {
      console.error('Image picking error:', error);
    }
  }
  handleFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.ProfilePicFile = input.files[0];
      this.selectedFileName = this.ProfilePicFile.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.ProfilePicFile);
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

    if (this.ProfilePicFile) {
      lstFTO.push(
        FileTransferObject.FromFile(
          "ProfilePicFile",
          this.ProfilePicFile,
          this.ProfilePicFile.name
        )
      );
    }

    await this.Entity.EnsurePrimaryKeysWithValidValues();
    let tr = await this.utils.SavePersistableEntities(entitiesToSave, lstFTO);

    if (!tr.Successful) {
      this.uiUtils.showErrorMessage('Error', tr.Message);
    } else {
      await this.uiUtils.showSuccessToster('Profile Updated successfully');
      this.router.navigate(['/mobileapp/tabs/settings']);
    }
  };


  BackProfile = () => {
    this.router.navigate(['/mobileapp/tabs/settings']);
  }

}
