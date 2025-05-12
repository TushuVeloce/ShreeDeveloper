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
import { CountryStateCityRefs, ValidationMessages, ValidationPatterns } from "src/app/classes/domain/constants";

export class MaterialListSuppliedByVendorProps {
  public MaterialRef: number = 0;
  public MaterialName: string = '';
}

export class ServiceSuppliedByVendorProps {
  public Ref: number = 0;
  public Name: string = '';
}


export class VendorProps {
  public readonly Db_Table_Name = "VendorMaster";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public Code: string = '';
  public CompanyType: number = 0;
  public Name: string = '';
  public TradeName: string = '';
  public MobileNo: string = '';
  public AddressLine1: string = '';
  public AddressLine2: string = '';

  public CountryRef: number = CountryStateCityRefs.IndiaRef;
  public readonly CountryName: string = '';
  public StateRef: number = CountryStateCityRefs.MaharashtraRef;
  public readonly StateName: string = '';
  public CityRef: number = CountryStateCityRefs.KolhapurRef;

  public PinCode: string = '';
  public BankName: string = '';
  public BranchName: string = '';
  public AccountNumber: string = '';
  public IFSC: string = '';
  public GSTIN: string = '';
  public Pan: string = '';
  public CINNO: string = '';

  public MaterialListSuppliedByVendor: MaterialListSuppliedByVendorProps[] = [];
  public ServiceListSuppliedByVendor: ServiceSuppliedByVendorProps[] = [];

  public CompanyRef: number = 0;
  public CompanyName: string = '';

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
    if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company Name cannot be blank.');
    if (this.p.Code == '') vra.add('Code', 'Vendor Code cannot be blank.');
    if (this.p.CompanyType == 0) vra.add('CompanyType', 'Company Type cannot be blank.');
    if (this.p.Name == '') {
      vra.add('Name', 'Name cannot be blank.');
    } else if (!new RegExp(ValidationPatterns.NameWithNosAndSpace).test(this.p.Name)) {
      vra.add('Name', ValidationMessages.NameWithNosAndSpaceMsg + ' for Name');
    }
    if (this.p.TradeName == '') vra.add('TradeName', 'Trade Name cannot be blank.');
    if (this.p.MobileNo == '') vra.add('MobileNo', 'Mobile No cannot be blank.');
    if (this.p.AddressLine1 == '') vra.add('AddressLine1', 'AddressLine1 cannot be blank.');
    if (this.p.CountryRef == 0) vra.add('CountryRef', 'Country cannot be blank.');
    if (this.p.StateRef == 0) vra.add('StateRef', 'State cannot be blank.');
    if (this.p.CityRef == 0) vra.add('CityRef', 'City cannot be blank.');
    if (this.p.PinCode == '') {
      vra.add('PinCode', 'Pin cannot be blank.');
    } else if (!new RegExp(ValidationPatterns.PinCode).test(this.p.PinCode)) {
      vra.add('PinCode', ValidationMessages.PinCodeMsg);
    }
    if (this.p.BankName == '') vra.add('BankName', 'Bank cannot be blank.');
    if (this.p.BranchName == '') vra.add('BranchName', 'Branch cannot be blank.');
    if (this.p.AccountNumber == '') vra.add('AccountNumber', 'Account Number cannot be blank.');
    if (this.p.AccountNumber.length > 15) vra.add('AccountNumber', 'Account Number Should be less then 15.');
    if (this.p.IFSC == '') {
      vra.add('IFSC', 'IFSC cannot be blank.');
    } else if (!new RegExp(ValidationPatterns.IFSC).test(this.p.IFSC)) {
      vra.add('IFSC', ValidationMessages.IFSCMsg);
    }
    if (this.p.GSTIN == '') {
      vra.add('GSTIN', 'GST IN cannot be blank.');
    } else if (!new RegExp(ValidationPatterns.GSTIN).test(this.p.GSTIN)) {
      vra.add('GSTIN', ValidationMessages.GSTINMsg);
    }
    if (this.p.Pan == '') {
      vra.add('Pan', 'Pan cannot be blank.');
    } else if (!new RegExp(ValidationPatterns.PAN).test(this.p.Pan)) {
      vra.add('Pan', ValidationMessages.PANMsg);
    }
    if (this.p.CINNO == '') vra.add('CINNO', 'CIN cannot be blank.');
    if (this.p.MaterialListSuppliedByVendor.length < 0) vra.add('MaterialListSuppliedByVendor', ' Vendor Material Supply list cannot be blank.');
    if (this.p.ServiceListSuppliedByVendor.length < 0) vra.add('ServiceListSuppliedByVendor', 'Vendor Service Supply list cannot be blank.');
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

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
