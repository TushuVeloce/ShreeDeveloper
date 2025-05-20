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
import { office_duty_timeFetchRequest } from "./office_duty_time_fetchrequest";


export class office_duty_timeProps {
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public Name: string = '';
  public OfficeName: string = '';
  public CompanyRef: number = 0;
  public CompanyName: string = '';

  public IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new office_duty_timeProps(true);
  }
}

export class office_duty_time implements IPersistable<office_duty_time> {
  public static readonly Db_Table_Name: string = 'office_duty_time';

  private constructor(public readonly p: office_duty_timeProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): office_duty_time {
    let newState: office_duty_timeProps = Utils.GetInstance().DeepCopy(this.p);
    return office_duty_time.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new office_duty_time(office_duty_timeProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new office_duty_time(data as office_duty_timeProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    // if (this.p.Name == '') vra.add('Name', 'Name cannot be blank.');
    // if (this.p.Date == '') vra.add('Date', 'Date cannot be blank.');
    // if (this.p.ContactNos == '') vra.add('OwnerName', 'Owner Name cannot be blank.');
    // if (this.p.EmailId == '') vra.add('EmailId', 'Email Id cannot be blank.');
    // if (this.p.PinCode == '') vra.add('PinCode', 'Pin code cannot be blank.');
    // if (this.p.Address == '') vra.add('AddressLine1', 'AddressLine1 cannot be blank.');
    // if (this.p.CountryRef == 0) vra.add('CountryRef', 'Country Name cannot be blank.');
    // if (this.p.StateRef == 0) vra.add('StateRef', 'State Name cannot be blank.');
    // if (this.p.CityRef == 0) vra.add('CityRef', 'City Name cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, office_duty_time.Db_Table_Name, this.p);
  }

  private static m_currentInstance: office_duty_time = office_duty_time.CreateNewInstance();

  public static GetCurrentInstance() {
    return office_duty_time.m_currentInstance;
  }

  public static SetCurrentInstance(value: office_duty_time) {
    office_duty_time.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): office_duty_time {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, office_duty_time.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, office_duty_time.Db_Table_Name)!.Entries) {
        return office_duty_time.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
   sortPropertyName: string = ""): office_duty_time[] {
    let result: office_duty_time[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, office_duty_time.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, office_duty_time.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(office_duty_time.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): office_duty_time[] {
    return office_duty_time.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: office_duty_timeFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new office_duty_timeFetchRequest();
    req.office_duty_timeRefs.push(ref);

    let tdResponse = await office_duty_time.FetchTransportData(req, errorHandler) as TransportData;
    return office_duty_time.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: office_duty_timeFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await office_duty_time.FetchTransportData(req, errorHandler) as TransportData;
    return office_duty_time.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new office_duty_timeFetchRequest();
    let tdResponse = await office_duty_time.FetchTransportData(req, errorHandler) as TransportData;
    return office_duty_time.ListFromTransportData(tdResponse);
  }
  public static async FetchEntireListByoffice_duty_timeRef(office_duty_timeRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new office_duty_timeFetchRequest();
    req.office_duty_timeRefs.push(office_duty_timeRef)
    let tdResponse = await office_duty_time.FetchTransportData(req, errorHandler) as TransportData;
    return office_duty_time.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new office_duty_timeFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await office_duty_time.FetchTransportData(req, errorHandler) as TransportData;
    return office_duty_time.ListFromTransportData(tdResponse);
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
