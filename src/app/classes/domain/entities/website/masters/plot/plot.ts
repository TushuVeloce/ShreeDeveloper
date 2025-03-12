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
import { PlotFetchRequest } from "./plotfetchrequest";


export class PlotProps {
  public readonly Db_Table_Name = "PlotManagement";
  public Ref: number = 0;
  public PlotNo: string ='';
  public AreaInSqm: number =0;
  public AreaInSqft: number =0;
  public GovermentRatePerSqm: number =0;
  public GovermentRatePerSqft:number =0;
  public BasicRatePerSqm : number =0;
  public BasicRatePerSqft : number =0;
  public BookingRemark : number =0;
  public CustomerName: string ='';
  public Address: string ='';
  public MobNo: string ='';
  public Reference: string ='';
  public CompanyRef: number = 0;
  public CompanyName: string = '';
  public SiteRef: number = 0;
  public readonly SiteName: string = '';


  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new PlotProps(true);
  }
}

export class Plot implements IPersistable<Plot> {
  public static readonly Db_Table_Name: string = 'PlotManagement';

  private constructor(public readonly p: PlotProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
            const newRefs = await IdProvider.GetInstance().GetNextEntityId();
            // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): Plot {
    let newState: PlotProps = Utils.GetInstance().DeepCopy(this.p);
    return Plot.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new Plot(PlotProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new Plot(data as PlotProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.PlotNo == '') vra.add('PlotNo', 'Plot No cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, Plot.Db_Table_Name, this.p);
  }

  private static m_currentInstance: Plot = Plot.CreateNewInstance();

  public static GetCurrentInstance() {
    return Plot.m_currentInstance;
  }

  public static SetCurrentInstance(value: Plot) {
    Plot.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): Plot {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, Plot.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, Plot.Db_Table_Name)!.Entries) {
        return Plot.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): Plot[] {
    let result: Plot[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, Plot.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, Plot.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(Plot.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): Plot[] {
    return Plot.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: PlotFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new PlotFetchRequest();
    req.PlotRefs.push(ref);

    let tdResponse = await Plot.FetchTransportData(req, errorHandler) as TransportData;
    return Plot.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: PlotFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await Plot.FetchTransportData(req, errorHandler) as TransportData;
    return Plot.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new PlotFetchRequest();
    let tdResponse = await Plot.FetchTransportData(req, errorHandler) as TransportData;
    return Plot.ListFromTransportData(tdResponse);
  }
  // public static async FetchEntireListByProjectRef(ProjectRef:number,errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
  //   let req = new PlotFetchRequest();
  //   req.GAAProjectRefs.push(ProjectRef)
  //   let tdResponse = await Plot.FetchTransportData(req, errorHandler) as TransportData;
  //   return Plot.ListFromTransportData(tdResponse);
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
