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
import { ValidationMessages, ValidationPatterns } from "src/app/classes/domain/constants";
import { SubLedgerFetchRequest } from "./subledgerfetchrequest";


export class SubLedgerProps {
  public readonly Db_Table_Name = "SubLedgerMaster";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public CreatedDate: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public UpdatedDate: string = '';
  public Ref: number = 0;
  public LedgerRef: number = 0;
  public readonly LedgerName: number = 0;
  public Name: string = '';
  public CompanyRef: number = 0;
  public CompanyName: string = '';

  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new SubLedgerProps(true);
  }
}

export class SubLedger implements IPersistable<SubLedger> {
  public static readonly Db_Table_Name: string = 'SubLedgerMaster';

  private constructor(public readonly p: SubLedgerProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): SubLedger {
    let newState: SubLedgerProps = Utils.GetInstance().DeepCopy(this.p);
    return SubLedger.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new SubLedger(SubLedgerProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new SubLedger(data as SubLedgerProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.LedgerRef == 0) {vra.add('LedgerRef', 'Ledger cannot be blank.');}
    if (this.p.Name == '') {vra.add('Name', 'Sub Ledger Name cannot be blank.');}
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, SubLedger.Db_Table_Name, this.p);
  }

  private static m_currentInstance: SubLedger = SubLedger.CreateNewInstance();

  public static GetCurrentInstance() {
    return SubLedger.m_currentInstance;
  }

  public static SetCurrentInstance(value: SubLedger) {
    SubLedger.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): SubLedger {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, SubLedger.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, SubLedger.Db_Table_Name)!.Entries) {
        return SubLedger.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
   sortPropertyName: string = ""): SubLedger[] {
    let result: SubLedger[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, SubLedger.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, SubLedger.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(SubLedger.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): SubLedger[] {
    return SubLedger.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: SubLedgerFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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

  public static async FetchInstance(ref: number,companyRef:number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new SubLedgerFetchRequest();
    req.SubLedgerRefs.push(ref);
    req.CompanyRefs.push(companyRef);

    let tdResponse = await SubLedger.FetchTransportData(req, errorHandler) as TransportData;
    return SubLedger.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: SubLedgerFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await SubLedger.FetchTransportData(req, errorHandler) as TransportData;
    return SubLedger.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new SubLedgerFetchRequest();
    let tdResponse = await SubLedger.FetchTransportData(req, errorHandler) as TransportData;
    return SubLedger.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new SubLedgerFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await SubLedger.FetchTransportData(req, errorHandler) as TransportData;
    return SubLedger.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByLedgerRef(LedgerRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new SubLedgerFetchRequest();
    req.LedgerRefs.push(LedgerRef)
    let tdResponse = await SubLedger.FetchTransportData(req, errorHandler) as TransportData;
    return SubLedger.ListFromTransportData(tdResponse);
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
