import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { Stage } from 'src/app/classes/domain/entities/website/masters/stage/stage';
import { SubStage } from 'src/app/classes/domain/entities/website/masters/substage/subStage';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { DeleteSubStageCustomRequest } from 'src/app/classes/domain/entities/website/masters/substage/DeleteSubStageCustomRequest';

@Component({
  selector: 'app-sub-stage-master',
  standalone: false,
  templateUrl: './sub-stage-master.component.html',
  styleUrls: ['./sub-stage-master.component.scss'],
})
export class SubStageMasterComponent implements OnInit {
  Entity: SubStage = SubStage.CreateNewInstance();
  MasterList: SubStage[] = [];
  DisplayMasterList: SubStage[] = [];
  SearchString: string = '';
  StageList: Stage[] = [];
  SelectedSubStage: SubStage = SubStage.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Stage Name', 'Stage Type', 'Sub Stage Name', 'Action'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement, private payloadPacketFacade: PayloadPacketFacade,
    private serverCommunicator: ServerCommunicatorService
  ) {
    effect(async () => {
      await this.getSubStageListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(false);
    this.getStageListByCompanyRef()
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  getStageListByCompanyRef = async () => {
    this.StageList = []
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Stage.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.StageList = lst.filter(stage => stage.p.IsSubStageApplicable === true);
  }

  getSubStageListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await SubStage.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  getSubStageListByStageRef = async (stageref: number) => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (stageref > 0) {
      let lst = await SubStage.FetchEntireListByStageRef(stageref, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.MasterList = lst;
      this.DisplayMasterList = this.MasterList;
    } else {
      this.getSubStageListByCompanyRef()
    }
    this.loadPaginationData();
  }

  onEditClicked = async (item: SubStage) => {
    this.SelectedSubStage = item.GetEditableVersion();
    SubStage.SetCurrentInstance(this.SelectedSubStage);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Sub_Stage_Master_Details']);
  };

  DeleteSubStage = async (SubStage: SubStage) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete', `This process is <strong>IRREVERSIBLE!</strong> <br/>Are you sure that you want to DELETE this SubStage?`,
      async () => {
        let req = new DeleteSubStageCustomRequest();
        req.SubStageRef = SubStage.p.Ref;
        let td = req.FormulateTransportData();
        console.log('td :', td);
        let pkt = this.payloadPacketFacade.CreateNewPayloadPacket2(td);
        let tr = await this.serverCommunicator.sendHttpRequest(pkt);
        if (!tr.Successful) {
          await this.uiUtils.showErrorMessage('Error', tr.Message);
          return;
        }
        await this.uiUtils.showSuccessToster(`Stage ${SubStage.p.Name} has been deleted!`);
        let tdResult = JSON.parse(tr.Tag) as TransportData;
      }
    );
    this.getSubStageListByCompanyRef()
    this.loadPaginationData()
     this.SearchString = '';
  };

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

  AddSubStage = () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.router.navigate(['/homepage/Website/Sub_Stage_Master_Details']);
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
