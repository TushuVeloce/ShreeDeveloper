import { IPersistable } from 'src/app/classes/infrastructure/IPersistable';
import { DataContainer } from 'src/app/classes/infrastructure/datacontainer';
import { DataContainerService } from 'src/app/classes/infrastructure/datacontainer.service';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { ValidationResultAccumulator } from 'src/app/classes/infrastructure/validationresultaccumulator';
import { IdProvider } from 'src/app/services/idprovider.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { Utils } from 'src/app/services/utils.service';
import { isNullOrUndefined } from 'src/tools';
import { UIUtils } from 'src/app/services/uiutils.service';
import { RequestTypes } from 'src/app/classes/infrastructure/enums';
import {
  ValidationMessages,
  ValidationPatterns,
} from 'src/app/classes/domain/constants';
import { DashboardStatsFetchRequest } from './dashboardstatsfetchrequest';

export class ExpenseBreakdownProps {
  public TotalGivenAmount: number = 0;
  public LedgerRef: number = 0;
  public LedgerName: string = '';
}
export class IncomeVsExpenseProps {
  public TotalGivenAmount: number = 0;
  public TotalIncomeAmount: number = 0;
  public WeekName: number = 0;
}
export class DashboardStatsProps {
  public readonly Db_Table_Name = 'Dashboard';
  public Ref: number = 0;
  public TotalNoOfPlots: number = 0;
  public TotalNoOfSoldPlots: number = 0;
  public TotalRevenueGenerated: number = 0;
  public TotalEnquiries: number = 0;
  public ExpenseBreakDownResponseList: ExpenseBreakdownProps[] = [];
  public IncomeExpenseAmountByPeriodList: IncomeVsExpenseProps[] = [];

  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new DashboardStatsProps(true);
  }
}

export class DashboardStats implements IPersistable<DashboardStats> {
  public static readonly Db_Table_Name: string = 'Dashboard';

  private constructor(
    public readonly p: DashboardStatsProps,
    public readonly AllowEdit: boolean
  ) {}

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0)
        throw new Error('Cannot assign Id. Please try again');
    }
  }

  public GetEditableVersion(): DashboardStats {
    let newState: DashboardStatsProps = Utils.GetInstance().DeepCopy(this.p);
    return DashboardStats.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new DashboardStats(DashboardStatsProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new DashboardStats(data as DashboardStatsProps, allowEdit);
  }

  public CheckSaveValidity(
    _td: TransportData,
    vra: ValidationResultAccumulator
  ): void {
    if (!this.AllowEdit)
      vra.add('', 'This object is not editable and hence cannot be saved.');
    // if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(
      td.MainData,
      DashboardStats.Db_Table_Name,
      this.p
    );
  }

  private static m_currentInstance: DashboardStats =
    DashboardStats.CreateNewInstance();

  public static GetCurrentInstance() {
    return DashboardStats.m_currentInstance;
  }

  public static SetCurrentInstance(value: DashboardStats) {
    DashboardStats.m_currentInstance = value;
  }

  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(
    td: TransportData
  ): DashboardStats {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, DashboardStats.Db_Table_Name)) {
      for (let data of dcs.GetCollection(
        td.MainData,
        DashboardStats.Db_Table_Name
      )!.Entries) {
        return DashboardStats.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(
    cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ''
  ): DashboardStats[] {
    let result: DashboardStats[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, DashboardStats.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, DashboardStats.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate))
        entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(DashboardStats.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): DashboardStats[] {
    return DashboardStats.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(
    req: DashboardStatsFetchRequest,
    errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance()
      .GlobalUIErrorHandler
  ) {
    let tdRequest = req.FormulateTransportData();
    let pktRequest =
      PayloadPacketFacade.GetInstance().CreateNewPayloadPacket2(tdRequest);

    let tr = await ServerCommunicatorService.GetInstance().sendHttpRequest(
      pktRequest
    );
    if (!tr.Successful) {
      if (!isNullOrUndefined(errorHandler)) await errorHandler(tr.Message);
      return null;
    }

    let tdResponse = JSON.parse(tr.Tag) as TransportData;
    return tdResponse;
  }

  //   public static async FetchInstance(ref: number, companyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
  //     let req = new DashboardStatsFetchRequest();
  //     req.DashboardStatsRefs.push(ref);
  //     req.CompanyRefs.push(companyRef);

  //     let tdResponse = await DashboardStats.FetchTransportData(req, errorHandler) as TransportData;
  //     return DashboardStats.SingleInstanceFromTransportData(tdResponse);
  //   }

  public static async FetchList(
    req: DashboardStatsFetchRequest,
    errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance()
      .GlobalUIErrorHandler
  ) {
    let tdResponse = (await DashboardStats.FetchTransportData(
      req,
      errorHandler
    )) as TransportData;
    return DashboardStats.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(
    errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance()
      .GlobalUIErrorHandler
  ) {
    let req = new DashboardStatsFetchRequest();
    let tdResponse = (await DashboardStats.FetchTransportData(
      req,
      errorHandler
    )) as TransportData;
    return DashboardStats.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByAll(
    CRMCompanyRef: number,
    CRMMonth: number,
    CRMSiteRef: number,
    CRMFilterType: number,
    ExpenseBreakDownCompanyRef: number,
    ExpenseBreakDownSiteRef: number,
    ExpenseBreakDownFilterType: number,
    ExpenseBreakDownMonth: number,
    IncomeVsExpenseCompanyRef: number,
    IncomeVsExpenseSiteRef: number,
    IncomeVsExpenseFilterType: number,
    IncomeVsExpenseMonth: number,
    errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance()
      .GlobalUIErrorHandler
  ) {
    let req = new DashboardStatsFetchRequest();
    req.CRMCompanyRef = CRMCompanyRef;
    req.CRMMonth = CRMMonth;
    req.CRMSiteRef = CRMSiteRef;
    req.CRMFilterType = CRMFilterType;

    req.ExpenseBreakDownCompanyRef = ExpenseBreakDownCompanyRef;
    req.ExpenseBreakDownSiteRef = ExpenseBreakDownSiteRef;
    req.ExpenseBreakDownFilterType = ExpenseBreakDownFilterType;
    req.ExpenseBreakDownMonth = ExpenseBreakDownMonth;

    req.IncomeVsExpenseCompanyRef = IncomeVsExpenseCompanyRef;
    req.IncomeVsExpenseSiteRef = IncomeVsExpenseSiteRef;
    req.IncomeVsExpenseFilterType = IncomeVsExpenseFilterType;
    req.IncomeVsExpenseMonth = IncomeVsExpenseMonth;

    let tdResponse = (await DashboardStats.FetchTransportData(
      req,
      errorHandler
    )) as TransportData;
    return DashboardStats.ListFromTransportData(tdResponse);
  }

  public async DeleteInstance(
    successHandler: () => Promise<void> = null!,
    errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance()
      .GlobalUIErrorHandler
  ) {
    let tdRequest = new TransportData();
    tdRequest.RequestType = RequestTypes.Deletion;

    this.MergeIntoTransportData(tdRequest);
    let pktRequest =
      PayloadPacketFacade.GetInstance().CreateNewPayloadPacket2(tdRequest);

    let tr = await ServerCommunicatorService.GetInstance().sendHttpRequest(
      pktRequest
    );
    if (!tr.Successful) {
      if (!isNullOrUndefined(errorHandler)) await errorHandler(tr.Message);
    } else {
      if (!isNullOrUndefined(successHandler)) await successHandler();
    }
  }
}
