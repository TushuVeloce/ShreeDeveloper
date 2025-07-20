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
import { InwardMaterialFetchRequest } from "./inwardmaterialfetchrequest";
import { GetMaterialFromMaterialInwardFetchRequest } from "../../stock_consume/costomefetchrequest";


export class InwardMaterialDetailProps {
  public readonly Db_Table_Name = "MaterialInwardDetails";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public MaterialRef: number = 0;
  public Date: string = '';
  public MaterialStockOrderDetailsRef:number=0
  public MaterialName: string = '';
  public UnitRef: number = 0;
  public UnitName: string = '';
  public PurchaseOrderQty: number = 0;
  public InwardQty: number = 0;
  public PurchaseOrderRemainingQty: number = 0;
  public MaterialInwardRef: number = 0;
  public InternalRef: number = 0; // ✅ Add this field

  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  public constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new InwardMaterialDetailProps(true);
  }
}

export class InwardMaterial implements IPersistable<InwardMaterial> {
  public static readonly Db_Table_Name: string = 'MaterialInwardDetails';

  public constructor(public readonly p: InwardMaterialDetailProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): InwardMaterial {
    let newState: InwardMaterialDetailProps = Utils.GetInstance().DeepCopy(this.p);
    return InwardMaterial.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new InwardMaterial(InwardMaterialDetailProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new InwardMaterial(data as InwardMaterialDetailProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    // if (this.p.Name == '') vra.add('Name', 'Name cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, InwardMaterial.Db_Table_Name, this.p);
  }

  private static m_currentInstance: InwardMaterial = InwardMaterial.CreateNewInstance();

  public static GetCurrentInstance() {
    return InwardMaterial.m_currentInstance;
  }

  public static SetCurrentInstance(value: InwardMaterial) {
    InwardMaterial.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): InwardMaterial {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, InwardMaterial.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, InwardMaterial.Db_Table_Name)!.Entries) {
        return InwardMaterial.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): InwardMaterial[] {
    let result: InwardMaterial[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, InwardMaterial.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, InwardMaterial.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(InwardMaterial.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): InwardMaterial[] {
    return InwardMaterial.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: InwardMaterialFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new InwardMaterialFetchRequest();
    req.InwardMaterialRefs.push(ref);

    let tdResponse = await InwardMaterial.FetchTransportData(req, errorHandler) as TransportData;
    return InwardMaterial.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: InwardMaterialFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await InwardMaterial.FetchTransportData(req, errorHandler) as TransportData;
    return InwardMaterial.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new InwardMaterialFetchRequest();
    let tdResponse = await InwardMaterial.FetchTransportData(req, errorHandler) as TransportData;
    return InwardMaterial.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRefAndSiteRef(CompanyRef: number, SiteRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new InwardMaterialFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    req.SiteManagementRefs.push(SiteRef)
    let tdResponse = await InwardMaterial.FetchTransportData(req, errorHandler) as TransportData;
    return InwardMaterial.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListBySiteRef(siteref: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new InwardMaterialFetchRequest();
    req.SiteManagementRefs.push(siteref)
    let tdResponse = await InwardMaterial.FetchTransportData(req, errorHandler) as TransportData;
    return InwardMaterial.ListFromTransportData(tdResponse);
  }

     public static async FetchInwardMaterials(SiteRef:number, CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new InwardMaterialFetchRequest();
     req.CompanyRefs.push(CompanyRef)
     req.SiteRefs.push(SiteRef)
    let tdResponse = await InwardMaterial.FetchTransportData(req, errorHandler) as TransportData;
    return InwardMaterial.ListFromTransportData(tdResponse);
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
