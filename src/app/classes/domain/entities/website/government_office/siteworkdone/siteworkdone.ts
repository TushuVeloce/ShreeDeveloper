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
import { SiteWorkDoneFetchRequest } from "./siteworkdonefetchrequest";
import { ApplicableTypeProps } from "../siteworkmaster/siteworkmaster";


export class SiteWorkDoneProps {
  public readonly Db_Table_Name = "SiteWorkDoneMaster";
  public Ref: number = 0;
  public SiteWorkRef: number = 0;
  public ApplicableTypeRef: number = 0;
  public SiteWorkGroupRef: number = 0;
  public CompanyRef: number = 0;
  public CompanyName: string = '';
  public ListOfApplicableTypes: ApplicableTypeProps[] = [];

  public readonly IsNewlyCreated: boolean = false;
  public readonly SiteWorkName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new SiteWorkDoneProps(true);
  }
}

export class SiteWorkDone implements IPersistable<SiteWorkDone> {
  public static readonly Db_Table_Name: string = 'SiteWorkDoneMaster';

  private constructor(public readonly p: SiteWorkDoneProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): SiteWorkDone {
    let newState: SiteWorkDoneProps = Utils.GetInstance().DeepCopy(this.p);
    return SiteWorkDone.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new SiteWorkDone(SiteWorkDoneProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new SiteWorkDone(data as SiteWorkDoneProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.SiteWorkRef == 0) vra.add('SiteWorkRef', 'Site Work Name cannot be blank.');
    if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, SiteWorkDone.Db_Table_Name, this.p);
  }

  private static m_currentInstance: SiteWorkDone = SiteWorkDone.CreateNewInstance();

  public static GetCurrentInstance() {
    return SiteWorkDone.m_currentInstance;
  }

  public static SetCurrentInstance(value: SiteWorkDone) {
    SiteWorkDone.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): SiteWorkDone {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, SiteWorkDone.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, SiteWorkDone.Db_Table_Name)!.Entries) {
        return SiteWorkDone.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): SiteWorkDone[] {
    let result: SiteWorkDone[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, SiteWorkDone.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, SiteWorkDone.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(SiteWorkDone.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): SiteWorkDone[] {
    return SiteWorkDone.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: SiteWorkDoneFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new SiteWorkDoneFetchRequest();
    req.SiteWorkGroupRef.push(ref);

    let tdResponse = await SiteWorkDone.FetchTransportData(req, errorHandler) as TransportData;
    return SiteWorkDone.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: SiteWorkDoneFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await SiteWorkDone.FetchTransportData(req, errorHandler) as TransportData;
    return SiteWorkDone.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new SiteWorkDoneFetchRequest();
    let tdResponse = await SiteWorkDone.FetchTransportData(req, errorHandler) as TransportData;
    return SiteWorkDone.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new SiteWorkDoneFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await SiteWorkDone.FetchTransportData(req, errorHandler) as TransportData;
    return SiteWorkDone.ListFromTransportData(tdResponse);
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
