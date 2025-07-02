import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UnitRefs } from 'src/app/classes/domain/constants';
import { ApplicationFeatures } from 'src/app/classes/domain/domainenums/domainenums';
import { DeleteUnitCustomRequest } from 'src/app/classes/domain/entities/website/masters/unit/DeleteUnitCustomRequest';
import { Unit } from 'src/app/classes/domain/entities/website/masters/unit/unit';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { UIUtils } from 'src/app/services/uiutils.service';

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
  // ValidMenuItems: MenuItem[] = [];
  ApplicationFeatures?: ApplicationFeatures;

  headers: string[] = ['Sr.No.', 'Unit', 'Action'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService, private payloadPacketFacade: PayloadPacketFacade,
    private serverCommunicator: ServerCommunicatorService) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    // this.ValidMenuItems = this.appStateManage.StorageKey.getItem('ValidMenuItems');
    const rawItems = JSON.parse(sessionStorage.getItem('ValidMenuItems') || '[]');
    console.log('rawItems :', rawItems);
    // this.ValidMenuItems = rawItems.filter((data: MenuItem) => data.FeatureRef == ApplicationFeatures.UnitMaster);
    // console.log('this.ValidMenuItems :', this.ValidMenuItems);
    await this.FormulateUnitList();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
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


  //  DeleteUnit = async (Unit: Unit) => {
  //     await this.uiUtils.showConfirmationMessage(
  //       'Delete', `This process is <strong>IRREVERSIBLE!</strong> <br/>Are you sure that you want to DELETE this Unit?`,
  //       async () => {
  //         let req = new DeleteUnitCustomRequest();
  //         req.UnitRef = Unit.p.Ref;
  //         let td = req.FormulateTransportData();
  //         let pkt = this.payloadPacketFacade.CreateNewPayloadPacket2(td);
  //         let tr = await this.serverCommunicator.sendHttpRequest(pkt);
  //         if (!tr.Successful) {
  //           await this.uiUtils.showErrorMessage('Error', tr.Message);
  //           return;
  //         }
  //         await this.uiUtils.showSuccessToster(`Unit ${Unit.p.Name} has been deleted!`);
  //         let tdResult = JSON.parse(tr.Tag) as TransportData;
  //       }
  //     );
  //     this.FormulateUnitList()
  //     this.loadPaginationData()
  //     this.SearchString = '';
  //   };

  onDeleteClicked = async (Unit: Unit) => {
    await this.uiUtils.showConfirmationMessage('Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
      Are you sure that you want to DELETE this Unit?`,
      async () => {
        await Unit.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(`Unit ${Unit.p.Name} has been deleted!`);
          this.SearchString = '';
          this.loadPaginationData();
          this.FormulateUnitList();
        });
      });
  }


  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  };

  paginatedList = () => {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };

  AddUnit = () => {
    this.router.navigate(['/homepage/Website/Unit_Master_Details']);
  }

  filterTable = () => {
    if (this.SearchString != '') {
      this.DisplayMasterList = this.MasterList.filter((data: any) => {
        return data.p.Name.toLowerCase().indexOf(this.SearchString.toLowerCase()) > -1
      })
    }
    else {
      this.DisplayMasterList = this.MasterList
    }
  }
}

