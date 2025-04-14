import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Company } from 'src/app/classes/domain/entities/website/masters/company/company';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { SessionValues } from 'src/app/services/sessionvalues.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent implements OnInit {
  CompanyList: Company[] = [];
  selectedCompany: Company[] = [];
  CompanyRef: number = 0;
  @Input() title: string = 'Default Title';

  showHeader = (): boolean => {
    const hiddenRoutes = [
      '/app_homepage/task/add',
      '/app_homepage/task/edit',
      // '/app_homepage/home',
    ];
    return !hiddenRoutes.includes(this.router.url);
  }
  options = [
    { Ref: 1, Name: 'Apple' },
    { Ref: 2, Name: 'Banana' },
    { Ref: 3, Name: 'Cherry' },
    { Ref: 4, Name: 'Date' },
    { Ref: 5, Name: 'Elderberry' },
    { Ref: 6, Name: 'Fig' },
    { Ref: 7, Name: 'Grapes' },
    { Ref: 8, Name: 'Honeydew' },
    { Ref: 9, Name: 'Indian Fig' },
    { Ref: 10, Name: 'Jackfruit' },
    { Ref: 11, Name: 'Kiwi' },
    { Ref: 12, Name: 'Lemon' },
    { Ref: 13, Name: 'Mango' },
    { Ref: 14, Name: 'Nectarine' },
    { Ref: 15, Name: 'Orange' },
    { Ref: 16, Name: 'Papaya' },
    { Ref: 17, Name: 'Quince' },
    { Ref: 18, Name: 'Raspberry' },
    { Ref: 19, Name: 'Strawberry' },
    { Ref: 20, Name: 'Tomato' }
  ];

  constructor(
    public router: Router,
    public appStateManagement: AppStateManageService,
    private uiUtils: UIUtils,
    private companystatemanagement: CompanyStateManagement,
  ) {}

  ngOnInit() {
    this.onGetCompany();
    this.FormulateCompanyList();
    console.log(this.CompanyList);
  }
  private FormulateCompanyList = async ()=> {
    let lst = await Company.FetchEntireList(
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.CompanyList = lst;
    console.log('CompanyList :', this.CompanyList);

    // Set default selection if there is no stored value
    this.onGetCompany();
  }

  onGetCompany =()=> {
    const storedCompanyRef =
      this.appStateManagement.StorageKey.getItem('SelectedCompanyRef');
    const storedCompanyName =
      this.appStateManagement.StorageKey.getItem('companyName');

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

  onSelectionChange = (selected: Company[]) => {
    console.log('Selected option:', selected[0].p.Ref);
    this.changeCompany(selected[0].p.Ref);
  }

  changeCompany=(ref: number)=> {
    const selectedCompany = this.CompanyList.find(
      (company) => company.p.Ref === ref
    );
    if (selectedCompany) {
      this.appStateManagement.StorageKey.setItem(
        'SelectedCompanyRef',
        selectedCompany.p.Ref.toString()
      );
      this.appStateManagement.StorageKey.setItem(
        'companyName',
        selectedCompany.p.Name
      );

      this.companystatemanagement.setCompanyRef(ref, selectedCompany.p.Name);
      this.CompanyRef = ref;
    } else {
      console.warn('Selected company not found');
    }
  }

  goToNotificationPage() {
    console.log('Selected option:', '/app_homepage/notifications');
    this.router.navigate(['/app_homepage/notifications']);
    // this.router.navigate(['/notifications']);
  }
}
