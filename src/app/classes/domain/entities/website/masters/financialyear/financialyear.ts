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
import { FinancialYearFetchRequest } from "./financialyearfetchrequest";
import { CurrentBalanceFetchRequest } from "./currentbalancefetchrequest";

export class FinancialYearProps {
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public Name: string = '';
  public Password: string = '';
  FromDate: string = '';
  ToDate: string = '';
  ShortName: string = '';
  public CompanyRef: number = 0;
  public IsCurrentYear: number = 0;

  // public FinancialYear: string = '';

  public readonly CompanyName: string = '';

  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new FinancialYearProps(true);
  }
}

export class FinancialYear implements IPersistable<FinancialYear> {
  public static readonly MasterTableName: string = 'FinancialYearMaster';

  private constructor(public readonly p: FinancialYearProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): FinancialYear {
    let newFinancialYear: FinancialYearProps = Utils.GetInstance().DeepCopy(this.p);
    return FinancialYear.CreateInstance(newFinancialYear, true);
  }

  public static CreateNewInstance() {
    return new FinancialYear(FinancialYearProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new FinancialYear(data as FinancialYearProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.Name == '') vra.add('Name', 'Name cannot be blank.');
    // if (this.p.CompanyRef <= 0) vra.add('Company', 'Company cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, FinancialYear.MasterTableName, this.p);
  }

  private static m_currentInstance: FinancialYear = FinancialYear.CreateNewInstance();

  public static GetCurrentInstance() {
    return FinancialYear.m_currentInstance;
  }

  public static SetCurrentInstance(value: FinancialYear) {
    FinancialYear.m_currentInstance = value;
  }

  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): FinancialYear {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, FinancialYear.MasterTableName)) {
      for (let data of dcs.GetCollection(td.MainData, FinancialYear.MasterTableName)!.Entries) {
        return FinancialYear.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
   sortPropertyName: string = ""): FinancialYear[] {
    let result: FinancialYear[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, FinancialYear.MasterTableName)) {
      let coll = dcs.GetCollection(cont, FinancialYear.MasterTableName)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(FinancialYear.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): FinancialYear[] {
    return FinancialYear.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: FinancialYearFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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

  public static async FetchInstance(ref: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new FinancialYearFetchRequest();
    req.CompanyRefs.push(ref);

    let tdResponse = await FinancialYear.FetchTransportData(req, errorHandler) as TransportData;
    return FinancialYear.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: FinancialYearFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await FinancialYear.FetchTransportData(req, errorHandler) as TransportData;
    return FinancialYear.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new FinancialYearFetchRequest();
    let tdResponse = await FinancialYear.FetchTransportData(req, errorHandler) as TransportData;
    return FinancialYear.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new FinancialYearFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await FinancialYear.FetchTransportData(req, errorHandler) as TransportData;
    return FinancialYear.ListFromTransportData(tdResponse);
  }


  public static async FetchCurrentBalanceByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new CurrentBalanceFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await FinancialYear.FetchTransportData(req, errorHandler) as TransportData;
    return FinancialYear.ListFromTransportData(tdResponse);
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
