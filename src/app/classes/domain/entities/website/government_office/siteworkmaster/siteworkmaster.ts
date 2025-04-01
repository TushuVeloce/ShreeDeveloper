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
import { SiteWorkMasterFetchRequest } from "./siteworkmasterfetchrequest";

export class ApplicableTypeProps {
  public ApplicableTypeRef: number = 0;
  public ApplicableTypeName: string = '';
}


export class SiteWorkMasterProps {
  public readonly Db_Table_Name = "SiteWorkMaster";
  public Ref: number = 0;
  public Name: string = '';
  public SiteWorkGroupRef: number = 0;
  public readonly SiteWorkGroupName: string = '';
  public CompanyRef: number = 0;
  public CompanyName: string = '';
  public DisplayOrder: number = 0

  // public ListOfApplicableTypes : ApplicableTypeProps [] = [];


  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new SiteWorkMasterProps(true);
  }
}

export class SiteWorkMaster implements IPersistable<SiteWorkMaster> {
  public static readonly Db_Table_Name: string = 'SiteWorkMaster';

  private constructor(public readonly p: SiteWorkMasterProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): SiteWorkMaster {
    let newState: SiteWorkMasterProps = Utils.GetInstance().DeepCopy(this.p);
    return SiteWorkMaster.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new SiteWorkMaster(SiteWorkMasterProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new SiteWorkMaster(data as SiteWorkMasterProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.Name == '') vra.add('Name', 'Name cannot be blank.');
    if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company cannot be blank.');
    if (this.p.DisplayOrder > 0) vra.add('DisplayOrder', 'Display Order cannot be less than 1.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, SiteWorkMaster.Db_Table_Name, this.p);
  }

  private static m_currentInstance: SiteWorkMaster = SiteWorkMaster.CreateNewInstance();

  public static GetCurrentInstance() {
    return SiteWorkMaster.m_currentInstance;
  }

  public static SetCurrentInstance(value: SiteWorkMaster) {
    SiteWorkMaster.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): SiteWorkMaster {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, SiteWorkMaster.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, SiteWorkMaster.Db_Table_Name)!.Entries) {
        return SiteWorkMaster.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): SiteWorkMaster[] {
    let result: SiteWorkMaster[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, SiteWorkMaster.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, SiteWorkMaster.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(SiteWorkMaster.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): SiteWorkMaster[] {
    return SiteWorkMaster.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: SiteWorkMasterFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new SiteWorkMasterFetchRequest();
    req.SiteWorkGroupRef.push(ref);

    let tdResponse = await SiteWorkMaster.FetchTransportData(req, errorHandler) as TransportData;
    return SiteWorkMaster.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: SiteWorkMasterFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await SiteWorkMaster.FetchTransportData(req, errorHandler) as TransportData;
    return SiteWorkMaster.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new SiteWorkMasterFetchRequest();
    let tdResponse = await SiteWorkMaster.FetchTransportData(req, errorHandler) as TransportData;
    return SiteWorkMaster.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new SiteWorkMasterFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await SiteWorkMaster.FetchTransportData(req, errorHandler) as TransportData;
    return SiteWorkMaster.ListFromTransportData(tdResponse);
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
