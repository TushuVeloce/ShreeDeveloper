import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Marketing } from 'src/app/classes/domain/entities/website/masters/marketing/marketing';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-marketing-master',
  standalone: false,
  templateUrl: './marketing-master.component.html',
  styleUrls: ['./marketing-master.component.scss'],
})
export class MarketingMasterComponent  implements OnInit {

    Entity: Marketing = Marketing.CreateNewInstance();
    MasterList: Marketing[] = [];
    DisplayMasterList: Marketing[] = [];
    SearchString: string = '';
    SelectedMarketing: Marketing = Marketing.CreateNewInstance();
    pageSize = 10; // Items per page
    currentPage = 1; // Initialize current page
    total = 0;

  headers: string[] = ['Sr.No.','Marketing Type','Description','Action'];
constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService) { }

  async ngOnInit() {
    await this.FormulateMasterList();
    this.loadPaginationData();
  }
  
  private FormulateMasterList = async () => {
    let lst = await Marketing.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList
    this.loadPaginationData();
  }

  onEditClicked = async (item: Marketing) => {
    this.SelectedMarketing = item.GetEditableVersion();
    Marketing.SetCurrentInstance(this.SelectedMarketing);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Marketing_Master_details']);
  }

  onDeleteClicked = async (Marketing: Marketing) => {
    await this.uiUtils.showConfirmationMessage('Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
    Are you sure that you want to DELETE this Marketing Mode?`,
      async () => {
        await Marketing.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(`Marketing ${Marketing.p.MarketingModes} has been deleted!`);
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


  AddMarketing(){
    this.router.navigate(['/homepage/Website/Marketing_Master_Details']);
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
