import { Component, effect, OnInit } from '@angular/core';
import { Designation } from 'src/app/classes/domain/entities/website/masters/designation/designation';
import { Router } from '@angular/router';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-designation-master',
  standalone: false,
  templateUrl: './designation-master.component.html',
  styleUrls: ['./designation-master.component.scss'],
})
export class DesignationMasterComponent  implements OnInit {

 Entity: Designation = Designation.CreateNewInstance();
   MasterList: Designation[] = [];
   DisplayMasterList: Designation[] = [];
   SearchString: string = '';
   SelectedDesignation: Designation = Designation.CreateNewInstance();
   CustomerRef: number = 0;
   pageSize = 10; // Items per page
   currentPage = 1; // Initialize current page
   total = 0;
 
   companyRef = this.companystatemanagement.SelectedCompanyRef;
   
   headers: string[] = ['Sr.No.', 'Department', 'Designation', 'Seniority Level', 'Action'];
   constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
     private companystatemanagement: CompanyStateManagement
   ) {
     effect(() => {
       // this.getDesignationListByCompanyRef()
           this.getDesignationListByCompanyRef();
     });
   }
 
   // effect(() => {
   //   // this.getDesignationListByCompanyRef()
   //   setTimeout(() => {
   //     if (this.companyRef() > 0) {
   //       this.getDesignationListByCompanyRef();
   //     }
   //   }, 300);
   // });
 
 
 
   
   async ngOnInit() {
     this.appStateManage.setDropdownDisabled(false);
     // await this.FormulateDesignationList();
     // this.DisplayMasterList = [];
     this.loadPaginationData();
     this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
   }
   // private FormulateDesignationList = async () => {
   //   let lst = await Designation.FetchEntireList(
   //     async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
   //   );
   //   this.MasterList = lst;
   //   console.log('MasterList :', this.MasterList);
   //   this.DisplayMasterList = this.MasterList;
   //   this.loadPaginationData();
   //   // console.log(this.DisplayMasterList);
   // };
 
   getDesignationListByCompanyRef = async () => {
     this.MasterList = [];
     this.DisplayMasterList = [];
     console.log('companyRef :', this.companyRef());
     if (this.companyRef() <= 0) {
       await this.uiUtils.showErrorToster('Company not Selected');
       return;
     }
     let lst = await Designation.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
     this.MasterList = lst;
     console.log('DesignationList :', this.MasterList);
 
     this.DisplayMasterList = this.MasterList;
     this.loadPaginationData();
   }
   onEditClicked = async (item: Designation) => {
     // let props = Object.assign(DesignationProps.Blank(),item.p);
     // this.SelectedDesignation = Designation.CreateInstance(props,true);
 
     this.SelectedDesignation = item.GetEditableVersion();
 
     Designation.SetCurrentInstance(this.SelectedDesignation);
 
     this.appStateManage.StorageKey.setItem('Editable', 'Edit');
 
     await this.router.navigate(['/homepage/Website/Designation_Master_Details']);
   };
 
   onDeleteClicked = async (Designation: Designation) => {
     await this.uiUtils.showConfirmationMessage(
       'Delete',
       `This process is <strong>IRREVERSIBLE!</strong> <br/>
     Are you sure that you want to DELETE this Designation?`,
       async () => {
         await Designation.DeleteInstance(async () => {
           await this.uiUtils.showSuccessToster(
             `Designation ${Designation.p.Name} has been deleted!`
           );
           await this.getDesignationListByCompanyRef();
           this.SearchString = '';
           this.loadPaginationData();
           // await this.FormulateDesignationList();
 
         });
       }
     );
   };
 
   // For Pagination  start ----
   loadPaginationData = () => {
     this.total = this.DisplayMasterList.length; // Update total based on loaded data
   };
   get paginatedList() {
     const start = (this.currentPage - 1) * this.pageSize;
     return this.DisplayMasterList.slice(start, start + this.pageSize);
   }
 
   onPageChange = (pageIndex: number): void => {
     this.currentPage = pageIndex; // Update the current page
   };
 
   async AddDesignation() {
     if (this.companyRef() <= 0) {
       this.uiUtils.showErrorToster('Company not Selected');
       return;
     }
     this.router.navigate(['/homepage/Website/Designation_Master_Details']);
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
