import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Stage } from 'src/app/classes/domain/entities/website/masters/stage/stage';
import { SubStage } from 'src/app/classes/domain/entities/website/masters/substage/subStage';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';

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
      await this.getStageListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    // this.getStageListByCompanyRef()
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  getStageListByCompanyRef = async () => {
    this.Entity.p.StageRef = 0;
    this.StageList = []
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Stage.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.StageList = lst;
    if (this.StageList.length > 0) {
      this.Entity.p.StageRef = this.StageList[0].p.Ref
      this.getSubStageListByStageRef(this.Entity.p.StageRef)
    } else {
      this.DisplayMasterList = [];
    }

  }

  getSubStageListByStageRef = async (stageref: number) => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (stageref > 0) {
      let lst = await SubStage.FetchEntireListByStageRef(stageref, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.MasterList = lst;
      this.DisplayMasterList = this.MasterList;
    }
    this.loadPaginationData();
  }

  onEditClicked = async (item: SubStage) => {
    this.SelectedSubStage = item.GetEditableVersion();
    SubStage.SetCurrentInstance(this.SelectedSubStage);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Sub_Stage_Master_Details']);
  };

  onDeleteClicked = async (SubStage: SubStage) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
     Are you sure that you want to DELETE this Sub Stage?`,
      async () => {
        await SubStage.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Sub Stage ${SubStage.p.Name} has been deleted!`
          );
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

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };

  AddSubStage = () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    }
    this.router.navigate(['/homepage/Website/Sub_Stage_Master_Details']);
  }
}
