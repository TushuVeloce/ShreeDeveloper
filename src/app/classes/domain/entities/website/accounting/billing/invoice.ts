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
import { InvoiceFetchRequest } from "./invoicefetchrequest";


export class InvoiceProps {
  public readonly Db_Table_Name = "Invoice";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public CreatedDate: string = ''
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public UpdatedDate: string = ''
  public Ref: number = 0;
  public CompanyRef: number = 0
  public CompanyName: string = ''

  public Date: string = ''
  public SiteRef: number = 0
  public readonly SiteName: number = 0
  public LedgerRef: number = 0
  public readonly LedgerName: number = 0
  public SubLedgerRef: number = 0
  public readonly SubLedgerName: number = 0
  public Description: string = ''
  public RecipientName: string = ''
  public Reason: string = ''
  public IsDisealPaid: number = 0
  public Qty: number = 0
  public UnitRef: number = 0
  public Rate: number = 0
  public InvoiceAmount: number = 0
  public Narration: string = ''
  public TransDateTime: string = ''
  public IsDeleted: number = 0


  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new InvoiceProps(true);
  }
}

export class Invoice implements IPersistable<Invoice> {
  public static readonly Db_Table_Name: string = 'Invoice';

  private constructor(public readonly p: InvoiceProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): Invoice {
    let newState: InvoiceProps = Utils.GetInstance().DeepCopy(this.p);
    return Invoice.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new Invoice(InvoiceProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new Invoice(data as InvoiceProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');

    // if (this.p.Name == '') {
    //   vra.add('Name', 'Name cannot be blank.');
    // } else if (!new RegExp(ValidationPatterns.SIUnit).test(this.p.Name)) {
    //   vra.add('Name', ValidationMessages.SIUnitMsg + ' for Name');
    // }
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, Invoice.Db_Table_Name, this.p);
  }

  private static m_currentInstance: Invoice = Invoice.CreateNewInstance();

  public static GetCurrentInstance() {
    return Invoice.m_currentInstance;
  }

  public static SetCurrentInstance(value: Invoice) {
    Invoice.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): Invoice {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, Invoice.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, Invoice.Db_Table_Name)!.Entries) {
        return Invoice.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    //sortPropertyName: string = "Name"): Invoice[] {
    sortPropertyName: string = ""): Invoice[] {
    let result: Invoice[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, Invoice.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, Invoice.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(Invoice.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): Invoice[] {
    return Invoice.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: InvoiceFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new InvoiceFetchRequest();
    req.InvoiceRefs.push(ref);

    let tdResponse = await Invoice.FetchTransportData(req, errorHandler) as TransportData;
    return Invoice.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: InvoiceFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await Invoice.FetchTransportData(req, errorHandler) as TransportData;
    return Invoice.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new InvoiceFetchRequest();
    let tdResponse = await Invoice.FetchTransportData(req, errorHandler) as TransportData;
    return Invoice.ListFromTransportData(tdResponse);
  }

   public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
     let req = new InvoiceFetchRequest();
     req.CompanyRefs.push(CompanyRef)
     let tdResponse = await Invoice.FetchTransportData(req, errorHandler) as TransportData;
     return Invoice.ListFromTransportData(tdResponse);
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
