import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Country } from 'src/app/classes/domain/entities/website/masters/country/country';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-country',
  standalone: false,
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
  Entity: Country = Country.CreateNewInstance();
  MasterList: Country[] = [];
  DisplayMasterList: Country[] = [];
  SearchString: string = '';
  SelectedCountry: Country = Country.CreateNewInstance();
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  headers: string[] = ['Sr.No.', 'Country Name', 'Action'];

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService) { }

 async ngOnInit() {
    await this.FormulateCountryList();
   }

     private FormulateCountryList = async () => {
       let lst = await Country.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
       this.MasterList = lst;
       this.DisplayMasterList = this.MasterList
     }

       // For Pagination  start ----
       loadPaginationData = () => {
         this.total = this.DisplayMasterList.length; // Update total based on loaded data
       }

}
