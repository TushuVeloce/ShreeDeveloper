import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationFeatures } from 'src/app/classes/domain/domainenums/domainenums';
import { Payer } from 'src/app/classes/domain/entities/website/masters/payer/payer';
import { Stage } from 'src/app/classes/domain/entities/website/masters/stage/stage';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { FeatureAccessService } from 'src/app/services/feature-access.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-payer',
  standalone: false,
  templateUrl: './payer.component.html',
  styleUrls: ['./payer.component.scss'],
})
export class PayerComponent implements OnInit {


  Entity: Payer = Payer.CreateNewInstance();
  MasterList: Payer[] = [];
  DisplayMasterList: Payer[] = [];
  SearchString: string = '';
  SelectedPayer: Payer = Payer.CreateNewInstance();
  IsOtherExpenseApplicable: Boolean = false;
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  // headers: string[] = [ 'Name', 'Action'];
    headers: string[] = [];
    featureRef: ApplicationFeatures = ApplicationFeatures.PayerMaster;
    showActionColumn = false;

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement, public access: FeatureAccessService) {
    effect(async () => {
      await this.getPayerListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
        this.access.refresh()
    this.showActionColumn = this.access.canEdit(this.featureRef) || this.access.canDelete(this.featureRef);
    this.headers = [
      'Name',
      ...(this.showActionColumn ? ['Action'] : []),
    ];
  }


  getPayerListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Payer.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;

    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  onEditClicked = async (item: Payer) => {
    this.SelectedPayer = item.GetEditableVersion();
    Payer.SetCurrentInstance(this.SelectedPayer);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Payer_Master_Details']);
  };

  onDeleteClicked = async (Payer: Payer) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
     Are you sure that you want to DELETE this Expense Type?`,
      async () => {
        await Payer.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Expense Type ${Payer.p.Name} has been deleted!`
          );
          await this.getPayerListByCompanyRef();
          this.SearchString = '';
          this.loadPaginationData();
        });
      }
    );
  };

  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  };

  paginatedList = () => {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }

  // 🔑 Whenever filteredList event is received
  onFilteredList(list: any[]) {
    this.DisplayMasterList = list;
    this.currentPage = 1;   // reset to first page after filtering

    this.loadPaginationData();
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };

  AddPayer = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.router.navigate(['/homepage/Website/Payer_Master_Details']);
  }
}
