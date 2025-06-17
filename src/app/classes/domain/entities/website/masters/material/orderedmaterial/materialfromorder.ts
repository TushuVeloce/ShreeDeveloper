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
import { MaterialFromOrderFetchRequest } from "./materialfromorderfetchrequest";


export class MaterialFromOrderProps {
  public readonly Db_Table_Name = "MaterialStockOrderDetails";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public MaterialRequisitionDetailsRef:number=0
  public Code: string = '';
  public MaterialName: string = '';
  public UnitRef: number = 0;
  public readonly UnitName: string = '';
  public OrderedQty: number = 0
  public CompanyRef: number = 0;
  public CompanyName: string = '';

  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new MaterialFromOrderProps(true);
  }
}

export class MaterialFromOrder implements IPersistable<MaterialFromOrder> {
  public static readonly Db_Table_Name: string = 'MaterialStockOrderDetails';

  private constructor(public readonly p: MaterialFromOrderProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): MaterialFromOrder {
    let newState: MaterialFromOrderProps = Utils.GetInstance().DeepCopy(this.p);
    return MaterialFromOrder.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new MaterialFromOrder(MaterialFromOrderProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new MaterialFromOrder(data as MaterialFromOrderProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.MaterialName == '') {
      vra.add('Name', 'Name cannot be blank.');
    }
    // else if (!new RegExp(ValidationPatterns.NameWithNosAndSpace).test(this.p.Name)) {
    //   vra.add('Name', ValidationMessages.NameWithNosAndSpaceMsg + ' for Name');
    // }
    if (this.p.Code == '') vra.add('Code', 'Code cannot be blank.');
    if (this.p.UnitRef == 0) vra.add('UnitRef', 'Unit cannot be blank.');
    if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, MaterialFromOrder.Db_Table_Name, this.p);
  }

  private static m_currentInstance: MaterialFromOrder = MaterialFromOrder.CreateNewInstance();

  public static GetCurrentInstance() {
    return MaterialFromOrder.m_currentInstance;
  }

  public static SetCurrentInstance(value: MaterialFromOrder) {
    MaterialFromOrder.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): MaterialFromOrder {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, MaterialFromOrder.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, MaterialFromOrder.Db_Table_Name)!.Entries) {
        return MaterialFromOrder.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
   sortPropertyName: string = ""): MaterialFromOrder[] {
    let result: MaterialFromOrder[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, MaterialFromOrder.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, MaterialFromOrder.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(MaterialFromOrder.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): MaterialFromOrder[] {
    return MaterialFromOrder.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: MaterialFromOrderFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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

  public static async FetchInstance(ref: number,companyRef:number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new MaterialFromOrderFetchRequest();
    req.MaterialRefs.push(ref);
    req.CompanyRefs.push(companyRef);

    let tdResponse = await MaterialFromOrder.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialFromOrder.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: MaterialFromOrderFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await MaterialFromOrder.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialFromOrder.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new MaterialFromOrderFetchRequest();
    let tdResponse = await MaterialFromOrder.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialFromOrder.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new MaterialFromOrderFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await MaterialFromOrder.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialFromOrder.ListFromTransportData(tdResponse);
  }

   public static async FetchOrderedMaterials(SiteRef:number, CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new MaterialFromOrderFetchRequest();
     req.CompanyRefs.push(CompanyRef)
     req.SiteRefs.push(SiteRef)
    let tdResponse = await MaterialFromOrder.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialFromOrder.ListFromTransportData(tdResponse);
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
