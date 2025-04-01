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
import { CustomProcessFetchRequest } from "./customprocessfetchrequest";


export class CustomProcessProps {
  public Ref: number = 0;
  public SiteRef : number = 0;
  public CustomerEnquiryRef: number = 0;
  public DiscountedRateOnArea : number = 0;
  public DiscountOnTotalPlotAmount : number = 0;
  public TotalPlotAmount: number = 0;
  public RegisterDate: string = '';
  public RegisterBy: string = '';
  public GovernmentValue: number = 0;
  public ValueOfAgreement: number = 0;
  public TaxValueInPercentage : number = 0;
  public StampDuties : number = 0;
  public RegTaxValuesInPercentage:  number = 0;
  public RegistrationFees:  number = 0;
  public GoodsServicesTax:  number = 0;
  public LegalCharges:  number = 0;
  public TotalExtraCharges:  number = 0;
  public GrandTotal:  number = 0;
  public AmountPaid:  number = 0;
  public RemainingAmount:  number = 0;
  public GstToatalAmount:  number = 0;
  public CompanyRef:  number = 0;
  public CreatedBy:  number = 0;
  public UpdatedBy:  number = 0;


  public readonly IsNewlyCreated: boolean = false;

  public constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new CustomProcessProps(true);
  }
}

export class CustomProcess implements IPersistable<CustomProcess> {
  public static readonly Db_Table_Name: string = 'CustomProcess';

  private constructor(public readonly p: CustomProcessProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
            const newRefs = await IdProvider.GetInstance().GetNextEntityId();
            // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public static async getPrimaryKeysWithValidValues(): Promise<number> {
    const newRefs = await IdProvider.GetInstance().GetNextEntityId();
          // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
    let newRef = newRefs[0];
    if (newRef <= 0) throw new Error("Cannot assign Id. Please try again");
    return newRef
}

  public GetEditableVersion(): CustomProcess {
    let newState: CustomProcessProps = Utils.GetInstance().DeepCopy(this.p);
    return CustomProcess.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new CustomProcess(CustomProcessProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new CustomProcess(data as CustomProcessProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.CustomerEnquiryRef == 0) vra.add('CustomerEnquiryRef', 'CustomerEnquiry Name cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, CustomProcess.Db_Table_Name, this.p);
  }

  private static m_currentInstance: CustomProcess = CustomProcess.CreateNewInstance();

  public static GetCurrentInstance() {
    return CustomProcess.m_currentInstance;
  }

  public static SetCurrentInstance(value: CustomProcess) {
    CustomProcess.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): CustomProcess {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, CustomProcess.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, CustomProcess.Db_Table_Name)!.Entries) {
        return CustomProcess.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): CustomProcess[] {
    let result: CustomProcess[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, CustomProcess.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, CustomProcess.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(CustomProcess.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): CustomProcess[] {
    return CustomProcess.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: CustomProcessFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new CustomProcessFetchRequest();
    req.CustomProcessRefs.push(ref);

    let tdResponse = await CustomProcess.FetchTransportData(req, errorHandler) as TransportData;
    return CustomProcess.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: CustomProcessFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await CustomProcess.FetchTransportData(req, errorHandler) as TransportData;
    return CustomProcess.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new CustomProcessFetchRequest();
    let tdResponse = await CustomProcess.FetchTransportData(req, errorHandler) as TransportData;
    return CustomProcess.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef:number,errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new CustomProcessFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await CustomProcess.FetchTransportData(req, errorHandler) as TransportData;
    return CustomProcess.ListFromTransportData(tdResponse);
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
