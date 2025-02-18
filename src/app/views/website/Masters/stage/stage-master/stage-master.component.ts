import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Stage } from 'src/app/classes/domain/entities/website/masters/stage/stage';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-stage-master',
  standalone: false,
  templateUrl: './stage-master.component.html',
  styleUrls: ['./stage-master.component.scss'],
})
export class StageMasterComponent  implements OnInit {

   Entity: Stage = Stage.CreateNewInstance();
    MasterList: Stage[] = [];
    DisplayMasterList: Stage[] = [];
    SearchString: string = '';
    SelectedStage: Stage = Stage.CreateNewInstance();
    pageSize = 10; // Items per page
    currentPage = 1; // Initialize current page
    total = 0;

  headers: string[] = ['Stage.No.','Stage Name'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService) { }

  async ngOnInit() {
    await this.FormulateMasterList();
    this.loadPaginationData();
  }

   private FormulateMasterList = async () => {
      let lst = await Stage.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.MasterList = lst;
      this.DisplayMasterList = this.MasterList
      this.loadPaginationData();
    }
  
    onEditClicked = async (item: Stage) => {
      this.SelectedStage = item.GetEditableVersion();
      Stage.SetCurrentInstance(this.SelectedStage);
      this.appStateManage.StorageKey.setItem('Editable', 'Edit');
      await this.router.navigate(['/homepage/Website/Stage_Master_details']);
    }
  
    onDeleteClicked = async (Stage: Stage) => {
      await this.uiUtils.showConfirmationMessage('Delete',
        `This process is <strong>IRREVERSIBLE!</strong> <br/>
      Are you sure that you want to DELETE this Stage?`,
        async () => {
          await Stage.DeleteInstance(async () => {
            await this.uiUtils.showSuccessToster(`Stage ${Stage.p.Name} has been deleted!`);
            await this.FormulateMasterList();
            this.SearchString = '';
            this.loadPaginationData();
          });
        });
    }
  
    // For Pagination  start ----
    loadPaginationData = () => {
      this.total = this.DisplayMasterList.length; // Update total based on loaded data
    }
  
    get paginatedList () {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.DisplayMasterList.slice(start, start + this.pageSize);
    }
  
    onPageChange  = (pageIndex: number): void => {
      this.currentPage = pageIndex; // Update the current page
    }
  

  AddStage(){
    this.router.navigate(['/homepage/Website/Stage_Master_Details']);
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
