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
import { SalaryGenerationFetchRequest } from "./salarygenerationfetchrequest";


export class SalaryGenerationProps {
  public readonly Db_Table_Name = "SalarySlipGeneration";
  public Ref: number = 0;
  public EmployeeRef: number = 0;
  public readonly EmployeeName: string = '';
  public Month: number = 0;
  public readonly MonthName: string = '';
  public TotalDays: number = 0;
  public TotalWorkingDays: number = 0;
  public TotalLeaves: number = 0;
  public TotalOverTimeHrs: number = 0;
  public TotalWorkingHrs: number = 0;
  public TotalLeavesHrs: number = 0;
  public OverAllWorkingHrs: number = 0;
  public BasicSalary: number = 0;
  public TotalAllowance: number = 0;
  public TotalIncentive: number = 0;
  public Other: number = 0;
  public GrossTotal: number = 0;
  public TDS: number = 0;
  public PF: number = 0;
  public TotalLeaveDeduction: number = 0;
  public AdvancePayment: number = 0;
  public TotalDeduction: number = 0;
  public NetSalary: number = 0;
  public CompanyRef: number = 0;
  public CompanyName: string = '';
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public SalarySlipMonthIndicator: string = 'A';

  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new SalaryGenerationProps(true);
  }
}

export class SalaryGeneration implements IPersistable<SalaryGeneration> {
  public static readonly Db_Table_Name: string = 'SalarySlipGeneration';

  private constructor(public readonly p: SalaryGenerationProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
            const newRefs = await IdProvider.GetInstance().GetNextEntityId();
            // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): SalaryGeneration {
    let newState: SalaryGenerationProps = Utils.GetInstance().DeepCopy(this.p);
    return SalaryGeneration.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new SalaryGeneration(SalaryGenerationProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new SalaryGeneration(data as SalaryGenerationProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, SalaryGeneration.Db_Table_Name, this.p);
  }

  private static m_currentInstance: SalaryGeneration = SalaryGeneration.CreateNewInstance();

  public static GetCurrentInstance() {
    return SalaryGeneration.m_currentInstance;
  }

  public static SetCurrentInstance(value: SalaryGeneration) {
    SalaryGeneration.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): SalaryGeneration {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, SalaryGeneration.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, SalaryGeneration.Db_Table_Name)!.Entries) {
        return SalaryGeneration.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
   sortPropertyName: string = ""): SalaryGeneration[] {
    let result: SalaryGeneration[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, SalaryGeneration.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, SalaryGeneration.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(SalaryGeneration.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): SalaryGeneration[] {
    return SalaryGeneration.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: SalaryGenerationFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new SalaryGenerationFetchRequest();
    req.SalaryGenerationRefs.push(ref);

    let tdResponse = await SalaryGeneration.FetchTransportData(req, errorHandler) as TransportData;
    return SalaryGeneration.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: SalaryGenerationFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await SalaryGeneration.FetchTransportData(req, errorHandler) as TransportData;
    return SalaryGeneration.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new SalaryGenerationFetchRequest();
    let tdResponse = await SalaryGeneration.FetchTransportData(req, errorHandler) as TransportData;
    return SalaryGeneration.ListFromTransportData(tdResponse);
  }

 public static async FetchEntireListByCompanyRef(CompanyRef:number,errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new SalaryGenerationFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await SalaryGeneration.FetchTransportData(req, errorHandler) as TransportData;
    return SalaryGeneration.ListFromTransportData(tdResponse);
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
