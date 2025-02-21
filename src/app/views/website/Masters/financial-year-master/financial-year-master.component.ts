import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FinancialYear } from 'src/app/classes/domain/entities/website/masters/state copy/financialyear';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-financial-year-master',
  templateUrl: './financial-year-master.component.html',
  styleUrls: ['./financial-year-master.component.scss'],
  standalone: false,
})
export class FinancialYearMasterComponent implements OnInit {


  Entity: FinancialYear = FinancialYear.CreateNewInstance();
  MasterList: FinancialYear[] = [];
  DisplayMasterList: FinancialYear[] = [];
  SearchString: string = '';
  SelectedMarketing: FinancialYear = FinancialYear.CreateNewInstance();
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;


  headers: string[] = ['Sr.No.', 'From Date', 'To Date'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService,
    private dtu: DTU, private datePipe: DatePipe
  ) { }

  async ngOnInit() {
    await this.FormulateMasterList();
    this.convertdate();

  }

  private FormulateMasterList = async () => {
    let lst = await FinancialYear.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;

    this.DisplayMasterList = this.MasterList
  }

  FromDates: string[] = [];
  ToDates: string[] = [];
  convertdate() {
    this.MasterList.forEach(item => {
      let convertedDate = this.dtu.GetIndianDate(item.p.FromDate,);
      this.FromDates.push(convertedDate);
      item.p.FromDate = convertedDate;
    });
    this.MasterList.forEach(item => {
      let convertedDate = this.dtu.GetIndianDate(item.p.ToDate,);
      this.ToDates.push(convertedDate);
      item.p.ToDate = convertedDate;
    });
    console.log(this.ToDates);

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

  filterTable = () => {
    if (this.SearchString != '') {
      this.DisplayMasterList = this.MasterList.filter((data: any) => {
        return data.p.Description.toLowerCase().indexOf(this.SearchString.toLowerCase()) > -1
      })
    }
    else {
      this.DisplayMasterList = this.MasterList
    }
  }


}
