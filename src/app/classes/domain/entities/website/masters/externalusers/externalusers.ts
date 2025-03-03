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
import { ExternalUsersFetchRequest } from "./externalusersfetchrequest";


export class ExternalUsersProps {
  public readonly Db_Table_Name = "UserMaster";
  public Ref: number = 0;
  public Name: string = '';
  public EmailId: string = '';
  public Contacts: number = 0;
  public DepartmentRef: number = 0;
  public readonly DepartmentName: boolean = false;
  public UserRoleRef: number = 0;
  public UserRoleName: string = '';
  public CompanyRef: number = 0
  public CompanyName: string = ''

  public readonly IsNewlyCreated: boolean = false;

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new ExternalUsersProps(true);
  }
}

export class ExternalUsers implements IPersistable<ExternalUsers> {
  public static readonly Db_Table_Name: string = 'UserMaster';

  private constructor(public readonly p: ExternalUsersProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): ExternalUsers {
    let newState: ExternalUsersProps = Utils.GetInstance().DeepCopy(this.p);
    return ExternalUsers.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new ExternalUsers(ExternalUsersProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new ExternalUsers(data as ExternalUsersProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.EmailId == '') vra.add('EmailId', 'Email Id cannot be blank.');
    if (this.p.Contacts == 0) vra.add('Contacts', 'Contact No cannot be blank.');
    if (this.p.Name == '') vra.add('Name', 'ExternalUsers Name cannot be blank.');
    if (this.p.UserRoleRef == 0) vra.add('UserRoleRef', 'ExternalUsers Role cannot be blank.');
    if (this.p.DepartmentRef == 0) vra.add('DepartmentRef', 'Department be blank.');
    if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, ExternalUsers.Db_Table_Name, this.p);
  }

  private static m_currentInstance: ExternalUsers = ExternalUsers.CreateNewInstance();

  public static GetCurrentInstance() {
    return ExternalUsers.m_currentInstance;
  }

  public static SetCurrentInstance(value: ExternalUsers) {
    ExternalUsers.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): ExternalUsers {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, ExternalUsers.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, ExternalUsers.Db_Table_Name)!.Entries) {
        return ExternalUsers.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): ExternalUsers[] {
    let result: ExternalUsers[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, ExternalUsers.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, ExternalUsers.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(ExternalUsers.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): ExternalUsers[] {
    return ExternalUsers.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: ExternalUsersFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new ExternalUsersFetchRequest();
    req.UserRefs.push(ref);

    let tdResponse = await ExternalUsers.FetchTransportData(req, errorHandler) as TransportData;
    return ExternalUsers.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: ExternalUsersFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await ExternalUsers.FetchTransportData(req, errorHandler) as TransportData;
    return ExternalUsers.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new ExternalUsersFetchRequest();
    let tdResponse = await ExternalUsers.FetchTransportData(req, errorHandler) as TransportData;
    return ExternalUsers.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new ExternalUsersFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await ExternalUsers.FetchTransportData(req, errorHandler) as TransportData;
    return ExternalUsers.ListFromTransportData(tdResponse);
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
