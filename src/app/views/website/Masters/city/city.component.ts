import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { City } from 'src/app/classes/domain/entities/website/masters/city/city';
import { Country } from 'src/app/classes/domain/entities/website/masters/country/country';
import { State } from 'src/app/classes/domain/entities/website/masters/state/state';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-city',
  standalone: false,
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss'],
})
export class CityComponent implements OnInit {
  Entity: City = City.CreateNewInstance();
  CountryList: Country[] = [];
  StateList: State[] = [];
  MasterList: City[] = [];
  DisplayMasterList: City[] = [];
  SearchString: string = '';
  SelectedCity: City = City.CreateNewInstance();
  CountryRef: number = 0;
  StateRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  headers: string[] = ['Sr.No.', 'City Name'];

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService,private screenSizeService: ScreenSizeService) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    await this.FormulateCountryList();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withDropdown');
  }

  private FormulateCountryList = async () => {
    this.CountryList = [];
    let lst = await Country.FetchEntireList(async errMsg =>
        await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.CountryList = lst;

    // Set default country (9163)
    const defaultCountry = this.CountryList.find(c => c.p.Ref === 9163);
    this.CountryRef = defaultCountry ? defaultCountry.p.Ref : this.CountryList[0]?.p.Ref;

    // Fetch states based on the selected country
    if (this.CountryRef) {
        await this.getStateListByCountryRef(this.CountryRef);
    }
};


getStateListByCountryRef = async (CountryRef: number) => {
  this.Entity.p.StateRef = 0;
  this.StateList = [];
  this.MasterList = [];
  this.DisplayMasterList = [];
  let lst = await State.FetchEntireListByCountryRef(CountryRef, async errMsg =>
      await this.uiUtils.showErrorMessage('Error', errMsg)
  );
  this.StateList = lst;

  // Set default state (10263)
  const defaultState = this.StateList.find(s => s.p.Ref === 10263);
  this.Entity.p.StateRef = defaultState ? defaultState.p.Ref : this.StateList[0]?.p.Ref;

  // Fetch cities based on selected state
  if (this.Entity.p.StateRef) {
      await this.getCityListByStateRef(this.Entity.p.StateRef);
  }

  this.loadPaginationData();
};


  getCityListByStateRef = async (StateRef: number) => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    let lst = await City.FetchEntireListByStateRef(StateRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  }

  paginatedList = () => {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  }
  filterTable = () => {
    debugger
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
