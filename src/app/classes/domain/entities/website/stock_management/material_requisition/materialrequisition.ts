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
import { MaterialRequisitionFetchRequest } from "./materialrequisitionfetchrequest";
import { CountryStateCityRefs, ValidationMessages, ValidationPatterns } from "src/app/classes/domain/constants";
import { MaterialDetailProps } from "./material/material";



export class MaterialRequisitionProps {
  public readonly Db_Table_Name = "MaterialRequisitionManagement";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public Name: string = '';
  public AddressLine1: string = '';
  public AddressLine2: string = '';
  public PinCode: string = '';
  public CountryRef: number = CountryStateCityRefs.IndiaRef;
  public readonly CountryName: string = '';
  public StateRef: number = CountryStateCityRefs.MaharashtraRef;
  public readonly StateName: string = '';
  public CityRef: number = CountryStateCityRefs.KolhapurRef;
  public readonly CityName: string = '';
  public MaterialRequisitionInchargeRef: number = 0;
  public MaterialRequisitionInchargeName: string = '';
  public EstimatedStartingDate: string = '';
  public EstimatedEndDate: string = '';
  public EstimatedCost: number = 0;
  public TotalLandAreaInSqm: number = 0;
  public TotalLandAreaInSqft: number = 0;
  public NumberOfPlots: number = 0;
  public CompanyRef: number = 0;
  public CompanyName: string = '';
  public LoginEmployeeRef: number = 26893;
  public MaterialRequisitionMaterialDetails: MaterialDetailProps[] = [];


  public readonly IsNewlyCreated: boolean = false;
  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new MaterialRequisitionProps(true);
  }
}

export class MaterialRequisition implements IPersistable<MaterialRequisition> {
  public static readonly Db_Table_Name: string = 'MaterialRequisitionManagement';

  public constructor(public readonly p: MaterialRequisitionProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): MaterialRequisition {
    let newState: MaterialRequisitionProps = Utils.GetInstance().DeepCopy(this.p);
    return MaterialRequisition.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new MaterialRequisition(MaterialRequisitionProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new MaterialRequisition(data as MaterialRequisitionProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.Name == '') vra.add('Name', 'MaterialRequisition Name cannot be blank.'); else if (!new RegExp(ValidationPatterns.NameWithoutNos).test(this.p.Name)) {
      vra.add('Name', ValidationMessages.NameWithoutNosMsg);
    }
    if (this.p.AddressLine1 == '') vra.add('AddressLine1', 'Address Line  cannot be blank.');
    if (this.p.AddressLine2 == '') vra.add('AddressLine2', 'MaterialRequisition Location cannot be blank.');
    // if (this.p.PinCode == '') vra.add('PinCode', 'PinCode cannot be blank.');else if (!new RegExp(ValidationPatterns.PinCode).test(this.p.Name)) {
    //   vra.add('Name', ValidationMessages.PinCodeMsg);
    // }
    if (this.p.CountryRef == 0) vra.add('CountryRef', 'Country cannot be blank.');
    if (this.p.StateRef == 0) vra.add('StateRef', 'State cannot be blank.');
    if (this.p.CityRef == 0) vra.add('CityRef', 'City cannot be blank.');
    if (this.p.MaterialRequisitionInchargeRef == 0) vra.add('MaterialRequisitionInchargeRef', 'MaterialRequisition Incharge cannot be blank.');
    if (this.p.EstimatedStartingDate == '') vra.add('EstimatedStartingDate', 'Estimated Starting Date cannot be blank.');
    if (this.p.EstimatedEndDate == '') vra.add('EstimatedEndDate', 'Estimated End Date cannot be blank.');
    if (this.p.TotalLandAreaInSqm == 0) vra.add('TotalLandAreaInSqm', 'Total Land Area In Sqm cannot be blank.');
    if (this.p.TotalLandAreaInSqft == 0) vra.add('TotalLandAreaInSqft', 'Total Land Area In Sqft cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, MaterialRequisition.Db_Table_Name, this.p);
  }

  private static m_currentInstance: MaterialRequisition = MaterialRequisition.CreateNewInstance();

  public static GetCurrentInstance() {
    return MaterialRequisition.m_currentInstance;
  }

  public static SetCurrentInstance(value: MaterialRequisition) {
    MaterialRequisition.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): MaterialRequisition {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, MaterialRequisition.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, MaterialRequisition.Db_Table_Name)!.Entries) {
        return MaterialRequisition.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
   sortPropertyName: string = ""): MaterialRequisition[] {
    let result: MaterialRequisition[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, MaterialRequisition.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, MaterialRequisition.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(MaterialRequisition.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): MaterialRequisition[] {
    return MaterialRequisition.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: MaterialRequisitionFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new MaterialRequisitionFetchRequest();
    req.MaterialRequisitionManagementRefs.push(ref);

    let tdResponse = await MaterialRequisition.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialRequisition.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: MaterialRequisitionFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await MaterialRequisition.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialRequisition.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new MaterialRequisitionFetchRequest();
    let tdResponse = await MaterialRequisition.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialRequisition.ListFromTransportData(tdResponse);
  }
  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new MaterialRequisitionFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await MaterialRequisition.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialRequisition.ListFromTransportData(tdResponse);
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
