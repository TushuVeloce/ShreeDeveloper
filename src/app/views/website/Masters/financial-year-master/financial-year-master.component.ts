import { DatePipe } from '@angular/common';
import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FinancialYear } from 'src/app/classes/domain/entities/website/masters/financialyear/financialyear';
import { FetchFinancialYearUserCustomRequest } from 'src/app/classes/domain/entities/website/masters/financialyear/FinancialYearUserCustomRequest';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { TransportData } from 'src/app/classes/infrastructure/transportdata';
// import { FinancialYearCustomRequest } from 'src/app/classes/domain/entities/website/masters/financialyear/financialyearfetchrequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

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
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  companyName = this.companystatemanagement.SelectedCompanyName;
  isSaveDisabled: boolean = false;
  private IsNewEntity: boolean = true;




  headers: string[] = ['Sr.No.', 'From Date', 'To Date'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private utils: Utils,
    private dtu: DTU, private datePipe: DatePipe, private companystatemanagement: CompanyStateManagement, private payloadPacketFacade: PayloadPacketFacade,
    private serverCommunicator: ServerCommunicatorService
  ) {
    effect(() => {
      this.getFinancialYearListByCompanyRef()
    });
  }

  async ngOnInit() {
    // await this.FormulateMasterList();
  }

  getFinancialYearListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await FinancialYear.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
    this.convertdate();
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

  // Financial Year Custom Request 
  // AddNewFinancialYear = async () => {

  //   let req = new FetchFinancialYearUserCustomRequest();
  //   req.CompanyRef = this.Entity.p.CompanyRef;
  //   req.Ref = this.Entity.p.Ref;

  //   let td = req.FormulateTransportData();
  //   let pkt = this.payloadPacketFacade.CreateNewPayloadPacket2(td);

  //   let tr = await this.serverCommunicator.sendHttpRequest(pkt);

  //   if (!tr.Successful) {
  //     await this.uiUtils.showErrorMessage('Error', tr.Message);
  //     return;
  //   }

  //   let tdResult = JSON.parse(tr.Tag) as TransportData;

  //   let NewFinancialYear = this.utils.GetString(tdResult);
  //   console.log(NewFinancialYear);
    
  //   this.Entity.p.FromDate = NewFinancialYear;
  //   console.log(this.Entity.p.FromDate);
    

  //   // this.Entity.p.FromDate = NewFinancialYear.FromDate;
  //   // this.Entity.p.ToDate = NewFinancialYear.ToDate;
  // }
}
