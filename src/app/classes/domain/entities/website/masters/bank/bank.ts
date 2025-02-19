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
import { BankFetchRequest } from "./bankfetchrequest";


export class BankProps {
  public readonly Db_Table_Name = "BankAccountMaster";
  public Ref: number = 0;
  public CompanyRef: number = 0;
  public Name: string = '';
  public BranchName: string = '';
  public AccountNumber: string = '';
  public IFSCCode: string = '';
  public OpeningBalance: number = 0;
  public CreatedFinancialYear: string = '';
  
  public readonly IsNewlyCreated: boolean = false;

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new BankProps(true);
  }
}

export class Bank implements IPersistable<Bank> {
  public static readonly Db_Table_Name: string = 'BankAccountMaster';

  private constructor(public readonly p: BankProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
            const newRefs = await IdProvider.GetInstance().GetNextEntityId();
            // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): Bank {
    let newState: BankProps = Utils.GetInstance().DeepCopy(this.p);
    return Bank.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new Bank(BankProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new Bank(data as BankProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.Name == '') vra.add('Name', 'Name cannot be blank.');
    if (this.p.BranchName == '') vra.add('Branch', 'Branch cannot be blank.');
    if (this.p.AccountNumber == '') vra.add('AccountNumber', 'Account No cannot be blank.');
    if (this.p.IFSCCode == '') vra.add('IFSCCode', 'IFSC Code cannot be blank.');
    if (this.p.OpeningBalance == 0) vra.add('OpeningBalance', 'Opening Balance cannot be blank.');
    if (this.p.CreatedFinancialYear == '') vra.add('CreatedFinancialYear', 'Created Financial Year cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, Bank.Db_Table_Name, this.p);
  }

  private static m_currentInstance: Bank = Bank.CreateNewInstance();

  public static GetCurrentInstance() {
    return Bank.m_currentInstance;
  }

  public static SetCurrentInstance(value: Bank) {
    Bank.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): Bank {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, Bank.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, Bank.Db_Table_Name)!.Entries) {
        return Bank.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): Bank[] {
    let result: Bank[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, Bank.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, Bank.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(Bank.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): Bank[] {
    return Bank.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: BankFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new BankFetchRequest();
    req.BankRef.push(ref);

    let tdResponse = await Bank.FetchTransportData(req, errorHandler) as TransportData;
    return Bank.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: BankFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await Bank.FetchTransportData(req, errorHandler) as TransportData;
    return Bank.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new BankFetchRequest();
    let tdResponse = await Bank.FetchTransportData(req, errorHandler) as TransportData;
    return Bank.ListFromTransportData(tdResponse);
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
