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
import { MarketingManagementFetchRequest } from "./marketingmanagementfetchrequest";
import { ValidationMessages, ValidationPatterns } from "src/app/classes/domain/constants";

export class ServiceSuppliedByVendorProps {
  public Ref: number = 0;
  public Name: string = '';
}

export class MarketingManagementProps {
  public readonly Db_Table_Name = "MarketingManagementMaster";
  public Ref: number = 0;
  public SiteRef: number = 0;
  public readonly SiteName: string = '';
  public Date: string = '';
  public MarketingTypeRef: number = 0;
  public MarketingTypeName: string = '';
  public VendorRef: number = 0;
  public VendorName: string = '';
  public Page: number = 0;
  public Place: string = '';
  public Rate: number = 0;
  public Quantity: number = 0;
  public Total: number = 0;
  public Name: string = '';
  public Narration: string = '';
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public CompanyRef: number = 0;
  public CompanyName: string = '';
  public VendorServiceRef: number = 0;
  public VendorServiceName: string = '';

  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new MarketingManagementProps(true);
  }
}

export class MarketingManagement implements IPersistable<MarketingManagement> {
  public static readonly Db_Table_Name: string = 'MarketingManagementMaster';

  private constructor(public readonly p: MarketingManagementProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): MarketingManagement {
    let newState: MarketingManagementProps = Utils.GetInstance().DeepCopy(this.p);
    return MarketingManagement.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new MarketingManagement(MarketingManagementProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new MarketingManagement(data as MarketingManagementProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.Name == '') {
      vra.add('Name', 'Name cannot be blank.');
    } else if (!new RegExp(ValidationPatterns.NameWithNosAndSpace).test(this.p.Name)) {
      vra.add('Name', ValidationMessages.NameWithNosAndSpaceMsg + ' for Name');
    }
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, MarketingManagement.Db_Table_Name, this.p);
  }

  private static m_currentInstance: MarketingManagement = MarketingManagement.CreateNewInstance();

  public static GetCurrentInstance() {
    return MarketingManagement.m_currentInstance;
  }

  public static SetCurrentInstance(value: MarketingManagement) {
    MarketingManagement.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): MarketingManagement {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, MarketingManagement.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, MarketingManagement.Db_Table_Name)!.Entries) {
        return MarketingManagement.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): MarketingManagement[] {
    let result: MarketingManagement[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, MarketingManagement.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, MarketingManagement.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(MarketingManagement.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): MarketingManagement[] {
    return MarketingManagement.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: MarketingManagementFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new MarketingManagementFetchRequest();
    req.MarketingManagementRefs.push(ref);

    let tdResponse = await MarketingManagement.FetchTransportData(req, errorHandler) as TransportData;
    return MarketingManagement.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: MarketingManagementFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await MarketingManagement.FetchTransportData(req, errorHandler) as TransportData;
    return MarketingManagement.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new MarketingManagementFetchRequest();
    let tdResponse = await MarketingManagement.FetchTransportData(req, errorHandler) as TransportData;
    return MarketingManagement.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new MarketingManagementFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await MarketingManagement.FetchTransportData(req, errorHandler) as TransportData;
    return MarketingManagement.ListFromTransportData(tdResponse);
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
