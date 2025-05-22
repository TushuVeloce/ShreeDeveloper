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
import { RegistrarOfficeFetchRequest } from "./registrarofficefetchrequest";


export class RegistrarOfficeProps {
  public readonly Db_Table_Name = "RegistrarOffice";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public PlotRef: number = 0;
  public SiteRef: number = 0;
  public CustomerName: string = '';
  public PlotName: string = '';
  public Name: string = '';
  public PhoneNumber: number = 0;

  public IsChequeSubmit: Boolean = false;

  public IsCustomerAadharSubmit: boolean = false;
  public IsCustomerPanSubmit: boolean = false;

  public Witness1Submit: boolean = false;

  public Witness1Name: string = '';
  public Witness1ContactNo: number = 0;

  public CustomerAadharPath: string = '';
  public CustomerAadharFile: File = null as any

  public CustomerPanPath: string = '';
  public CustomerPanFile: File = null as any

  public Witness1IsAadharSubmit: boolean = false;

  public Witness1AadharPath: string = '';
  public Witness1AadharFile: File = null as any

  public Witness1IsPanSubmit: boolean = false;

  public Witness1PanPath: string = '';
  public Witness1PanFile: File = null as any

  public Witness2Submit: boolean = false;
  public Witness2Name: string = '';
  public Witness2ContactNo: number = 0;
  public Witness2IsAadharSubmit: boolean = false;

  public Witness2AadharPath: string = '';
  public Witness2AadharFile: File = null as any

  public Witness2IsPanSubmit: boolean = false;

  public Witness2PanPath: string = '';
  public Witness2PanFile: File = null as any


  //  public IsAgreementToSaleSubmit : boolean = false;
  public AgreementDocumentNo: string = '';
  public AgreementDate: string = '';

  public AgreementDocumentPath: string = '';
  public AgreementDocumentFile: File = null as any

  //  public IsSaledeedSubmit : Boolean = false;
  public SaleDeedDocumentNo: string = '';

  public SaleDeedtDocumentPath: string = '';
  public SaleDeedtDocumentFile: File = null as any

  public SaleDeedDate: string = '';
  public IsIndexOriginalSubmit: boolean = false;

  public IndexOriginalDocumentPath: string = '';
  public IndexOriginalDocumentFile: File = null as any

  public IsDastZeroxSubmit: boolean = false;

  public DastZeroxDocumentPath: string = '';
  public DastZeroxDocumentFile: File = null as any

  //  public IsTalathiSubmit : Boolean = false;
  public TalathiInwardNo: string = '';
  public TalathiDate: string = '';
  public IsFerfarNoticeSubmit: boolean = false;
  public FerfarNoticeDocumentPath: string = '';
  public IsFinalCustomer712Submit: boolean = false;
  public FinalCustomer712DocumentPath: string = '';
  public IsSpiral712Submit: boolean = false;
  public IsClientSubmit: boolean = false;

  public UpdatedDate: string = '';

  public CompanyRef: number = 0;
  public CustomerRef: number = 0;
  public CompanyName: string = '';





  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new RegistrarOfficeProps(true);
  }
}



export class RegistrarOffice implements IPersistable<RegistrarOffice> {
  public static readonly Db_Table_Name: string = 'RegisterOffice';

  private constructor(public readonly p: RegistrarOfficeProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): RegistrarOffice {
    let newState: RegistrarOfficeProps = Utils.GetInstance().DeepCopy(this.p);
    return RegistrarOffice.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new RegistrarOffice(RegistrarOfficeProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new RegistrarOffice(data as RegistrarOfficeProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    // if (this.p.CustomerName == '') vra.add('CustomerName', 'Customer Name cannot be blank.');
    // if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company Name cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, RegistrarOffice.Db_Table_Name, this.p);
  }

  private static m_currentInstance: RegistrarOffice = RegistrarOffice.CreateNewInstance();

  public static GetCurrentInstance() {
    return RegistrarOffice.m_currentInstance;
  }

  public static SetCurrentInstance(value: RegistrarOffice) {
    RegistrarOffice.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): RegistrarOffice {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, RegistrarOffice.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, RegistrarOffice.Db_Table_Name)!.Entries) {
        return RegistrarOffice.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): RegistrarOffice[] {
    let result: RegistrarOffice[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, RegistrarOffice.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, RegistrarOffice.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(RegistrarOffice.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): RegistrarOffice[] {
    return RegistrarOffice.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: RegistrarOfficeFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new RegistrarOfficeFetchRequest();
    req.RegistrarOfficeRefs.push(ref);

    let tdResponse = await RegistrarOffice.FetchTransportData(req, errorHandler) as TransportData;
    return RegistrarOffice.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: RegistrarOfficeFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await RegistrarOffice.FetchTransportData(req, errorHandler) as TransportData;
    return RegistrarOffice.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new RegistrarOfficeFetchRequest();
    let tdResponse = await RegistrarOffice.FetchTransportData(req, errorHandler) as TransportData;
    return RegistrarOffice.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListBySiteRef(SiteRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new RegistrarOfficeFetchRequest();
    req.SiteRefs.push(SiteRef)
    let tdResponse = await RegistrarOffice.FetchTransportData(req, errorHandler) as TransportData;
    return RegistrarOffice.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByPlotRef(PlotRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new RegistrarOfficeFetchRequest();
    req.PlotRefs.push(PlotRef)
    let tdResponse = await RegistrarOffice.FetchTransportData(req, errorHandler) as TransportData;
    return RegistrarOffice.ListFromTransportData(tdResponse);
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
