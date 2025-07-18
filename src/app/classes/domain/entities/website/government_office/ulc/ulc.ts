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
import { ApplicableTypeProps } from "../siteworkmaster/siteworkmaster";
import { ULCFetchRequest } from "./ulcfetchrequest";


export class ULCProps {
  public readonly Db_Table_Name = "GovernmentULC";
  public IsNewlyCreated: boolean = false;
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public SiteRef: number = 0;
  public SiteName: string = '';
  public CompanyRef: number = 0;
  public CompanyName: string = '';

  public IsUlcSubmit: boolean = false;
  public UlcInwardNo: string = '';
  public UlcDate: string = '';
  public IsUlcTpPatraSubmit: boolean = false;
  public IsSaatBaraSubmit: boolean = false;
  public IsTatpurtiOrderVaNakashaSubmit: boolean = false;
  public IsSanadBinshetiSubmit: boolean = false;
  public IsPratigyaPatraSubmit: boolean = false;
  public IsOutwardsubmit: boolean = false;
  public TpOfficeInwardNo: string = '';
  public TpOfficeDate: string = '';
  public IsMojniTarikhSubmit: boolean = false;
  public IsChalanSubmit: boolean = false;
  public OutwardOutwardNo: string = '';
  public OutwardDate: string = '';
  public IsTpOfficeSubmit: boolean = false;

  public IsGovernmentUlcComplete: boolean = false;


  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new ULCProps(true);
  }
}

export class ULC implements IPersistable<ULC> {
  TransactionJson(TransactionJson: any) {
    throw new Error('Method not implemented.');
  }

  public IsComplete: boolean = false;

  public static readonly Db_Table_Name: string = 'GovernmentULC';

  private constructor(public readonly p: ULCProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): ULC {
    let newState: ULCProps = Utils.GetInstance().DeepCopy(this.p);
    return ULC.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new ULC(ULCProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new ULC(data as ULCProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.SiteRef == 0) vra.add('SiteWorkRef', 'Site Name cannot be blank.');
    if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company cannot be blank.');
    // if (this.p.TransactionJson == '') vra.add('TransactionJson', 'Transaction cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, ULC.Db_Table_Name, this.p);
  }

  private static m_currentInstance: ULC = ULC.CreateNewInstance();

  public static GetCurrentInstance() {
    return ULC.m_currentInstance;
  }

  public static SetCurrentInstance(value: ULC) {
    ULC.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): ULC {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, ULC.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, ULC.Db_Table_Name)!.Entries) {
        return ULC.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): ULC[] {
    let result: ULC[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, ULC.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, ULC.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(ULC.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): ULC[] {
    return ULC.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: ULCFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new ULCFetchRequest();
    req.GovernmentTransationRefs.push(ref);

    let tdResponse = await ULC.FetchTransportData(req, errorHandler) as TransportData;
    return ULC.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: ULCFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await ULC.FetchTransportData(req, errorHandler) as TransportData;
    return ULC.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new ULCFetchRequest();
    let tdResponse = await ULC.FetchTransportData(req, errorHandler) as TransportData;
    return ULC.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new ULCFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await ULC.FetchTransportData(req, errorHandler) as TransportData;
    return ULC.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListBySiteRef(SiteRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new ULCFetchRequest();
    req.SiteRefs.push(SiteRef)
    let tdResponse = await ULC.FetchTransportData(req, errorHandler) as TransportData;
    return ULC.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyAndSiteRef(CompanyRef: number, SiteRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new ULCFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    req.SiteRefs.push(SiteRef)
    let tdResponse = await ULC.FetchTransportData(req, errorHandler) as TransportData;
    return ULC.ListFromTransportData(tdResponse);
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
