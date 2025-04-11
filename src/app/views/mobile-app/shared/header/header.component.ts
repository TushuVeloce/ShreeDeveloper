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
  CompnyList: Company[] = [];
  selectedCompany: Company[] = [];
  CompanyRef: number = 0;
  @Input() title: string = 'Default Title';
  constructor(
    public router: Router,
    public appStateManagement: AppStateManageService,
    private sessionValues: SessionValues,
    private cdr: ChangeDetectorRef,
    private uiUtils: UIUtils,
    private companystatemanagement: CompanyStateManagement,
    private servercommunicator: ServerCommunicatorService
  ) {}

  ngOnInit() {
    this.ongetcompany();
    this.FormulateCompanyList();
    console.log(this.CompnyList);
    // this.selectedCompany = this.CompnyList.find(
    //   (company) => company.p.Ref === this.CompanyRef
    // );
    // this.onSelectionChange(this.selectedCompany);
    // this.CompnyListData=this.CompnyList[0].p;
  }
  showHeader(): boolean {
    const hiddenRoutes = [
      '/app_homepage/task/add',
      '/app_homepage/task/edit',
      // '/app_homepage/home',
    ];
    return !hiddenRoutes.includes(this.router.url);
  }
  // departments = [
  //   { id: 1, value: 'company 1' },
  //   { id: 2, value: 'company 2' },
  //   { id: 3, value: 'company 3' },
  //   { id: 4, value: 'company 4' },
  //   { id: 5, value: 'company 5' },
  // ];
  // selectedDepartment: any = null;
  // handleDepartmentSelect(item: any) {
  //   this.selectedDepartment = item;
  // }
  // options = [
  //   { id: 1, value: 'Apple' },
  //   { id: 2, value: 'Banana' },
  //   { id: 3, value: 'Cherry' },
  //   { id: 4, value: 'Date' },
  //   { id: 5, value: 'Elderberry' },
  //   { id: 6, value: 'Fig' },
  //   { id: 7, value: 'Grapes' },
  //   { id: 8, value: 'Honeydew' },
  //   { id: 9, value: 'Indian Fig' },
  //   { id: 10, value: 'Jackfruit' },
  //   { id: 11, value: 'Kiwi' },
  //   { id: 12, value: 'Lemon' },
  //   { id: 13, value: 'Mango' },
  //   { id: 14, value: 'Nectarine' },
  //   { id: 15, value: 'Orange' },
  //   { id: 16, value: 'Papaya' },
  //   { id: 17, value: 'Quince' },
  //   { id: 18, value: 'Raspberry' },
  //   { id: 19, value: 'Strawberry' },
  //   { id: 20, value: 'Tomato' }
  // ];

  private async FormulateCompanyList() {
    let lst = await Company.FetchEntireList(
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.CompnyList = lst;
    console.log('CompnyList :', this.CompnyList);

    // Set default selection if there is no stored value
    this.ongetcompany();
  }

  ongetcompany() {
    const storedCompanyRef =
      this.appStateManagement.StorageKey.getItem('SelectedCompanyRef');
    const storedCompanyName =
      this.appStateManagement.StorageKey.getItem('companyName');

    if (storedCompanyRef && storedCompanyName) {
      const ref = Number(storedCompanyRef);
      this.CompanyRef = ref;
      this.companystatemanagement.setCompanyRef(ref, storedCompanyName);
    } else if (this.CompnyList && this.CompnyList.length > 0) {
      // Select first company if no stored value is found
      const firstCompany = this.CompnyList[0];
      this.changecompany(firstCompany.p.Ref);
    }
  }

  changecompany(ref: number) {
    const selectedCompany = this.CompnyList.find(
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

  onSelectionChange(selected: Company[]) {
    console.log('Selected option:', selected[0].p.Ref);
    this.changecompany(selected[0].p.Ref);
  }

  goToNotificationPage() {
    console.log('Selected option:', '/app_homepage/notifications');
    this.router.navigate(['/app_homepage/notifications']);
    // this.router.navigate(['/notifications']);
  }
}
