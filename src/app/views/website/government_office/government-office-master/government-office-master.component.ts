import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Document } from 'src/app/classes/domain/entities/website/government_office/document/document';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-government-office-master',
  templateUrl: './government-office-master.component.html',
  styleUrls: ['./government-office-master.component.scss'],
  standalone: false,
})

export class GovernmentOfficeMasterComponent implements OnInit {

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

  headers: string[] = ['Sr.No.', 'Site Name', 'TP Office', 'NA Letter', 'Mojani', 'ULC', 'Final Layout', 'KaJaPa', 'Action'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement
  ) {
    // effect(() => {
    //   this.getDocumentListByCompanyRef();
    // });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(false);
    // await this.FormulateDocumentList();
    // this.DisplayMasterList = [];
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  onEditClicked = async (item: Document) => {
    // this.SelectedDocument = item.GetEditableVersion();

    // Document.SetCurrentInstance(this.SelectedDocument);

    // this.appStateManage.StorageKey.setItem('Editable', 'Edit');

    await this.router.navigate(['/homepage/Website/Government_Office_Details']);
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
          // await this.getDocumentListByCompanyRef();
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
    this.router.navigate(['/homepage/Website/Government_Office_Details']);
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

  GovermentList = [
    {
      "SiteWorkGroupName": "Mojani",
      "SiteWorks": [{
        "SiteWork": [{
          "SiteWorkName": "T.P पत्र",
          "ApplicableTypes": [{
            "SiteWorkApplicableTypeName": "Submit",
            "Value": "false"
          }, {
            "SiteWorkApplicableTypeName": "Inward No",
            "Value": ""
          }, {
            "SiteWorkApplicableTypeName": "Date",
            "Value": ""
          }
          ]
        }
        ]
      }, {
        "SiteWork": [{
          "SiteWorkName": "प्राधिकरण Office पत्र",
          "ApplicableTypes": [{
            "SiteWorkApplicableTypeName": "Submit",
            "Value": "false"
          }
          ]
        }
        ]
      }
      ]
    }, {
      "SiteWorkGroupName": "T.P Office",
      "SiteWorks": [{
        "SiteWork": [{
          "SiteWorkName": "Survey Remark",
          "ApplicableTypes": [{
            "SiteWorkApplicableTypeName": "Submit",
            "Value": "false"
          }
          ]
        }
        ]
      }, {
        "SiteWork": [{
          "SiteWorkName": "Tentative Layout",
          "ApplicableTypes": [{
            "SiteWorkApplicableTypeName": "Submit",
            "Value": "false"
          }, {
            "SiteWorkApplicableTypeName": "Inward No",
            "Value": ""
          }, {
            "SiteWorkApplicableTypeName": "Date",
            "Value": ""
          }, {
            "SiteWorkApplicableTypeName": "Scrutiny Fees",
            "Value": ""
          }
          ]
        }
        ]
      }
      ]
    }
  ];


  getTypeOnApplicableTypeName = (ApplicableTypesName: string): '' | 'checkbox' | 'number' | 'date' | 'radio' | 'text' => {
    switch (ApplicableTypesName) {
      case 'Submit': return 'checkbox';
      case 'Inward No': return 'number';
      case 'Date': return 'date';
      case 'Scrutiny Fees': return 'checkbox';
      default:
        return ''; // Default return value
    }
  }

}
