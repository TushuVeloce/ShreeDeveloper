import { DatePipe } from '@angular/common';
import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FinancialYear, FinancialYearProps } from 'src/app/classes/domain/entities/website/masters/financialyear/financialyear';
import { GenerateNewFinancialYearCustomRequest } from 'src/app/classes/domain/entities/website/masters/financialyear/FinancialYearUserCustomRequest copy';
import { SetCurrentFinancialYearCustomRequest } from 'src/app/classes/domain/entities/website/masters/financialyear/SetCurrentFinancialYearCustomRequest';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { TransportData } from 'src/app/classes/infrastructure/transportdata';
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
  isPasswordModalOpen: boolean = false;
  isSetFinancialYearModalOpen: boolean = false;
  private IsNewEntity: boolean = true;
  FromDates: string[] = [];
  ToDates: string[] = [];
  newOwner: FinancialYearProps = FinancialYearProps.Blank();
  editingIndex: null | undefined | number ;
  localpassword: string = '';
  showPassword: boolean = false;


  headers: string[] = ['Sr.No.', 'From Date', 'To Date', 'Status '];
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
    console.log('DisplayMasterList :', this.DisplayMasterList);
    this.loadPaginationData();
    this.convertdate();
  }

  convertdate = () => {
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
  }

  openModal(type: string) {
    if (type === 'password') this.isPasswordModalOpen = true;
    if (type === 'password') this.isSetFinancialYearModalOpen = true;
  }



   closeModal = async (type: string) => {
      // if (type === 'password') {
      //   const keysToCheck = ['Password'] as const;

      //   const hasData = keysToCheck.some(
      //     key => (this.newOwner as any)[key]?.toString().trim()
      //   );

      //   if (hasData) {
      //     await this.uiUtils.showConfirmationMessage(
      //       'Close',
      //       `This process is <strong>IRREVERSIBLE!</strong><br/>
      //        Are you sure you want to close this modal?`,
      //       async () => {
      //         this.isPasswordModalOpen = false;
      //         this.newOwner = FinancialYearProps.Blank();
      //       }
      //     );
      //   } else {
        //     this.newOwner = FinancialYearProps.Blank();
        //   }
        // }
            this.isPasswordModalOpen = false;
            this.isSetFinancialYearModalOpen = false;
            this.localpassword = '';
    };

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
    if (this.SearchString != '') {
      this.DisplayMasterList = this.MasterList.filter((data: any) => {
        return data.p.Description.toLowerCase().indexOf(this.SearchString.toLowerCase()) > -1
      })
    }
    else {
      this.DisplayMasterList = this.MasterList
    }
  }
  togglePasswordVisibility = () => {
    this.showPassword = !this.showPassword;
  };

  // To Create New Financial Year Custom Request
  AddNewFinancialYear = async () => {
    // debugger
    if (this.localpassword.trim().length > 0) {

      let req = new GenerateNewFinancialYearCustomRequest();

      req.CompanyRef = this.companyRef();
      console.log('req.CompanyRef :', req.CompanyRef);
      req.Password = this.localpassword;
      console.log('req.Password :', req.Password);
      req.LoginEmployeeRef = this.appStateManage.getEmployeeRef();
      console.log('req.LoginEmployeeRef :', req.LoginEmployeeRef);
      req.LoginToken = this.appStateManage.getLoginToken();
      console.log('req.LoginToken :', req.LoginToken);

      let td = req.FormulateTransportData();
      let pkt = this.payloadPacketFacade.CreateNewPayloadPacket2(td);
      console.log('pkt :', pkt);

    let tr = await this.serverCommunicator.sendHttpRequest(pkt);
    if (!tr.Successful) {
      await this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    }
    let tdResult = JSON.parse(tr.Tag) as TransportData;
    let NewFinancialYear = this.utils.GetString(tdResult);
    this.Entity.p.FromDate = NewFinancialYear;
    console.log('tdResult :', tdResult);

    this.closeModal('password');
    this.getFinancialYearListByCompanyRef();
  }
  else{
    await this.uiUtils.showWarningToster('Password Required');
  }


 
    // this.Entity.p.FromDate = NewFinancialYear.FromDate;
    // this.Entity.p.ToDate = NewFinancialYear.ToDate;
  }


   // To Set New Financial Year Custom Request
   SetNewFinancialYear = async () => {
    // debugger
    if (this.localpassword.trim().length > 0) {

      let req = new SetCurrentFinancialYearCustomRequest();

      req.Ref = this.Entity.p.Ref;
      console.log('req.Ref :', req.Ref);
      req.CompanyRef = this.companyRef();
      console.log('req.CompanyRef :', req.CompanyRef);
      req.Password = this.localpassword;
      console.log('req.Password :', req.Password);
      req.LoginEmployeeRef = this.appStateManage.getEmployeeRef();
      req.LoginToken = this.appStateManage.getLoginToken();

      let td = req.FormulateTransportData();
      let pkt = this.payloadPacketFacade.CreateNewPayloadPacket2(td);

    let tr = await this.serverCommunicator.sendHttpRequest(pkt);
    if (!tr.Successful) {
      await this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    }
    let tdResult = JSON.parse(tr.Tag) as TransportData;
    let NewFinancialYear = this.utils.GetString(tdResult);
    this.Entity.p.FromDate = NewFinancialYear;
    this.closeModal('password');
    this.getFinancialYearListByCompanyRef();
  }
  else{
    await this.uiUtils.showWarningToster('Password Required');
  }
  }

}
