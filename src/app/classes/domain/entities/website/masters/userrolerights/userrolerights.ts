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
import { UserRoleRightFetchRequest } from "./userrolerightfetchrequest";

export class FeatureProps {

  FeatureRef: number = 0;
  FeatureName: string = "";
  FeatureGroupRef: number = 0;
  CanAdd: boolean = false;
  CanEdit: boolean = false;
  CanDelete: boolean = false;
  CanView: boolean = false;
  CanPrint: boolean = false;
  CanExport: boolean = false;

}



export class UserRoleRightProps {
  // public Ref: number = 0;
  // public Name: string = '';
  public DepartmentRef: number = 0;
  public CompanyRef: number = 0;
  // public FeatureGroupRef: number = 0;
  public DesignationRef: number = 0;
  public Feature: FeatureProps[] = [];

  public readonly ModuleTypeName: string = '';
  public readonly UserRoleName: string = '';
  public readonly CompanyName: string = '';

  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new UserRoleRightProps(true);
  }
}

export class UserRoleRight implements IPersistable<UserRoleRight> {
  public static readonly MasterTableName: string = 'UserRoleRight';

  private constructor(public readonly p: UserRoleRightProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    // if (this.p.Ref === undefined || this.p.Ref === 0) {
    //   const newRefs = await IdProvider.GetInstance().GetNextEntityId();
    //   // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
    //   this.p.Ref = newRefs[0];
    //   if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    // }
  }

  public GetEditableVersion(): UserRoleRight {
    let newUserRoleRight: UserRoleRightProps = Utils.GetInstance().DeepCopy(this.p);
    return UserRoleRight.CreateInstance(newUserRoleRight, true);
  }

  public static CreateNewInstance() {
    return new UserRoleRight(UserRoleRightProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new UserRoleRight(data as UserRoleRightProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    // if (this.p.Name == '') vra.add('Name', 'Name cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, UserRoleRight.MasterTableName, this.p);
  }

  private static m_currentInstance: UserRoleRight = UserRoleRight.CreateNewInstance();

  public static GetCurrentInstance() {
    return UserRoleRight.m_currentInstance;
  }

  public static SetCurrentInstance(value: UserRoleRight) {
    UserRoleRight.m_currentInstance = value;
  }

  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): UserRoleRight {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, UserRoleRight.MasterTableName)) {
      for (let data of dcs.GetCollection(td.MainData, UserRoleRight.MasterTableName)!.Entries) {
        return UserRoleRight.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
   sortPropertyName: string = ""): UserRoleRight[] {
    let result: UserRoleRight[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, UserRoleRight.MasterTableName)) {
      let coll = dcs.GetCollection(cont, UserRoleRight.MasterTableName)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(UserRoleRight.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): UserRoleRight[] {
    return UserRoleRight.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: UserRoleRightFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new UserRoleRightFetchRequest();
    req.CompanyRefs.push(ref);
    let tdResponse = await UserRoleRight.FetchTransportData(req, errorHandler) as TransportData;
    return UserRoleRight.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: UserRoleRightFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await UserRoleRight.FetchTransportData(req, errorHandler) as TransportData;
    return UserRoleRight.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new UserRoleRightFetchRequest();
    let tdResponse = await UserRoleRight.FetchTransportData(req, errorHandler) as TransportData;
    return UserRoleRight.ListFromTransportData(tdResponse);
  }

  // public static async FetchEntireListByCountryRef(CountryRef :number,errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
  //   let req = new UserRoleRightFetchRequest();
  //   req.CompanyRefs.push(CountryRef)
  //   let tdResponse = await UserRoleRight.FetchTransportData(req, errorHandler) as TransportData;
  //   return UserRoleRight.ListFromTransportData(tdResponse);
  // }
  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new UserRoleRightFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await UserRoleRight.FetchTransportData(req, errorHandler) as TransportData;
    return UserRoleRight.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListBydepartmentRef(departmentref: number,designationref: number, Companyref: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new UserRoleRightFetchRequest();
    req.DepartmentRefs.push(departmentref)
    req.DesignationRefs.push(designationref)
    req.CompanyRefs.push(Companyref)
    let tdResponse = await UserRoleRight.FetchTransportData(req, errorHandler) as TransportData;
    return UserRoleRight.ListFromTransportData(tdResponse);
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
