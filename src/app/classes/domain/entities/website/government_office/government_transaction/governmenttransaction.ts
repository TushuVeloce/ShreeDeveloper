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
import { ApplicableTypeProps } from "../siteworkmaster/siteworkmaster";
import { GovernmentTransactionFetchRequest } from "./governmenttransactionfetchrequest";


export class GovernmentTransactionProps {
  public readonly Db_Table_Name = " GovernmentTransaction";
  public Ref: number = 0;
  public SiteRef: number = 0;
  public SiteName: string = '';
  public TransactionJson: string = '';
  public CompanyRef: number = 0;
  public CompanyName: string = '';

  public readonly IsNewlyCreated: boolean = false;

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new GovernmentTransactionProps(true);
  }
}

export class GovernmentTransaction implements IPersistable<GovernmentTransaction> {
  public static readonly Db_Table_Name: string = ' GovernmentTransaction';

  private constructor(public readonly p: GovernmentTransactionProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): GovernmentTransaction {
    let newState: GovernmentTransactionProps = Utils.GetInstance().DeepCopy(this.p);
    return GovernmentTransaction.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new GovernmentTransaction(GovernmentTransactionProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new GovernmentTransaction(data as GovernmentTransactionProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.SiteRef == 0) vra.add('SiteWorkRef', 'Site Name cannot be blank.');
    if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company cannot be blank.');
    // if (this.p.TransactionJson == '') vra.add('TransactionJson', 'Transaction cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, GovernmentTransaction.Db_Table_Name, this.p);
  }

  private static m_currentInstance: GovernmentTransaction = GovernmentTransaction.CreateNewInstance();

  public static GetCurrentInstance() {
    return GovernmentTransaction.m_currentInstance;
  }

  public static SetCurrentInstance(value: GovernmentTransaction) {
    GovernmentTransaction.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): GovernmentTransaction {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, GovernmentTransaction.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, GovernmentTransaction.Db_Table_Name)!.Entries) {
        return GovernmentTransaction.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): GovernmentTransaction[] {
    let result: GovernmentTransaction[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, GovernmentTransaction.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, GovernmentTransaction.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(GovernmentTransaction.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): GovernmentTransaction[] {
    return GovernmentTransaction.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: GovernmentTransactionFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new GovernmentTransactionFetchRequest();
    req.GovernmentTransationRefs.push(ref);

    let tdResponse = await GovernmentTransaction.FetchTransportData(req, errorHandler) as TransportData;
    return GovernmentTransaction.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: GovernmentTransactionFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await GovernmentTransaction.FetchTransportData(req, errorHandler) as TransportData;
    return GovernmentTransaction.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new GovernmentTransactionFetchRequest();
    let tdResponse = await GovernmentTransaction.FetchTransportData(req, errorHandler) as TransportData;
    return GovernmentTransaction.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new GovernmentTransactionFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await GovernmentTransaction.FetchTransportData(req, errorHandler) as TransportData;
    return GovernmentTransaction.ListFromTransportData(tdResponse);
  }
  public static async FetchEntireListBySiteRef(SiteRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new GovernmentTransactionFetchRequest();
    req.SiteRefs.push(SiteRef)
    let tdResponse = await GovernmentTransaction.FetchTransportData(req, errorHandler) as TransportData;
    return GovernmentTransaction.ListFromTransportData(tdResponse);
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
