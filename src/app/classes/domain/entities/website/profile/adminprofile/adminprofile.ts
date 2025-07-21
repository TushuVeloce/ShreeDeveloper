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
import { AdminProfileFetchRequest } from "./adminprofilefetchrequest";
import { ValidationMessages, ValidationPatterns } from "src/app/classes/domain/constants";

export class AdminProfileProps {
  public Ref: number = 0;
  public Name: string = '';
  public DOB: string = '';
  public Gender: number = 0;
  public EmailId: string = '';
  public CountryCode: Number = 1;
  public Contacts: string = '';
  public Address: string = '';
  public ProfilePicFile: File = null as any
  public ProfilePicPath: string = "";

  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new AdminProfileProps(true);
  }
}

export class AdminProfile implements IPersistable<AdminProfile> {
  public static readonly MasterTableName: string = 'SystemUserMaster';

  private constructor(public readonly p: AdminProfileProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): AdminProfile {
    let newState: AdminProfileProps = Utils.GetInstance().DeepCopy(this.p);
    return AdminProfile.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new AdminProfile(AdminProfileProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new AdminProfile(data as AdminProfileProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.Name == '') vra.add('Name', 'Name cannot be blank.');
    if (this.p.Address == '') vra.add('Address', 'Address cannot be blank.');
    if (this.p.EmailId == '') vra.add('EmailId', 'EmailId cannot be blank.');
    if (!new RegExp(ValidationPatterns.Email).test(this.p.EmailId) && this.p.EmailId) {
      vra.add('EmailId', ValidationMessages.EmailMsg);
    }
    if (this.p.Contacts == '') vra.add('MobileNo', 'MobileNo cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, AdminProfile.MasterTableName, this.p);
  }

  private static m_currentInstance: AdminProfile = AdminProfile.CreateNewInstance();

  public static GetCurrentInstance() {
    return AdminProfile.m_currentInstance;
  }

  public static SetCurrentInstance(value: AdminProfile) {
    AdminProfile.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): AdminProfile {
    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(td.MainData, AdminProfile.MasterTableName)) {
      for (let data of dcs.GetCollection(td.MainData, AdminProfile.MasterTableName)!.Entries) {
        return AdminProfile.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): AdminProfile[] {
    let result: AdminProfile[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, AdminProfile.MasterTableName)) {
      let coll = dcs.GetCollection(cont, AdminProfile.MasterTableName)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(AdminProfile.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): AdminProfile[] {
    return AdminProfile.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: AdminProfileFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new AdminProfileFetchRequest();
    req.AdminProfileRefs.push(ref);

    let tdResponse = await AdminProfile.FetchTransportData(req, errorHandler) as TransportData;
    return AdminProfile.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: AdminProfileFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await AdminProfile.FetchTransportData(req, errorHandler) as TransportData;
    return AdminProfile.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new AdminProfileFetchRequest();
    let tdResponse = await AdminProfile.FetchTransportData(req, errorHandler) as TransportData;
    return AdminProfile.ListFromTransportData(tdResponse);
  }

  public static async FetchAdminData(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new AdminProfileFetchRequest();
    let tdResponse = await AdminProfile.FetchTransportData(req, errorHandler) as TransportData;
    return AdminProfile.ListFromTransportData(tdResponse);
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
