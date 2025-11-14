import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Owner } from 'src/app/classes/domain/entities/website/masters/ownermaster/owner';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-owner-master',
  standalone: false,
  templateUrl: './owner-master.component.html',
  styleUrls: ['./owner-master.component.scss'],
})
export class OwnerMasterComponent implements OnInit {

  Entity: Owner = Owner.CreateNewInstance();
  MasterList: Owner[] = [];
  DisplayMasterList: Owner[] = [];
  SearchString: string = '';
  SelectedOwner: Owner = Owner.CreateNewInstance();
  IsOtherExpenseApplicable: Boolean = false;
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = [ 'Name', 'Action'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement, private payloadPacketFacade: PayloadPacketFacade,
    private serverCommunicator: ServerCommunicatorService
  ) {
    effect(async () => {
      await this.getOwnerListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }


  getOwnerListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Owner.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;

    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  onEditClicked = async (item: Owner) => {
    this.SelectedOwner = item.GetEditableVersion();
    Owner.SetCurrentInstance(this.SelectedOwner);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Owner_Master_Details']);
  };

  onDeleteClicked = async (Owner: Owner) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
     Are you sure that you want to DELETE this Owner?`,
      async () => {
        await Owner.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Owner ${Owner.p.Name} has been deleted!`
          );
          await this.getOwnerListByCompanyRef();
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

  AddOwner = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.router.navigate(['/homepage/Website/Owner_Master_Details']);
  }
}

