import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Document } from 'src/app/classes/domain/entities/website/government_office/document/document';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-document-list',
  standalone: false,
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
})
export class DocumentListComponent  implements OnInit {

  Entity: Document = Document.CreateNewInstance();
    MasterList: Document[] = [];
    DisplayMasterList: Document[] = [];
    SearchString: string = '';
    SelectedDocument: Document = Document.CreateNewInstance();
    CustomerRef: number = 0;
    pageSize = 10; // Items per page
    currentPage = 1; // Initialize current page
    total = 0;

    companyRef = this.companystatemanagement.SelectedCompanyRef;

    headers: string[] = ['Sr.No.', 'Code', 'Document Name', 'Document Unit', 'Action'];
    constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
      private companystatemanagement: CompanyStateManagement
    ) {
      effect(() => {
        // this.getDocumentListByCompanyRef()
            this.getDocumentListByCompanyRef();
      });
    }

    // effect(() => {
    //   // this.getDocumentListByCompanyRef()
    //   setTimeout(() => {
    //     if (this.companyRef() > 0) {
    //       this.getDocumentListByCompanyRef();
    //     }
    //   }, 300);
    // });




    async ngOnInit() {
      this.appStateManage.setDropdownDisabled(false);
      // await this.FormulateDocumentList();
      // this.DisplayMasterList = [];
      this.loadPaginationData();
      this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
    }
    // private FormulateDocumentList = async () => {
    //   let lst = await Document.FetchEntireList(
    //     async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    //   );
    //   this.MasterList = lst;
    //   console.log('MasterList :', this.MasterList);
    //   this.DisplayMasterList = this.MasterList;
    //   this.loadPaginationData();
    //   // console.log(this.DisplayMasterList);
    // };

    getDocumentListByCompanyRef = async () => {
      this.MasterList = [];
      this.DisplayMasterList = [];
      console.log('companyRef :', this.companyRef());
      if (this.companyRef() <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }
      let lst = await Document.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.MasterList = lst;
      console.log('DocumentList :', this.MasterList);

      this.DisplayMasterList = this.MasterList;
      this.loadPaginationData();
    }

    onEditClicked = async (item: Document) => {
      // let props = Object.assign(DocumentProps.Blank(),item.p);
      // this.SelectedDocument = Document.CreateInstance(props,true);

      this.SelectedDocument = item.GetEditableVersion();

      Document.SetCurrentInstance(this.SelectedDocument);

      this.appStateManage.StorageKey.setItem('Editable', 'Edit');

      await this.router.navigate(['/homepage/Website/Document_Master_Details']);
    };

    onDeleteClicked = async (document: Document) => {
      await this.uiUtils.showConfirmationMessage(
        'Delete',
        `This process is <strong>IRREVERSIBLE!</strong> <br/>
      Are you sure that you want to DELETE this Document?`,
        async () => {
          await document.DeleteInstance(async () => {
            await this.uiUtils.showSuccessToster(
              `Document ${document.p.Name} has been deleted!`
            );
            await this.getDocumentListByCompanyRef();
            this.SearchString = '';
            this.loadPaginationData();
            // await this.FormulateDocumentList();

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

    async AddDocument() {
      if (this.companyRef() <= 0) {
        this.uiUtils.showErrorToster('Company not Selected');
        return;
      }
      this.router.navigate(['/homepage/Website/Document_Master_Details']);
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
