import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { City } from 'src/app/classes/domain/entities/website/masters/city/city';
import { Country } from 'src/app/classes/domain/entities/website/masters/country/country';
import { State } from 'src/app/classes/domain/entities/website/masters/state/state';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
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
  headers: string[] = ['Sr.No.','City Name'];

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService) { }

  async ngOnInit() {
    await this.FormulateCountryList();
    this.loadPaginationData();
   }

     private FormulateCountryList = async () => {
      this.CountryList = [];
       let lst = await Country.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
       this.CountryList = lst;
       this.loadPaginationData();
     }

     getStateListByCountryRef = async (CountryRef: number) => {
      this.StateList = [];
      this.MasterList = [];
      this.DisplayMasterList = [];
      let lst = await State.FetchEntireListByCountryRef(CountryRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.StateList = lst;
      this.loadPaginationData();
    }

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

      get paginatedList () {
        const start = (this.currentPage - 1) * this.pageSize;
        return this.DisplayMasterList.slice(start, start + this.pageSize);
      }
    
      onPageChange  = (pageIndex: number): void => {
        this.currentPage = pageIndex; // Update the current page
      }

}
