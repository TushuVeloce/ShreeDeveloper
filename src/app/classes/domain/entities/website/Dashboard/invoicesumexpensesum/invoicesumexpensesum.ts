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
import { InvoiceSumExpenseSumFetchRequest } from "./invoicesumexpensesumfetchrequest";


export class InvoiceSumExpenseSumProps {
  public readonly Db_Table_Name = "InvoiceSumExpenseSum";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public InvoiceAmount: number = 0;
  public GivenAmount: number = 0;
  public RecipientName: string = '';
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
    return new InvoiceSumExpenseSumProps(true);
  }
}

export class InvoiceSumExpenseSum implements IPersistable<InvoiceSumExpenseSum> {
  public static readonly Db_Table_Name: string = 'InvoiceSumExpenseSum';

  private constructor(public readonly p: InvoiceSumExpenseSumProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): InvoiceSumExpenseSum {
    let newState: InvoiceSumExpenseSumProps = Utils.GetInstance().DeepCopy(this.p);
    return InvoiceSumExpenseSum.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new InvoiceSumExpenseSum(InvoiceSumExpenseSumProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new InvoiceSumExpenseSum(data as InvoiceSumExpenseSumProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, InvoiceSumExpenseSum.Db_Table_Name, this.p);
  }

  private static m_currentInstance: InvoiceSumExpenseSum = InvoiceSumExpenseSum.CreateNewInstance();

  public static GetCurrentInstance() {
    return InvoiceSumExpenseSum.m_currentInstance;
  }

  public static SetCurrentInstance(value: InvoiceSumExpenseSum) {
    InvoiceSumExpenseSum.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): InvoiceSumExpenseSum {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, InvoiceSumExpenseSum.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, InvoiceSumExpenseSum.Db_Table_Name)!.Entries) {
        return InvoiceSumExpenseSum.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): InvoiceSumExpenseSum[] {
    let result: InvoiceSumExpenseSum[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, InvoiceSumExpenseSum.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, InvoiceSumExpenseSum.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(InvoiceSumExpenseSum.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): InvoiceSumExpenseSum[] {
    return InvoiceSumExpenseSum.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: InvoiceSumExpenseSumFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new InvoiceSumExpenseSumFetchRequest();
    req.InvoiceSumExpenseSumRefs.push(ref);
    req.CompanyRefs.push(companyRef);

    let tdResponse = await InvoiceSumExpenseSum.FetchTransportData(req, errorHandler) as TransportData;
    return InvoiceSumExpenseSum.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: InvoiceSumExpenseSumFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await InvoiceSumExpenseSum.FetchTransportData(req, errorHandler) as TransportData;
    return InvoiceSumExpenseSum.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new InvoiceSumExpenseSumFetchRequest();
    let tdResponse = await InvoiceSumExpenseSum.FetchTransportData(req, errorHandler) as TransportData;
    return InvoiceSumExpenseSum.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new InvoiceSumExpenseSumFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await InvoiceSumExpenseSum.FetchTransportData(req, errorHandler) as TransportData;
    return InvoiceSumExpenseSum.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanySiteMonthFilterType(CompanyRef: number, Month: number, FilterType: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new InvoiceSumExpenseSumFetchRequest();
    req.CompanyRef = CompanyRef;
    if (Month) {
      req.Month = Month;
    }
    if (FilterType) {
      req.FilterType = FilterType;
    }
    let tdResponse = await InvoiceSumExpenseSum.FetchTransportData(req, errorHandler) as TransportData;
    return InvoiceSumExpenseSum.ListFromTransportData(tdResponse);
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
