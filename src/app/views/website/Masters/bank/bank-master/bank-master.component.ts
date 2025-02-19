import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Bank } from 'src/app/classes/domain/entities/website/masters/bank/bank';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-bank-master',
  standalone: false,
  templateUrl: './bank-master.component.html',
  styleUrls: ['./bank-master.component.scss'],
})
export class BankMasterComponent implements OnInit {

  Entity: Bank = Bank.CreateNewInstance();
  MasterList: Bank[] = [];
  DisplayMasterList: Bank[] = [];
  SearchString: string = '';
  SelectedBank: Bank = Bank.CreateNewInstance();
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;

  headers: string[] = ['Sr.No.', 'Bank Name', 'Branch Name', 'Account No', 'IFSC Code', 'Opening Balance', 'Action'];

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService) { }

  async ngOnInit() {
    await this.FormulateMasterList();
    this.loadPaginationData();

  }

  private FormulateMasterList = async () => {
      let lst = await Bank.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.MasterList = lst;
      this.DisplayMasterList = this.MasterList
      this.loadPaginationData();
    }
  
    onEditClicked = async (item: Bank) => {
      this.SelectedBank = item.GetEditableVersion();
      Bank.SetCurrentInstance(this.SelectedBank);
      this.appStateManage.StorageKey.setItem('Editable', 'Edit');
      await this.router.navigate(['/homepage/Website/Bank_Master_details']);
    }
  
    onDeleteClicked = async (Bank: Bank) => {
      await this.uiUtils.showConfirmationMessage('Delete',
        `This process is <strong>IRREVERSIBLE!</strong> <br/>
      Are you sure that you want to DELETE this Bank?`,
        async () => {
          await Bank.DeleteInstance(async () => {
            await this.uiUtils.showSuccessToster(`Bank ${Bank.p.Name} has been deleted!`);
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

  AddBank() {
    this.router.navigate(['/homepage/Website/Bank_Master_Details']);
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
