import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages } from 'src/app/classes/domain/constants';
import { BookingRemark, DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { Company } from 'src/app/classes/domain/entities/website/masters/company/company';
import { Plot } from 'src/app/classes/domain/entities/website/masters/plot/plot';
import { Owner } from 'src/app/classes/domain/entities/website/masters/site/owner/owner';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { State } from 'src/app/classes/domain/entities/website/masters/state/state';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-plot-master-details',
  standalone: false,
  templateUrl: './plot-master-details.component.html',
  styleUrls: ['./plot-master-details.component.scss'],
})
export class PlotMasterDetailsComponent implements OnInit {
  Entity: Plot = Plot.CreateNewInstance();
  CustomerEntity: Owner = Owner.CreateNewInstance();
  CompanyEntity: Company = Company.CreateNewInstance();
  private IsNewEntity: boolean = true;
  DetailsFormTitle: 'New Plot' | 'Edit Plot' = 'New Plot';
  isSaveDisabled: boolean = false;
  IsDropdownDisabled: boolean = false;
  InitialEntity: Plot = null as any;
  BookingRemarkList = DomainEnums.BookingRemarkList(true, '--- Select Booking Remark ---');
  BookingRemark = BookingRemark
  SiteRf: number = 0
  SiteName: string = ''
  CustomerList: Owner[] = [];
  CompanyList: Company[] = [];
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg;
  CompanyName = this.companystatemanagement.SelectedCompanyName;
  CompanyRef = this.companystatemanagement.SelectedCompanyRef;

  @ViewChild('PlotNoCtrl') PlotNoInputControl!: NgModel;
  @ViewChild('AreaInSqmCtrl') AreaInSqmInputControl!: NgModel;
  @ViewChild('AreaInSqftCtrl') AreaInSqftInputControl!: NgModel;
  @ViewChild('GovermentRatePerSqmCtrl') GovermentRatePerSqmInputControl!: NgModel;
  @ViewChild('BasicRatePerSqftCtrl') BasicRatePerSqftInputControl!: NgModel;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils, private companystatemanagement: CompanyStateManagement
  ) { }

  async ngOnInit() {
    this.CompanyList = await Company.FetchEntireList();
    const siteref = this.appStateManage.StorageKey.getItem('siteRef')
    const siteName = this.appStateManage.StorageKey.getItem('siteName')
    this.SiteRf = siteref ? Number(siteref) : 0;
    this.SiteName = siteName ? siteName : '';
    this.appStateManage.setDropdownDisabled(true);
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Plot' : 'Edit Plot';
      this.Entity = Plot.GetCurrentInstance();
      this.SiteName = this.Entity.p.SiteName
      this.SiteRf = this.Entity.p.SiteManagementRef
      this.appStateManage.StorageKey.removeItem('Editable');
      if (this.Entity.p.CurrentBookingRemark == BookingRemark.Booked) {
        this.isSaveDisabled = true
      }
      if (this.Entity.p.CurrentBookingRemark == BookingRemark.Shree_Booked) {
        this.getCompanySingleRecord()
      }
    } else {
      this.Entity = Plot.CreateNewInstance();
      Plot.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(
      Plot.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as Plot;
    this.getCustomerListBySiteandBookingRef(this.SiteRf)
  }

  getCustomerListBySiteandBookingRef = async (SiteRf: number) => {
    this.CustomerList = [];
    if (SiteRf <= 0) {
      await this.uiUtils.showErrorToster('Site not Selected');
      return;
    }
    let lst = await Owner.FetchEntireListBySiteRef(SiteRf, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.CustomerList = lst;
    // if (this.CustomerList.length == 1) {
    //   this.Entity.p.CurrentOwnerRef = this.CustomerList[0].p.Ref
    //   this.getCustomerDataBycustomerRef(this.Entity.p.CurrentOwnerRef)
    // }
    if (this.Entity.p.CurrentOwnerRef > 0 && this.CustomerList.length > 0) {
      this.getCustomerDataBycustomerRef(this.Entity.p.CurrentOwnerRef)
    }
  }

  getCustomerDataBycustomerRef = async (customerref: number) => {
    this.CustomerEntity = Owner.CreateNewInstance();
    let CuctomerData = await Owner.FetchInstance(customerref, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.CustomerEntity = CuctomerData;
  }

  getCompanySingleRecord = async () => {
    this.CompanyEntity = Company.CreateNewInstance();
    this.Entity.p.CurrentOwnerRef = 0
    this.CustomerEntity = Owner.CreateNewInstance();
    if (this.Entity.p.CurrentBookingRemark == BookingRemark.Shree_Booked) {
      let CompanyData = await Company.FetchInstance(this.CompanyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.CompanyEntity = CompanyData;
    }
  }


  SavePlot = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
    this.Entity.p.LoginEmployeeRef = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    this.Entity.p.SiteManagementRef = this.SiteRf
    this.Entity.p.AreaInSqft = this.Entity.p.AreaInSqm * 10.7639
    if (this.Entity.p.CurrentBookingRemark == BookingRemark.Shree_Booked) {
      this.Entity.p.CurrentOwnerRef = 0
    }
    this.Entity.p.IsNewlyCreated = this.IsNewEntity;
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    console.log('entitiesToSave :', entitiesToSave);
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message)
      return;
    } else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Plot saved successfully!');
        this.Entity = Plot.CreateNewInstance();
        this.CustomerEntity = Owner.CreateNewInstance();
        this.CompanyEntity = Company.CreateNewInstance();
        this.resetAllControls()
      } else {
        await this.uiUtils.showSuccessToster('Plot Updated successfully!');
        await this.router.navigate(['/homepage/Website/Plot_Master']);
      }
    }
  };

  convertSqmToSqft = () => {
    if (this.Entity.p.AreaInSqm) {
      this.Entity.p.AreaInSqft = parseFloat((this.Entity.p.AreaInSqm * 10.7639).toFixed(3));
    } else {
      this.Entity.p.AreaInSqft = 0;
    }
  }

  convertSqftToSqm = () => {
    if (this.Entity.p.AreaInSqft) {
      this.Entity.p.AreaInSqm = parseFloat((this.Entity.p.AreaInSqft / 10.7639).toFixed(3));
    } else {
      this.Entity.p.AreaInSqm = 0;
    }
  }

  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  BackPlot = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Plot Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Plot_Master']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Plot_Master']);
    }
  }

  resetAllControls = () => {
    this.PlotNoInputControl.control.markAsUntouched();
    this.AreaInSqmInputControl.control.markAsUntouched();
    this.AreaInSqftInputControl.control.markAsUntouched();
    this.GovermentRatePerSqmInputControl.control.markAsUntouched();
    this.BasicRatePerSqftInputControl.control.markAsUntouched();


    this.PlotNoInputControl.control.markAsPristine();
    this.AreaInSqmInputControl.control.markAsPristine();
    this.AreaInSqftInputControl.control.markAsPristine();
    this.GovermentRatePerSqmInputControl.control.markAsPristine();
    this.BasicRatePerSqftInputControl.control.markAsPristine();

  }

}
