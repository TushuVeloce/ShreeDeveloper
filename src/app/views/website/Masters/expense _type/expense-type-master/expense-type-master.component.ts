import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExpenseType } from 'src/app/classes/domain/entities/website/masters/expensetype/expensetype';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-expense-type-master',
  standalone: false,
  templateUrl: './expense-type-master.component.html',
  styleUrls: ['./expense-type-master.component.scss'],
})
export class ExpenseTypeMasterComponent  implements OnInit {

   Entity: ExpenseType = ExpenseType.CreateNewInstance();
   MasterList: ExpenseType[] = [];
   DisplayMasterList: ExpenseType[] = [];
   SearchString: string = '';
   SelectedExpenseType: ExpenseType = ExpenseType.CreateNewInstance();
   CustomerRef: number = 0;
   pageSize = 10; // Items per page
   currentPage = 1; // Initialize current page
   total = 0;
 
   companyRef = this.companystatemanagement.SelectedCompanyRef;
 
   headers: string[] = ['Sr.No.', 'Code', 'ExpenseType Name', 'ExpenseType Unit', 'Action'];
   constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
     private companystatemanagement: CompanyStateManagement
   ) {
     effect(async () => {
       await this.getExpenseTypeListByCompanyRef();
     });
   }
 
   async ngOnInit() {
     this.appStateManage.setDropdownDisabled(false);
     this.loadPaginationData();
     this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
   }
 
   getExpenseTypeListByCompanyRef = async () => {
     this.MasterList = [];
     this.DisplayMasterList = [];
     if (this.companyRef() <= 0) {
       await this.uiUtils.showErrorToster('Company not Selected');
       return;
     }
     let lst = await ExpenseType.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
     this.MasterList = lst;
 
     this.DisplayMasterList = this.MasterList;
     this.loadPaginationData();
   }
 
   onEditClicked = async (item: ExpenseType) => {
     this.SelectedExpenseType = item.GetEditableVersion();
     ExpenseType.SetCurrentInstance(this.SelectedExpenseType);
     this.appStateManage.StorageKey.setItem('Editable', 'Edit');
     await this.router.navigate(['/homepage/Website/ExpenseType_Master_Details']);
   };
 
   onDeleteClicked = async (ExpenseType: ExpenseType) => {
     await this.uiUtils.showConfirmationMessage(
       'Delete',
       `This process is <strong>IRREVERSIBLE!</strong> <br/>
     Are you sure that you want to DELETE this ExpenseType?`,
       async () => {
         await ExpenseType.DeleteInstance(async () => {
           await this.uiUtils.showSuccessToster(
             `ExpenseType ${ExpenseType.p.Name} has been deleted!`
           );
           await this.getExpenseTypeListByCompanyRef();
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
 
   AddExpenseType = () => {
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