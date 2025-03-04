import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BankAccount } from 'src/app/classes/domain/entities/website/masters/bankaccount/banckaccount';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-bank-account-master',
  standalone: false,
  templateUrl: './bank-account-master.component.html',
  styleUrls: ['./bank-account-master.component.scss'],
})
export class BankAccountMasterComponent implements OnInit {

  Entity: BankAccount = BankAccount.CreateNewInstance();
  MasterList: BankAccount[] = [];
  DisplayMasterList: BankAccount[] = [];
  SearchString: string = '';
  SelectedBankAccount: BankAccount = BankAccount.CreateNewInstance();
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;


  headers: string[] = ['Sr.No.', 'Bank Name', 'Branch Name', 'Account No', 'IFSC Code', 'Opening Balance', 'Date of Opening', 'Action'];

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private companystatemanagement: CompanyStateManagement) {
    effect(() => {
      this.getBankListByCompanyRef()
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(false);
    await this.getBankListByCompanyRef();
    this.loadPaginationData();

  }

  // private FormulateMasterList = async () => {
  //     let lst = await Bank.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
  //     this.MasterList = lst;
  //     console.log(this.MasterList);

  //     this.DisplayMasterList = this.MasterList
  //     this.loadPaginationData();
  //   }

  getBankListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await BankAccount.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }
  onEditClicked = async (item: BankAccount) => {
    this.SelectedBankAccount = item.GetEditableVersion();
    BankAccount.SetCurrentInstance(this.SelectedBankAccount);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Bank_Master_Details']);
  }

  onDeleteClicked = async (BankAccount: BankAccount) => {
    await this.uiUtils.showConfirmationMessage('Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
      Are you sure that you want to DELETE this Bank Account?`,
      async () => {
        await BankAccount.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(`BankAccount ${BankAccount.p.Name} has been deleted!`);
          await this.getBankListByCompanyRef();
          this.SearchString = '';
          this.loadPaginationData();
        });
      });
  }

  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  }

  get paginatedList() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  }

  async AddBankAccount() {
    if (this.companyRef() <= 0) {
      this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.router.navigate(['/homepage/Website/Bank_Account_Master_Details']);
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
