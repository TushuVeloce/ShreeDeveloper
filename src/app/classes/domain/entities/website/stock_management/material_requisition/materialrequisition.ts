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
import { MaterialRequisitionFetchRequest } from "./materialrequisitionfetchrequest";
import { CountryStateCityRefs, ValidationMessages, ValidationPatterns } from "src/app/classes/domain/constants";
import { RequiredMaterialDetailProps } from "./requiredmaterial/requiredmaterial";



export class MaterialRequisitionProps {
  public readonly Db_Table_Name = "MaterialRequisition";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public Date: string = '';
  public SiteRef: number = 0;
  public readonly SiteName: string = '';
  public CompanyRef: number = 0;
  public CompanyName: string = '';
  public Status: number = 0
  public MaterialRequisitionDetailsArray: RequiredMaterialDetailProps[] = [];
  // public MaterialRequisitionStatus: number = 0;


  public readonly IsNewlyCreated: boolean = false;
  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new MaterialRequisitionProps(true);
  }
}

export class MaterialRequisition implements IPersistable<MaterialRequisition> {
  public static readonly Db_Table_Name: string = 'MaterialRequisition';

  public constructor(public readonly p: MaterialRequisitionProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): MaterialRequisition {
    let newState: MaterialRequisitionProps = Utils.GetInstance().DeepCopy(this.p);
    return MaterialRequisition.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new MaterialRequisition(MaterialRequisitionProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new MaterialRequisition(data as MaterialRequisitionProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company Name cannot be blank.');
    if (this.p.SiteRef == 0) vra.add('SiteRef', 'Site Name cannot be blank.');

  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, MaterialRequisition.Db_Table_Name, this.p);
  }

  private static m_currentInstance: MaterialRequisition = MaterialRequisition.CreateNewInstance();

  public static GetCurrentInstance() {
    return MaterialRequisition.m_currentInstance;
  }

  public static SetCurrentInstance(value: MaterialRequisition) {
    MaterialRequisition.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): MaterialRequisition {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, MaterialRequisition.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, MaterialRequisition.Db_Table_Name)!.Entries) {
        return MaterialRequisition.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): MaterialRequisition[] {
    let result: MaterialRequisition[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, MaterialRequisition.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, MaterialRequisition.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(MaterialRequisition.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): MaterialRequisition[] {
    return MaterialRequisition.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: MaterialRequisitionFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new MaterialRequisitionFetchRequest();
    req.MaterialRequisitionManagementRefs.push(ref);

    let tdResponse = await MaterialRequisition.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialRequisition.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: MaterialRequisitionFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await MaterialRequisition.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialRequisition.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new MaterialRequisitionFetchRequest();
    let tdResponse = await MaterialRequisition.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialRequisition.ListFromTransportData(tdResponse);
  }
  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new MaterialRequisitionFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await MaterialRequisition.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialRequisition.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByAllFilters(CompanyRef: number, Status: number, SiteRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new MaterialRequisitionFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    if (Status) {
      req.MaterialRequisitionStatus.push(Status)
    }
    if (SiteRef) {
      req.SiteRefs.push(SiteRef)
    }
    let tdResponse = await MaterialRequisition.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialRequisition.ListFromTransportData(tdResponse);
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
