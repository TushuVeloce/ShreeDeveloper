import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UnitRefs } from 'src/app/classes/domain/constants';
import { ApplicationFeatures } from 'src/app/classes/domain/domainenums/domainenums';
import { Unit } from 'src/app/classes/domain/entities/website/masters/unit/unit';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { FeatureAccessService } from 'src/app/services/feature-access.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { ValidMenuItemsStateManagement } from 'src/app/services/ValidMenuItems';

@Component({
  selector: 'app-unit-master',
  standalone: false,
  templateUrl: './unit-master.component.html',
  styleUrls: ['./unit-master.component.scss'],
})
export class UnitMasterComponent implements OnInit {
  Entity: Unit = Unit.CreateNewInstance();
  MasterList: Unit[] = [];
  DisplayMasterList: Unit[] = [];
  SearchString: string = '';
  SelectedUnit: Unit = Unit.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  TimeUnitRef: number = UnitRefs.TimeUnitRef;
  ValidMenuItems: any;
  headers: string[] = [];
  featureRef: ApplicationFeatures = ApplicationFeatures.UnitMaster;
  showActionColumn = false;

  // headers: string[] = ['Sr.No.', 'Unit', 'Action'];
  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private appStateManage: AppStateManageService,
    private screenSizeService: ScreenSizeService,
    private payloadPacketFacade: PayloadPacketFacade,
    private serverCommunicator: ServerCommunicatorService,
    private ValidMenuItem: ValidMenuItemsStateManagement,
    public access: FeatureAccessService
  ) {}

  async ngOnInit() {
    await this.appStateManage.setDropdownDisabled(true);
    await this.FormulateUnitList();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
    this.access.refresh();
    this.showActionColumn =
      this.access.canEdit(this.featureRef) ||
      this.access.canDelete(this.featureRef);
    this.headers = [
      'Sr.No.',
      'Unit',
      ...(this.showActionColumn ? ['Action'] : []),
    ];
  }
  private FormulateUnitList = async () => {
    let lst = await Unit.FetchEntireList(
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  onEditClicked = async (item: Unit) => {
    this.SelectedUnit = item.GetEditableVersion();

    Unit.SetCurrentInstance(this.SelectedUnit);

    this.appStateManage.StorageKey.setItem('Editable', 'Edit');

    await this.router.navigate(['/homepage/Website/Unit_Master_Details']);
  };

  onDeleteClicked = async (Unit: Unit) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
      Are you sure that you want to DELETE this Unit?`,
      async () => {
        await Unit.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Unit ${Unit.p.Name} has been deleted!`
          );
          this.SearchString = '';
          this.loadPaginationData();
          this.FormulateUnitList();
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
  };

  // 🔑 Whenever filteredList event is received
  onFilteredList(list: any[]) {
    this.DisplayMasterList = list;
    this.currentPage = 1; // reset to first page after filtering

    this.loadPaginationData();
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };

  AddUnit = () => {
    this.router.navigate(['/homepage/Website/Unit_Master_Details']);
  };
}
