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
import { EmployeeAppraisalFetchRequest } from "./employeeappraisalfetchrequest";


export class EmployeeAppraisalProps {
  public readonly Db_Table_Name = "EmployeeAppraisalMaster";
  public Ref: number = 0;
  public Name: string = '';
  public CompanyRef: number = 0;
  public CompanyName: string = '';
  public Appraisaldate: string = '';
  public EmployeeRef: number = 0;
  public EmployeeName: string = '';
  public PreviousDesignation: string = '';
  public NewDesignation: string = '';
  public PreviousSalaryPerMonth: number = 0;
  public PreviousSalaryPerYear: number = 0;
  public NewSalaryPerMonth: number = 0;
  public NewSalaryPerYear: number = 0;
  public Description : string = '';
  public AddDocument: string = '';
  
  

  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new EmployeeAppraisalProps(true);
  }
}

export class EmployeeAppraisal implements IPersistable<EmployeeAppraisal> {
  public static readonly Db_Table_Name: string = 'EmployeeAppraisalMaster';

  private constructor(public readonly p: EmployeeAppraisalProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
            const newRefs = await IdProvider.GetInstance().GetNextEntityId();
            // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): EmployeeAppraisal {
    let newState: EmployeeAppraisalProps = Utils.GetInstance().DeepCopy(this.p);
    return EmployeeAppraisal.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new EmployeeAppraisal(EmployeeAppraisalProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new EmployeeAppraisal(data as EmployeeAppraisalProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.Name == '') vra.add('Name', 'Name cannot be blank.');
    if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company Name cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, EmployeeAppraisal.Db_Table_Name, this.p);
  }

  private static m_currentInstance: EmployeeAppraisal = EmployeeAppraisal.CreateNewInstance();

  public static GetCurrentInstance() {
    return EmployeeAppraisal.m_currentInstance;
  }

  public static SetCurrentInstance(value: EmployeeAppraisal) {
    EmployeeAppraisal.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): EmployeeAppraisal {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, EmployeeAppraisal.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, EmployeeAppraisal.Db_Table_Name)!.Entries) {
        return EmployeeAppraisal.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): EmployeeAppraisal[] {
    let result: EmployeeAppraisal[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, EmployeeAppraisal.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, EmployeeAppraisal.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(EmployeeAppraisal.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): EmployeeAppraisal[] {
    return EmployeeAppraisal.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: EmployeeAppraisalFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new EmployeeAppraisalFetchRequest();
    req.EmployeeAppraisalRefs.push(ref);

    let tdResponse = await EmployeeAppraisal.FetchTransportData(req, errorHandler) as TransportData;
    return EmployeeAppraisal.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: EmployeeAppraisalFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await EmployeeAppraisal.FetchTransportData(req, errorHandler) as TransportData;
    return EmployeeAppraisal.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new EmployeeAppraisalFetchRequest();
    let tdResponse = await EmployeeAppraisal.FetchTransportData(req, errorHandler) as TransportData;
    return EmployeeAppraisal.ListFromTransportData(tdResponse);
  }
  
  public static async FetchEntireListByCompanyRef(CompanyRef:number,errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new EmployeeAppraisalFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await EmployeeAppraisal.FetchTransportData(req, errorHandler) as TransportData;
    return EmployeeAppraisal.ListFromTransportData(tdResponse);
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
