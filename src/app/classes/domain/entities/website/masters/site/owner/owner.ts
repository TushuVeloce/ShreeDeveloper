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
import { OwnerFetchRequest } from "./ownerfetchrequest";


export class OwnerDetailProps {
  public readonly Db_Table_Name = "SiteManagementOwnerDetails";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public Name: string = '';
  public ContactNo: string = '';
  public EmailId: string = '';
  public Address: string = '';
  public PinCode: string = '';
  public CountryRef: number = 0;
  public readonly CountryName: string = '';
  public StateRef: number = 0;
  public readonly StateName: string = '';
  public CityRef: number = 0;
  public readonly CityName: string = '';
  public SiteManagementRef: number = 0;


  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  public constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new OwnerDetailProps(true);
  }
}

export class Owner implements IPersistable<Owner> {
  public static readonly Db_Table_Name: string = 'SiteManagementOwnerDetails';

  public constructor(public readonly p: OwnerDetailProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): Owner {
    let newState: OwnerDetailProps = Utils.GetInstance().DeepCopy(this.p);
    return Owner.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new Owner(OwnerDetailProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new Owner(data as OwnerDetailProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.Name == '') vra.add('Name', 'Name cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, Owner.Db_Table_Name, this.p);
  }

  private static m_currentInstance: Owner = Owner.CreateNewInstance();

  public static GetCurrentInstance() {
    return Owner.m_currentInstance;
  }

  public static SetCurrentInstance(value: Owner) {
    Owner.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): Owner {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, Owner.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, Owner.Db_Table_Name)!.Entries) {
        return Owner.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): Owner[] {
    let result: Owner[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, Owner.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, Owner.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(Owner.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): Owner[] {
    return Owner.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: OwnerFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new OwnerFetchRequest();
    req.OwnerRefs.push(ref);

    let tdResponse = await Owner.FetchTransportData(req, errorHandler) as TransportData;
    return Owner.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: OwnerFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await Owner.FetchTransportData(req, errorHandler) as TransportData;
    return Owner.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new OwnerFetchRequest();
    let tdResponse = await Owner.FetchTransportData(req, errorHandler) as TransportData;
    return Owner.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRefAndSiteRef(CompanyRef: number, SiteRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new OwnerFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    req.SiteManagementRefs.push(SiteRef)
    let tdResponse = await Owner.FetchTransportData(req, errorHandler) as TransportData;
    return Owner.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListBySiteRef(siteref: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new OwnerFetchRequest();
    req.SiteManagementRefs.push(siteref)
    let tdResponse = await Owner.FetchTransportData(req, errorHandler) as TransportData;
    return Owner.ListFromTransportData(tdResponse);
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
