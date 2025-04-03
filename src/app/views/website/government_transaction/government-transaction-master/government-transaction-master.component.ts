import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GovernmentTransaction } from 'src/app/classes/domain/entities/website/government_office/government_transaction/governmenttransaction';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-government-transaction-master',
  templateUrl: './government-transaction-master.component.html',
  styleUrls: ['./government-transaction-master.component.scss'],
  standalone: false,
})

export class GovernmentTransactionMasterComponent implements OnInit {

  Entity: GovernmentTransaction = GovernmentTransaction.CreateNewInstance();
  MasterList: GovernmentTransaction[] = [];
  DisplayMasterList: GovernmentTransaction[] = [];
  SearchString: string = '';
  SelectedGovernmentTransaction: GovernmentTransaction = GovernmentTransaction.CreateNewInstance();
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
    //   this.getGovernmentTransactionListByCompanyRef();
    // });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(false);
    await this.FormulateGovernmentTransactionList();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  FormulateGovernmentTransactionList = async () => {
    // let lst = await GovernmentTransaction.FetchEntireListByCompanyRef(
    //   this.companyRef(), async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.DisplayMasterList = [];
    let lst = await GovernmentTransaction.FetchEntireList(async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    console.log('GovernmentTransactionList', this.MasterList);
    
  }

  onEditClicked = async (item: GovernmentTransaction) => {
    this.SelectedGovernmentTransaction = item.GetEditableVersion();

    GovernmentTransaction.SetCurrentInstance(this.SelectedGovernmentTransaction);

    this.appStateManage.StorageKey.setItem('Editable', 'Edit');

    await this.router.navigate(['/homepage/Website/Government_Office_Details']);
  };

  onDeleteClicked = async (GovernmentTransaction: GovernmentTransaction) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
       Are you sure that you want to DELETE this GovernmentTransaction?`,
      async () => {
        await GovernmentTransaction.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `GovernmentTransaction ${GovernmentTransaction.p.SiteName} has been deleted!`
          );
          // await this.getGovernmentTransactionListByCompanyRef();
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

  AddGovernmentTransaction = async () => {
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
