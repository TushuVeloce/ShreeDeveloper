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
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  headers: string[] = ['Sr.No.','State Name', 'Action'];

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService) { }

  async ngOnInit() {
    await this.FormulateCountryList();
   }

     private FormulateCountryList = async () => {
       let lst = await Country.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
       this.CountryList = lst;
     }

     getStateListByCountryRef = async (CountryRef: number) => {
      this.MasterList = [];
      this.DisplayMasterList = [];
      let lst = await State.FetchEntireListByCountryRef(CountryRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.MasterList = lst;
      this.DisplayMasterList = this.MasterList;
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
