import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from 'src/app/classes/domain/entities/website/masters/company/company';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { AdminProfile } from 'src/app/classes/domain/entities/website/profile/adminprofile/adminprofile';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { BottomsheetMobileAppService } from 'src/app/services/bottomsheet-mobile-app.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent implements OnInit {
  CompanyList: Company[] = [];
  selectedCompany: any[] = [];
  CompanyRef: number = 0;
  CompanyName: string = '';
  IsDefaultUser: boolean = false;
  @Input() title: string = 'Default Title';

    Entity: Employee = Employee.CreateNewInstance();
    AdminEntity: AdminProfile = AdminProfile.CreateNewInstance();
    currentemployee = 0;
    imagePreviewUrl: string | null = null;
    selectedFileName: string | null = null;
    TimeStamp = Date.now();
    ImageBaseUrl = '';
    LoginToken = '';
    imageUrl: string | null = null;
    ProfilePicFile: File | null = null;
  
    IsEmployee = false;
    IsAdmin = false;
    allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
  
  constructor(
    public router: Router,
    public appStateManagement: AppStateManageService,
    private uiUtils: UIUtils,
    private companystatemanagement: CompanyStateManagement,
    private bottomsheetMobileAppService: BottomsheetMobileAppService,
    private baseUrl: BaseUrlService,
  ) { }

  ngOnInit() {
    this.loadCompanyList();
  }
  private async loadCompanyList(): Promise<void> {
    try {
      // Load from local storage or default
      const storedRef = await this.appStateManagement.localStorage.getItem('SelectedCompanyRef');
      const storedName = await this.appStateManagement.localStorage.getItem('companyName');
      this.selectedCompany = [
        {
          "p": {
            "Ref": storedRef,
            "Name": storedName
          }
        }
      ];
      this.IsDefaultUser = await this.appStateManagement.localStorage.getItem('IsDefaultUser') == "1" ? false : true;
      // console.log('this.IsDefaultUser :', this.IsDefaultUser);
      const list = await Company.FetchEntireList(
        async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
      );
      this.CompanyList = list || [];
      if (storedRef && storedName) {
        this.CompanyRef = +storedRef;
        this.CompanyName = storedName;
        this.companystatemanagement.setCompanyRef(this.CompanyRef, this.CompanyName);
      } else if (this.CompanyList.length > 0) {
        this.changeCompany(this.CompanyList[0].p.Ref);
      }
      this.currentemployee = Number(this.appStateManagement.localStorage.getItem('LoginEmployeeRef'));
      this.LoginToken = this.appStateManagement.getLoginTokenForMobile();
      this.ImageBaseUrl = this.baseUrl.GenerateImageBaseUrl();
      if (this.currentemployee !== 0) {
        await this.getEmployeeDetails();
      }
    } catch (error) {
      // console.error('Company fetch failed:', error);
    }
  }

  getEmployeeDetails = async () => {
    if (this.currentemployee && this.CompanyRef) {
      const employeeData = await Employee.FetchInstance(
        this.currentemployee,
        this.CompanyRef,
        async errMsg => {
          // await this.toastService.present("Error " + errMsg, 1000, 'danger');
          // await this.haptic.error();
        }
      );
      // console.log('employeeData :', employeeData);
      if (employeeData == null) {
        const adminData = await AdminProfile.FetchAdminData(async errMsg => {
          // await this.toastService.present("Error " + errMsg, 1000, 'danger');
          // await this.haptic.error();
          // await this.uiUtils.showErrorMessage('Error', errMsg)
        }
        );

        // console.log('adminData :', adminData);

        if (adminData?.[0]) {
          this.AdminEntity = adminData[0];
          this.IsAdmin = true;
          this.IsEmployee = false;
          this.imageUrl = this.AdminEntity.p.ProfilePicPath;
          this.loadImageFromBackend(this.imageUrl);
        }
      } else {
        this.Entity = employeeData;
        this.IsEmployee = true;
        this.IsAdmin = false;
        this.imageUrl = this.Entity.p.ProfilePicPath;
        this.loadImageFromBackend(this.imageUrl);
        this.AdminEntity = AdminProfile.CreateNewInstance();
      }
    }
  };

  loadImageFromBackend(imageUrl: string | null): void {
    if (imageUrl) {
      this.imagePreviewUrl = `${this.ImageBaseUrl}${imageUrl}/${this.LoginToken}?${this.TimeStamp}`;
      this.selectedFileName = imageUrl;
    } else {
      this.imagePreviewUrl = null;
    }
  }

  changeCompany = (ref: number) => {
    const selected = this.CompanyList.find(c => c.p.Ref === ref);
    if (selected) {
      this.CompanyRef = selected.p.Ref;
      this.CompanyName = selected.p.Name;

      this.appStateManagement.localStorage.setItem('SelectedCompanyRef', `${selected.p.Ref}`);
      this.appStateManagement.localStorage.setItem('companyName', selected.p.Name);

      this.companystatemanagement.setCompanyRef(this.CompanyRef, this.CompanyName);
    }
  }

  onSelectionChange = (selected: Company[]) => {
    if (selected.length > 0) {
      this.changeCompany(selected[0].p.Ref);
    }
  }

  public async selectCountryBottomsheet(): Promise<void> {
    try {
      const selected = await this.bottomsheetMobileAppService.openSelectModal(
        this.CompanyList, this.selectedCompany, false, 'Select Company', 1
      );
      if (selected) {
        this.selectedCompany = selected;

        this.onSelectionChange(this.selectedCompany);
      }
    } catch (error) {
      // console.error('Company selection failed:', error);
    }
  }

  goToNotificationPage() {
    this.router.navigate(['/mobile-app/tabs/settings/notifications']);
  }
  goToProfilePage() {
    this.router.navigate(['/mobile-app/tabs/settings/profile']);
  }

  onGetCompany = () => {
    const storedCompanyRef =
      this.appStateManagement.localStorage.getItem('SelectedCompanyRef');
    const storedCompanyName =
      this.appStateManagement.localStorage.getItem('companyName');

    if (storedCompanyRef && storedCompanyName) {
      const ref = Number(storedCompanyRef);
      this.CompanyRef = ref;
      this.companystatemanagement.setCompanyRef(ref, storedCompanyName);
    } else if (this.CompanyList && this.CompanyList.length > 0) {
      // Select first company if no stored value is found
      const firstCompany = this.CompanyList[0];
      this.changeCompany(firstCompany.p.Ref);
    }
  }
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
}
