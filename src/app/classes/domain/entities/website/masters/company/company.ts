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
import { CompanyFetchRequest } from "./companyfetchrequest";
import { CountryStateCityRefs } from "src/app/classes/domain/constants";


export class CompanyProps {
  public readonly Db_Table_Name = "CompanyMaster";
  public Ref: number = 0;
  public Name: string = '';
  public OwnerName: string = '';
  public EmailId: string = '';
  public CompanyType: number = 0;
  public Contacts: string = '';
  public AddressLine1: string = '';
  public AddressLine2: string = '';
  public PinCode: string = '';
  public GSTIN:  string='';
  public Pan:  string='';
  public CINNO:  string='';
  public DateOfInCorporation:string = '';
  public LastDateOfFirstFinancialYear:  string='';
  public Notes:  string='';
  public CountryRef:  number = CountryStateCityRefs.IndiaRef; 
  public readonly CountryName: string='';
  public StateRef:  number = CountryStateCityRefs.MaharashtraRef;
  public readonly StateName: string='';
  public CityRef:  number = CountryStateCityRefs.KolhapurRef ;
  public readonly CityName: string='';


  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new CompanyProps(true);
  }
}

export class Company implements IPersistable<Company> {
  public static readonly Db_Table_Name: string = 'CompanyMaster';

  private constructor(public readonly p: CompanyProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
            const newRefs = await IdProvider.GetInstance().GetNextEntityId();
            // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): Company {
    let newState: CompanyProps = Utils.GetInstance().DeepCopy(this.p);
    return Company.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new Company(CompanyProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new Company(data as CompanyProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.Name == '') vra.add('Name', 'Name cannot be blank.');
    if (this.p.OwnerName == '') vra.add('OwnerName', 'Owner Name cannot be blank.');
    if (this.p.EmailId == '') vra.add('EmailId', 'Email Id cannot be blank.');
    if (this.p.CompanyType == 0) vra.add('CompanyType', 'Company Type cannot be blank.');
    if (this.p.PinCode == '') vra.add('PinCode', 'Pin code cannot be blank.');
    if (this.p.AddressLine1 == '') vra.add('AddressLine1', 'AddressLine1 cannot be blank.');
    if (this.p.AddressLine2 == '') vra.add('AddressLine2', 'AddressLine2 cannot be blank.');
    if (this.p.CountryRef == 0) vra.add('CountryRef', 'Country Name cannot be blank.');
    if (this.p.StateRef == 0) vra.add('StateRef', 'State Name cannot be blank.');
    if (this.p.CityRef == 0) vra.add('CityRef', 'City Name cannot be blank.');
    if (this.p.GSTIN == '') vra.add('GSTIn', 'GST In cannot be blank.');
    if (this.p.Pan == '') vra.add('Pan', 'Pan cannot be blank.');
    if (this.p.CINNO == '') vra.add('CINNo', 'CIN No cannot be blank.');
    if (this.p.Notes == '') vra.add('Notes', 'Notes cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, Company.Db_Table_Name, this.p);
  }

  private static m_currentInstance: Company = Company.CreateNewInstance();

  public static GetCurrentInstance() {
    return Company.m_currentInstance;
  }

  public static SetCurrentInstance(value: Company) {
    Company.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): Company {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, Company.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, Company.Db_Table_Name)!.Entries) {
        return Company.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): Company[] {
    let result: Company[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, Company.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, Company.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(Company.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): Company[] {
    return Company.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: CompanyFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new CompanyFetchRequest();
    req.CompanyRefs.push(ref);

    let tdResponse = await Company.FetchTransportData(req, errorHandler) as TransportData;
    return Company.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: CompanyFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await Company.FetchTransportData(req, errorHandler) as TransportData;
    return Company.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new CompanyFetchRequest();
    let tdResponse = await Company.FetchTransportData(req, errorHandler) as TransportData;
    return Company.ListFromTransportData(tdResponse);
  }
  public static async FetchEntireListByCompanyRef(CompanyRef:number,errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new CompanyFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await Company.FetchTransportData(req, errorHandler) as TransportData;
    return Company.ListFromTransportData(tdResponse);
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
