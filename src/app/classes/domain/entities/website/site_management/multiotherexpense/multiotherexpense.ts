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
import { MultiOtherExpenseFetchRequest } from "./multiotherexpensefetchrequest";


export class MultiOtherExpenseProps {
  public readonly Db_Table_Name = "LabourExpenseDetails";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: string = '';
  public Ref: number = 0;
  public Discription: string = '';
  public Unit: number = 0;
  public UnitName: string = '';
  public Rate: number = 0;
  public Quantity: number = 0;
  public Amount: number = 0;
  public InvoiceRef: number = 0;

  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  public constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new MultiOtherExpenseProps(true);
  }
}

export class MultiOtherExpense implements IPersistable<MultiOtherExpense> {
  public static readonly Db_Table_Name: string = 'LabourExpenseDetails';

  public constructor(public readonly p: MultiOtherExpenseProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): MultiOtherExpense {
    let newState: MultiOtherExpenseProps = Utils.GetInstance().DeepCopy(this.p);
    return MultiOtherExpense.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new MultiOtherExpense(MultiOtherExpenseProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new MultiOtherExpense(data as MultiOtherExpenseProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, MultiOtherExpense.Db_Table_Name, this.p);
  }

  private static m_currentInstance: MultiOtherExpense = MultiOtherExpense.CreateNewInstance();

  public static GetCurrentInstance() {
    return MultiOtherExpense.m_currentInstance;
  }

  public static SetCurrentInstance(value: MultiOtherExpense) {
    MultiOtherExpense.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): MultiOtherExpense {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, MultiOtherExpense.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, MultiOtherExpense.Db_Table_Name)!.Entries) {
        return MultiOtherExpense.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): MultiOtherExpense[] {
    let result: MultiOtherExpense[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, MultiOtherExpense.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, MultiOtherExpense.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(MultiOtherExpense.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): MultiOtherExpense[] {
    return MultiOtherExpense.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: MultiOtherExpenseFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new MultiOtherExpenseFetchRequest();
    req.MultiOtherExpenseRefs.push(ref);

    let tdResponse = await MultiOtherExpense.FetchTransportData(req, errorHandler) as TransportData;
    return MultiOtherExpense.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: MultiOtherExpenseFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await MultiOtherExpense.FetchTransportData(req, errorHandler) as TransportData;
    return MultiOtherExpense.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new MultiOtherExpenseFetchRequest();
    let tdResponse = await MultiOtherExpense.FetchTransportData(req, errorHandler) as TransportData;
    return MultiOtherExpense.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRefAndSiteRef(CompanyRef: number, SiteRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new MultiOtherExpenseFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    req.SiteManagementRefs.push(SiteRef)
    let tdResponse = await MultiOtherExpense.FetchTransportData(req, errorHandler) as TransportData;
    return MultiOtherExpense.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListBySiteRef(siteref: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new MultiOtherExpenseFetchRequest();
    req.SiteManagementRefs.push(siteref)
    let tdResponse = await MultiOtherExpense.FetchTransportData(req, errorHandler) as TransportData;
    return MultiOtherExpense.ListFromTransportData(tdResponse);
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
