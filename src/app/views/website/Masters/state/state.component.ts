import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Country } from 'src/app/classes/domain/entities/website/masters/country/country';
import { State } from 'src/app/classes/domain/entities/website/masters/state/state';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-state',
  standalone: false,
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss'],
})
export class StateComponent implements OnInit {
  Entity: State = State.CreateNewInstance();
  CountryList: Country[] = [];
  MasterList: State[] = [];
  DisplayMasterList: State[] = [];
  SearchString: string = '';
  SelectedState: State = State.CreateNewInstance();
  CountryRef: number = 0;
  pageSize = 8; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  headers: string[] = ['Sr.No.', 'State Name'];


  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    await this.FormulateCountryList();
    this.loadPaginationData();
  }

  // private FormulateCountryList = async () => {
  //   let lst = await Country.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
  //   this.CountryList = lst;
  //   this.loadPaginationData();
  // }

  private FormulateCountryList = async () => {
    let lst = await Country.FetchEntireList(async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.CountryList = lst;
    // Set "India" (Ref: 9162) as default if present; otherwise, pick the first country.
    const defaultCountry = this.CountryList.find((c) => c.p.Ref === 9163);
    this.Entity.p.CountryRef = defaultCountry ? defaultCountry.p.Ref : this.CountryList[0]?.p.Ref;

    // Fetch states based on the selected country
    if (this.Entity.p.CountryRef) {
      await this.getStateListByCountryRef(this.Entity.p.CountryRef);
    }
    this.loadPaginationData();
  };
  

  getStateListByCountryRef = async (CountryRef: number) => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    let lst = await State.FetchEntireListByCountryRef(CountryRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
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

  // filterTable = () => {
  //   debugger
  //   if (this.SearchString != '') {
  //     this.DisplayMasterList = this.MasterList.filter((data: any) => {
  //       return data.p.Name.toLowerCase().indexOf(this.SearchString.toLowerCase()) > -1
  //     })
  //   }
  //   else {
  //     this.DisplayMasterList = this.MasterList
  //   }
  // }

  filterTable = () => {
    const searchTerm = this.SearchString?.trim().toLowerCase();

    if (searchTerm) {
      this.DisplayMasterList = this.MasterList.filter((data: any) => {
        // Check if data.p and data.p.Name exist before accessing
        return data?.p?.Name?.toLowerCase().includes(searchTerm);
      });
    } else {
      // If no search string, reset to the full list
      this.DisplayMasterList = [...this.MasterList];
    }
  };


}
