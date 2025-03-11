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
import { SiteFetchRequest } from "./sitefetchrequest";


export class SiteProps {
  public readonly Db_Table_Name = "SiteManagement";
  public Ref: number = 0;
  public Name: string = '';
  public AddressLine1 : string = '';
  public AddressLine2 : string = '';
  public PinCode : string = '';
  public CountryRef: number = 0;
  public readonly CountryName: boolean = false;
  public StateRef: number = 0;
  public readonly StateName: boolean = false;
  public CityRef: number = 0;
  public readonly CityName: boolean = false;
  public SiteInChargeRef   : number = 0;
  public EstimatedStartingDate : string = '';
  public EstimatedEndDate : string = '';
  public EstimatedCost  : number = 0;
  public TotalLandAreaInSqm   : number = 0;
  public TotalLandAreaInSqft    : number = 0;
  public NumberOfPlots : number = 0;
  public CompanyRef: number = 0;
  public CompanyName: string = '';
  public PlotDetailsList: any[] = [];
  public OwnerDetailsList: any[] = [];


  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new SiteProps(true);
  }
}

export class Site implements IPersistable<Site> {
  public static readonly Db_Table_Name: string = 'SiteManagement';

  private constructor(public readonly p: SiteProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
            const newRefs = await IdProvider.GetInstance().GetNextEntityId();
            // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): Site {
    let newState: SiteProps = Utils.GetInstance().DeepCopy(this.p);
    return Site.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new Site(SiteProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new Site(data as SiteProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.Name == '') vra.add('Name', 'Name cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, Site.Db_Table_Name, this.p);
  }

  private static m_currentInstance: Site = Site.CreateNewInstance();

  public static GetCurrentInstance() {
    return Site.m_currentInstance;
  }

  public static SetCurrentInstance(value: Site) {
    Site.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): Site {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, Site.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, Site.Db_Table_Name)!.Entries) {
        return Site.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): Site[] {
    let result: Site[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, Site.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, Site.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(Site.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): Site[] {
    return Site.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: SiteFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new SiteFetchRequest();
    req.SiteRefs.push(ref);

    let tdResponse = await Site.FetchTransportData(req, errorHandler) as TransportData;
    return Site.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: SiteFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await Site.FetchTransportData(req, errorHandler) as TransportData;
    return Site.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new SiteFetchRequest();
    let tdResponse = await Site.FetchTransportData(req, errorHandler) as TransportData;
    return Site.ListFromTransportData(tdResponse);
  }
  // public static async FetchEntireListByProjectRef(ProjectRef:number,errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
  //   let req = new SiteFetchRequest();
  //   req.GAAProjectRefs.push(ProjectRef)
  //   let tdResponse = await Site.FetchTransportData(req, errorHandler) as TransportData;
  //   return Site.ListFromTransportData(tdResponse);
  // }

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
