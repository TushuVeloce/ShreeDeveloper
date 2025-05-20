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
import { VendorServiceFetchRequest } from "./vendorservicefetchrequest";
import { ValidationMessages, ValidationPatterns } from "src/app/classes/domain/constants";


export class VendorServicesPropes {
  public readonly Db_Table_Name = "VendorServiceMaster";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public Name: string = '';
  public CompanyRef: number = 0
  public CompanyName: string = ''


  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static CreateFromProps(props: VendorServicesPropes): VendorService {
    return new VendorService(Object.assign(VendorServicesPropes.Blank(), props), true);
  }

  public static Blank() {
    return new VendorServicesPropes(true);
  }
}

export class VendorService implements IPersistable<VendorService> {
  public static readonly Db_Table_Name: string = 'VendorServiceMaster';

  public constructor(public readonly p: VendorServicesPropes, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): VendorService {
    let newState: VendorServicesPropes = Utils.GetInstance().DeepCopy(this.p);
    return VendorService.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new VendorService(VendorServicesPropes.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new VendorService(data as VendorServicesPropes, allowEdit);
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
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, VendorService.Db_Table_Name, this.p);
  }

  private static m_currentInstance: VendorService = VendorService.CreateNewInstance();

  public static GetCurrentInstance() {
    return VendorService.m_currentInstance;
  }

  public static SetCurrentInstance(value: VendorService) {
    VendorService.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): VendorService {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, VendorService.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, VendorService.Db_Table_Name)!.Entries) {
        return VendorService.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
   sortPropertyName: string = ""): VendorService[] {
    let result: VendorService[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, VendorService.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, VendorService.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(VendorService.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): VendorService[] {
    return VendorService.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: VendorServiceFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new VendorServiceFetchRequest();
    req.VendorServiceRefs.push(ref);

    let tdResponse = await VendorService.FetchTransportData(req, errorHandler) as TransportData;
    return VendorService.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: VendorServiceFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await VendorService.FetchTransportData(req, errorHandler) as TransportData;
    return VendorService.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new VendorServiceFetchRequest();
    let tdResponse = await VendorService.FetchTransportData(req, errorHandler) as TransportData;
    return VendorService.ListFromTransportData(tdResponse);
  }
  // public static async FetchEntireListByProjectRef(ProjectRef:number,errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
  //   let req = new VendorServiceFetchRequest();
  //   req.GAAProjectRefs.push(ProjectRef)
  //   let tdResponse = await VendorService.FetchTransportData(req, errorHandler) as TransportData;
  //   return VendorService.ListFromTransportData(tdResponse);
  // }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new VendorServiceFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await VendorService.FetchTransportData(req, errorHandler) as TransportData;
    return VendorService.ListFromTransportData(tdResponse);
  }


  public static async FetchEntireListByVendorRef(VendorRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new VendorServiceFetchRequest();
    req.VendorRefs.push(VendorRef)
    let tdResponse = await VendorService.FetchTransportData(req, errorHandler) as TransportData;
    return VendorService.ListFromTransportData(tdResponse);
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
