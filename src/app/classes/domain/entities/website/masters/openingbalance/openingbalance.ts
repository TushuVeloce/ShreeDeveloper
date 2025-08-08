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
import { OpeningBalanceFetchRequest } from "./openingbalancefetchrequest";
import { ValidationMessages, ValidationPatterns } from "src/app/classes/domain/constants";


export class OpeningBalanceProps {
  public readonly Db_Table_Name = "OpeningBalanceMaster";
  public CompanyRef: number = 0;
  public CompanyName: string = '';
  public CreatedBy: number = 0;
  public CreatedDate: string = '';
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedDate: string = '';
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public ModeOfPayment: number = 0;
  public OpeningBalanceAmount: number = 0;
  public InitialBalance: number = 0;
  public BankAccountRef: number = 0;
  public BankName: string = '';
  public FinancialYearRef: number = 0;
  public NetBalance: number = 0;
  public FinancialYearName: string = '';
  public ShreesBalance: number = 0;
  public TransDateTime: string = '';

  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new OpeningBalanceProps(true);
  }
}

export class OpeningBalance implements IPersistable<OpeningBalance> {
  public static readonly Db_Table_Name: string = 'OpeningBalanceMaster';

  private constructor(public readonly p: OpeningBalanceProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): OpeningBalance {
    let newState: OpeningBalanceProps = Utils.GetInstance().DeepCopy(this.p);
    return OpeningBalance.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new OpeningBalance(OpeningBalanceProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new OpeningBalance(data as OpeningBalanceProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.ModeOfPayment == 0) { vra.add('ModeOfPayment', 'Mode of Payment cannot be blank.'); }
    if (this.p.OpeningBalanceAmount == 0) { vra.add('OpeningBalanceAmount', 'Opening Balance Amount cannot be blank.'); }
    if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company Name cannot be blank.');

  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, OpeningBalance.Db_Table_Name, this.p);
  }

  private static m_currentInstance: OpeningBalance = OpeningBalance.CreateNewInstance();

  public static GetCurrentInstance() {
    return OpeningBalance.m_currentInstance;
  }

  public static SetCurrentInstance(value: OpeningBalance) {
    OpeningBalance.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): OpeningBalance {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, OpeningBalance.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, OpeningBalance.Db_Table_Name)!.Entries) {
        return OpeningBalance.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): OpeningBalance[] {
    let result: OpeningBalance[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, OpeningBalance.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, OpeningBalance.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(OpeningBalance.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): OpeningBalance[] {
    return OpeningBalance.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: OpeningBalanceFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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

  public static async FetchInstance(ref: number, companyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new OpeningBalanceFetchRequest();
    req.OpeningBalanceRefs.push(ref);
    req.CompanyRefs.push(companyRef);

    let tdResponse = await OpeningBalance.FetchTransportData(req, errorHandler) as TransportData;
    return OpeningBalance.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: OpeningBalanceFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await OpeningBalance.FetchTransportData(req, errorHandler) as TransportData;
    return OpeningBalance.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new OpeningBalanceFetchRequest();
    let tdResponse = await OpeningBalance.FetchTransportData(req, errorHandler) as TransportData;
    return OpeningBalance.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new OpeningBalanceFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await OpeningBalance.FetchTransportData(req, errorHandler) as TransportData;
    return OpeningBalance.ListFromTransportData(tdResponse);
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
