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
import { DocumentFetchRequest } from "./documentfetchrequest";


export class DocumentProps {
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public Name: string = '';
  public OfficeName: string = '';
  public CompanyRef: number = 0;
  public CompanyName: string = '';

  public IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new DocumentProps(true);
  }
}

export class Document implements IPersistable<Document> {
  public static readonly Db_Table_Name: string = 'GovernmentDocumentList';

  private constructor(public readonly p: DocumentProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): Document {
    let newState: DocumentProps = Utils.GetInstance().DeepCopy(this.p);
    return Document.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new Document(DocumentProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new Document(data as DocumentProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.Name == '') vra.add('Name', 'Name cannot be blank.');
    if (this.p.OfficeName == '') vra.add('Office', 'Office cannot be blank.');
    // if (this.p.ContactNos == '') vra.add('OwnerName', 'Owner Name cannot be blank.');
    // if (this.p.EmailId == '') vra.add('EmailId', 'Email Id cannot be blank.');
    // if (this.p.PinCode == '') vra.add('PinCode', 'Pin code cannot be blank.');
    // if (this.p.Address == '') vra.add('AddressLine1', 'AddressLine1 cannot be blank.');
    // if (this.p.CountryRef == 0) vra.add('CountryRef', 'Country Name cannot be blank.');
    // if (this.p.StateRef == 0) vra.add('StateRef', 'State Name cannot be blank.');
    // if (this.p.CityRef == 0) vra.add('CityRef', 'City Name cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, Document.Db_Table_Name, this.p);
  }

  private static m_currentInstance: Document = Document.CreateNewInstance();

  public static GetCurrentInstance() {
    return Document.m_currentInstance;
  }

  public static SetCurrentInstance(value: Document) {
    Document.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): Document {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, Document.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, Document.Db_Table_Name)!.Entries) {
        return Document.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
   sortPropertyName: string = ""): Document[] {
    let result: Document[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, Document.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, Document.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(Document.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): Document[] {
    return Document.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: DocumentFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new DocumentFetchRequest();
    req.DocumentRefs.push(ref);

    let tdResponse = await Document.FetchTransportData(req, errorHandler) as TransportData;
    return Document.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: DocumentFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await Document.FetchTransportData(req, errorHandler) as TransportData;
    return Document.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new DocumentFetchRequest();
    let tdResponse = await Document.FetchTransportData(req, errorHandler) as TransportData;
    return Document.ListFromTransportData(tdResponse);
  }
  public static async FetchEntireListByDocumentRef(DocumentRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new DocumentFetchRequest();
    req.DocumentRefs.push(DocumentRef)
    let tdResponse = await Document.FetchTransportData(req, errorHandler) as TransportData;
    return Document.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new DocumentFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await Document.FetchTransportData(req, errorHandler) as TransportData;
    return Document.ListFromTransportData(tdResponse);
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
