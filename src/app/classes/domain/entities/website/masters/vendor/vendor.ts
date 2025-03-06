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
import { VendorFetchRequest } from "./vendorfetchrequest";

export class MaterialListSuppliedByVendorProps {
  public MaterialRef: number = 0;
  public MaterialName: string = '';
}

export class ServiceSuppliedByVendorProps {
  public MaterialRef: number = 0;
  public MaterialName: string = '';
}


export class VendorProps {
  public readonly Db_Table_Name = "VendorMaster";
  public Ref: number = 0;
  public Name: string = '';
  public Code: string = '';
  public AddressLine1: string = '';
  public AddressLine2: string = '';
  public MobileNo: string = '';
  public CompanyType: string = '';

  public BankName: string = '';
  public BranchName: string = '';
  public AccountNumber: string = '';
  public IFSC: string = '';

  public PinCode: string = '';
  public GSTIN:  string='';
  public Pan:  string='';
  public CINNO:  string='';

  public CountryRef:  number = 9163;
  public readonly CountryName: string='';
  public StateRef:  number = 10263;
  public readonly StateName: string='';
  public CityRef:  number = 10374;
  public readonly CityName: string='';

  public MaterialListSuppliedByVendor : MaterialListSuppliedByVendorProps [] = [];
  public ServiceListSuppliedByVendor : ServiceSuppliedByVendorProps [] = [];

  public CompanyRef: number = 0;
  public CompanyName: string = '';

  // public readonly CompanyName: string = '';
  
  public readonly IsNewlyCreated: boolean = false;

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new VendorProps(true);
  }
}

export class Vendor implements IPersistable<Vendor> {
  public static readonly Db_Table_Name: string = 'VendorMaster';

  private constructor(public readonly p: VendorProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
            const newRefs = await IdProvider.GetInstance().GetNextEntityId();
            // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): Vendor {
    let newState: VendorProps = Utils.GetInstance().DeepCopy(this.p);
    return Vendor.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new Vendor(VendorProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new Vendor(data as VendorProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.Name == '') vra.add('Name', 'Name cannot be blank.');
    if (this.p.AddressLine1 == '') vra.add('Address', 'Address cannot be blank.');
    if (this.p.MobileNo == '') vra.add('MobileNo', 'Mobile No cannot be blank.');
    if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company Name cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, Vendor.Db_Table_Name, this.p);
  }

  private static m_currentInstance: Vendor = Vendor.CreateNewInstance();

  public static GetCurrentInstance() {
    return Vendor.m_currentInstance;
  }

  public static SetCurrentInstance(value: Vendor) {
    Vendor.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): Vendor {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, Vendor.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, Vendor.Db_Table_Name)!.Entries) {
        return Vendor.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): Vendor[] {
    let result: Vendor[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, Vendor.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, Vendor.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(Vendor.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): Vendor[] {
    return Vendor.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: VendorFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new VendorFetchRequest();
    req.VendorRefs.push(ref);

    let tdResponse = await Vendor.FetchTransportData(req, errorHandler) as TransportData;
    return Vendor.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: VendorFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await Vendor.FetchTransportData(req, errorHandler) as TransportData;
    return Vendor.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new VendorFetchRequest();
    let tdResponse = await Vendor.FetchTransportData(req, errorHandler) as TransportData;
    return Vendor.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef:number,errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new VendorFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await Vendor.FetchTransportData(req, errorHandler) as TransportData;
    return Vendor.ListFromTransportData(tdResponse);
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
