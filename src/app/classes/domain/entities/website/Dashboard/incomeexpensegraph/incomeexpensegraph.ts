import { IPersistable } from "src/app/classes/infrastructure/IPersistable";
import { DataContainer } from "src/app/classes/infrastructure/datacontainer";
import { DataContainerService } from "src/app/classes/infrastructure/datacontainer.service";
import { PayloadPacketFacade } from "src/app/classes/infrastructure/payloadpacket/payloadpacketfacade";
import { TransportData } from "src/app/classes/infrastructure/transportdata";
import { ValidationResultAccumulator } from "src/app/classes/infrastructure/validationresultaccumulator";
import { IdProvider } from "src/app/services/idprovider.service";
import { ServerCommunicatorService } from "src/app/services/server-communicator.service";
import { Utils } from "src/app/services/utils.service";
import { isNullOrUndefined } from "src/tools";
import { UIUtils } from "src/app/services/uiutils.service";
import { RequestTypes } from "src/app/classes/infrastructure/enums";
import { IncomeExpenseGraphFetchRequest } from "./incomeexpensegraphfetchrequest";
import { ValidationMessages, ValidationPatterns } from "src/app/classes/domain/constants";


export class IncomeExpenseGraphProps {
  public readonly Db_Table_Name = "DashboardExpenseForGraph";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public Code: string = '';
  public Name: string = '';
  public UnitRef: number = 0;
  public readonly UnitName: string = '';
  public CompanyRef: number = 0;
  public CompanyName: string = '';

  public SiteRef: number = 0;
  public Month: number = 0;
  public FilterType: number = 0;

  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new IncomeExpenseGraphProps(true);
  }
}

export class IncomeExpenseGraph implements IPersistable<IncomeExpenseGraph> {
  public static readonly Db_Table_Name: string = 'DashboardExpenseForGraph';

  private constructor(public readonly p: IncomeExpenseGraphProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): IncomeExpenseGraph {
    let newState: IncomeExpenseGraphProps = Utils.GetInstance().DeepCopy(this.p);
    return IncomeExpenseGraph.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new IncomeExpenseGraph(IncomeExpenseGraphProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new IncomeExpenseGraph(data as IncomeExpenseGraphProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.Name == '') {
      vra.add('Name', 'Name cannot be blank.');
    }
    if (this.p.UnitRef == 0) vra.add('UnitRef', 'Unit cannot be blank.');
    if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, IncomeExpenseGraph.Db_Table_Name, this.p);
  }

  private static m_currentInstance: IncomeExpenseGraph = IncomeExpenseGraph.CreateNewInstance();

  public static GetCurrentInstance() {
    return IncomeExpenseGraph.m_currentInstance;
  }

  public static SetCurrentInstance(value: IncomeExpenseGraph) {
    IncomeExpenseGraph.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): IncomeExpenseGraph {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, IncomeExpenseGraph.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, IncomeExpenseGraph.Db_Table_Name)!.Entries) {
        return IncomeExpenseGraph.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): IncomeExpenseGraph[] {
    let result: IncomeExpenseGraph[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, IncomeExpenseGraph.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, IncomeExpenseGraph.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(IncomeExpenseGraph.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): IncomeExpenseGraph[] {
    return IncomeExpenseGraph.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: IncomeExpenseGraphFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdRequest = req.FormulateTransportData();
    let pktRequest = PayloadPacketFacade.GetInstance().CreateNewPayloadPacket2(tdRequest);

    let tr = await ServerCommunicatorService.GetInstance().sendHttpRequest(pktRequest);
    if (!tr.Successful) {
      if (!isNullOrUndefined(errorHandler)) await errorHandler(tr.Message);
      return null;
    }

    let tdResponse = JSON.parse(tr.Tag) as TransportData;
    return tdResponse;
  }

  public static async FetchInstance(ref: number, companyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new IncomeExpenseGraphFetchRequest();
    req.IncomeExpenseGraphRefs.push(ref);
    req.CompanyRefs.push(companyRef);

    let tdResponse = await IncomeExpenseGraph.FetchTransportData(req, errorHandler) as TransportData;
    return IncomeExpenseGraph.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: IncomeExpenseGraphFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await IncomeExpenseGraph.FetchTransportData(req, errorHandler) as TransportData;
    return IncomeExpenseGraph.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new IncomeExpenseGraphFetchRequest();
    let tdResponse = await IncomeExpenseGraph.FetchTransportData(req, errorHandler) as TransportData;
    return IncomeExpenseGraph.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new IncomeExpenseGraphFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await IncomeExpenseGraph.FetchTransportData(req, errorHandler) as TransportData;
    return IncomeExpenseGraph.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanySiteMonthFilterType(CompanyRef: number, SiteRef: number, Month: number, FilterType: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new IncomeExpenseGraphFetchRequest();
    req.CompanyRef = CompanyRef;
    if (SiteRef) {
      req.SiteRef = SiteRef;
    }
    if (Month) {
      req.Month = Month;
    }
    if (FilterType) {
      req.FilterType = FilterType;
    }
    let tdResponse = await IncomeExpenseGraph.FetchTransportData(req, errorHandler) as TransportData;
    return IncomeExpenseGraph.ListFromTransportData(tdResponse);
  }

  public async DeleteInstance(successHandler: () => Promise<void> = null!, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdRequest = new TransportData();
    tdRequest.RequestType = RequestTypes.Deletion;

    this.MergeIntoTransportData(tdRequest);
    let pktRequest = PayloadPacketFacade.GetInstance().CreateNewPayloadPacket2(tdRequest);

    let tr = await ServerCommunicatorService.GetInstance().sendHttpRequest(pktRequest);
    if (!tr.Successful) {
      if (!isNullOrUndefined(errorHandler)) await errorHandler(tr.Message);
    }
    else {
      if (!isNullOrUndefined(successHandler)) await successHandler();
    }
  }

}
