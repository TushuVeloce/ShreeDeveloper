import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SessionValues } from './sessionvalues.service';
import { TransactionResult } from '../classes/infrastructure/transactionresult';
import { TransportData } from '../classes/infrastructure/transportdata';
import { DataContainerService } from '../classes/infrastructure/datacontainer.service';
import { ServiceInjector } from '../classes/infrastructure/injector';
import { PayloadPacket } from '../classes/infrastructure/payloadpacket/payloadpacket';
import { FileTransferObject } from '../classes/infrastructure/filetransferobject';
import { isNullOrUndefined } from 'src/tools';
import { UserLogoutRequest } from '../classes/infrastructure/request_response/userlogoutrequest';
import { UserLoginResponse } from '../classes/infrastructure/request_response/userloginresponse';
import { UserLoginRequest } from '../classes/infrastructure/request_response/userloginrequest';
import { AppStateManageService } from './app-state-manage.service';
import { RequestTypes } from '../classes/infrastructure/enums';
import { CompanyStateManagement } from './companystatemanagement';

@Injectable({
  providedIn: 'root'
})
export class ServerCommunicatorService {
  public static GetInstance(): ServerCommunicatorService {
    return ServiceInjector.AppInjector.get(ServerCommunicatorService)
  }

  constructor(private http: HttpClient,
    private sessionValues: SessionValues,
    private appStateManagement: AppStateManageService,
    private companystatemanagement: CompanyStateManagement,) {

  }


  public async FetchResult(apiRoot: string, method: string): Promise<TransactionResult> {
    try {
      let url = `${apiRoot}/${method}`;
      let request = this.http.get(url);

      let pktResult = await (request.toPromise()
        .then(resp => resp as PayloadPacket)
        .catch(err => {
          let tr: TransactionResult =
          {
            Successful: false,
            Message: err.statusText
          };

          return {
            Ref: 1,
            PartNo: 1,
            TotalPartCount: 1,
            Sender: this.sessionValues.CurrentLoginToken,
            Topic: 'ServerToClientResponse',
            PayloadDescriptor: "TransactionResult",
            Payload: JSON.stringify(tr),
            TargetMethod: '',
            CoordinationId: 0
          };
        }));

      if (pktResult.PayloadDescriptor === "TransactionResult") {
        let result = (JSON.parse(pktResult.Payload) as TransactionResult);
        return result;
      }

      return null as any;
    }
    catch (error) {
      let result: TransactionResult =
      {
        Successful: false,
        Message: error as any
      }

      return result;
    }
  }

  private static readonly DocumentGenerationCodeCollectionName = "DocumentGenerationRequestCode";

  public async GetDocumentGenerationRequestCode(req: PayloadPacket): Promise<TransactionResult> {
    let tr = await this.sendHttpRequest(req);
    if (!tr.Successful) return tr;

    let code = '';

    let td = JSON.parse(tr.Tag) as TransportData;
    let coll = DataContainerService.GetInstance().GetOrCreateCollection(td.MainData, ServerCommunicatorService.DocumentGenerationCodeCollectionName)!;
    for (let obj of coll.Entries) {
      code = (obj as any)["Code"] as string;
    }

    tr.Tag = code;

    return tr;
  }

  public async sendHttpRequest(pkt: PayloadPacket, method: string = 'acceptrequest',
    files: FileTransferObject[] = []): Promise<TransactionResult> {
    try {

      let pktResult: PayloadPacket = null as any;
      // console.log(pkt);
      if (pkt.Payload.RequestType === RequestTypes.Fetch) method = 'FetchAcceptRequest';
      else if (pkt.Payload.RequestType === RequestTypes.CustomProcess) method = 'CustomAcceptRequest';
      else if (pkt.Payload.RequestType === RequestTypes.Deletion) method = 'DeleteAcceptRequest';
      else if (pkt.Payload.RequestType === RequestTypes.Save) method = 'SaveAcceptRequest';


      let url = `${this.sessionValues.requestController}/${method}`;
      let strPkt = JSON.stringify(pkt);

      const formData = new FormData();

      let fileIndex = 0;

      for (let file of files) {
        if (!isNullOrUndefined(file)) {
          if (file.id.length === 0) {
            fileIndex++;
            formData.append(`file_${fileIndex}`, file.rawFile as Blob, file.name);
          }
          else {
            formData.append(file.id, file.rawFile as Blob, file.name);
          }
        }
      }

      formData.append('info', strPkt);

      let request = this.http.post(url, formData);

      pktResult = await (request.toPromise()
        .then(resp => resp as PayloadPacket)
        .catch(err => {
          let tr: TransactionResult =
          {
            Successful: false,
            Message: err.statusText
          };

          return {
            Ref: 1,
            PartNo: 1,
            TotalPartCount: 1,
            // Sender: this.sessionValues.CurrentLoginToken,
            Sender: 1001,
            Topic: 'ServerToClientResponse',
            PayloadDescriptor: "TransactionResult",
            Payload: JSON.stringify(tr),
            TargetMethod: ''
          };
        }));

      if (pktResult.PayloadDescriptor === "TransactionResult") {
        let result = (JSON.parse(pktResult.Payload) as TransactionResult);
        return result;
      }
    }
    catch (error) {
      let result: TransactionResult =
      {
        Successful: false,
        Message: error as any
      }

      return result;
    }

    return null as any;
  }

  public async GetRefs(apiRoot: string, req: PayloadPacket): Promise<TransactionResult> {
    try {
      let url = `${apiRoot}/allocaterefs`;
      let body = JSON.stringify(req);

      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      let request = this.http.post(url, body, { headers: headers });

      let pktResult = await (request.toPromise()
        .then(resp => resp as PayloadPacket)
        .catch(err => {
          let tr: TransactionResult =
          {
            Successful: false,
            Message: err.statusText
          };

          return {
            Ref: 1,
            PartNo: 1,
            TotalPartCount: 1,
            Sender: this.sessionValues.CurrentLoginToken,
            Topic: 'ServerToClientResponse',
            PayloadDescriptor: "TransactionResult",
            Payload: JSON.stringify(tr),
            TargetMethod: '',
            CoordinationId: 0
          };
        }));

      if (pktResult.PayloadDescriptor === "TransactionResult") {
        let result = (JSON.parse(pktResult.Payload) as TransactionResult);
        return result;
      }

      return null as any;
    }
    catch (error) {
      let result: TransactionResult =
      {
        Successful: false,
        Message: error as any,
        Tag: null,
        TagType: ''
      }

      return result;
    }
  }

  public async AllocateSingleIds(apiRoot: string): Promise<TransactionResult> {
    try {
      // let loginToken = window.location.hostname.includes('gladiance.one')
      //                   || window.location.hostname.includes('localhost') ? 50000102 : 50000002

      let loginToken = this.sessionValues.CurrentLoginToken;
      let url = `${apiRoot}/allocatesingleid/${loginToken}`;
      let body = {}

      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      let request = this.http.post(url, body);

      let pktResult = await (request.toPromise()
        .then(resp => resp as any)
        .catch(err => {
          let tr: TransactionResult =
          {
            Successful: false,
            Message: err.statusText
          };

          return
          tr
        }));

      if (!pktResult.Successful) {
        let result = pktResult as TransactionResult;
        return result;
      }
      if (pktResult.Successful) {
        let result = pktResult as TransactionResult;
        return result;
      }

      return null as any;
    }
    catch (error) {
      let result: TransactionResult =
      {
        Successful: false,
        Message: error as any,
        Tag: null,
        TagType: ''
      }

      return result;
    }
  }

  public async GetProcessTokens(apiRoot: string, req: PayloadPacket): Promise<TransactionResult> {
    try {
      let url = `${apiRoot}/allocateprocesstokens`;
      let body = JSON.stringify(req);

      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      let request = this.http.post(url, body, { headers: headers });

      let pktResult = await (request.toPromise()
        .then(resp => resp as PayloadPacket)
        .catch(err => {
          let tr: TransactionResult =
          {
            Successful: false,
            Message: err.statusText
          };

          return {
            Ref: 1,
            PartNo: 1,
            TotalPartCount: 1,
            Sender: this.sessionValues.CurrentLoginToken,
            Topic: 'ServerToClientResponse',
            PayloadDescriptor: "TransactionResult",
            Payload: JSON.stringify(tr),
            TargetMethod: ''
          };
        }));

      if (pktResult.PayloadDescriptor === "TransactionResult") {
        let result = (JSON.parse(pktResult.Payload) as TransactionResult);
        return result;
      }

      return null as any;
    }
    catch (error) {
      let result: TransactionResult =
      {
        Successful: false,
        Message: error as any,
        Tag: null,
        TagType: ''
      }

      return result;
    }
  }

  public async GetCurrentDateTime(apiRoot: string, req: PayloadPacket): Promise<TransactionResult> {
    try {
      let url = `${apiRoot}/getcurrentdatetime`;
      let body = JSON.stringify(req);

      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      let request = this.http.post(url, body, { headers: headers });

      let pktResult = await (request.toPromise()
        .then(resp => resp as PayloadPacket)
        .catch(err => {
          let tr: TransactionResult =
          {
            Successful: false,
            Message: err.statusText
          };

          return {
            Ref: 1,
            PartNo: 1,
            TotalPartCount: 1,
            Sender: this.sessionValues.CurrentLoginToken,
            Topic: 'ServerToClientResponse',
            PayloadDescriptor: "TransactionResult",
            Payload: JSON.stringify(tr),
            TargetMethod: ''
          };
        }));

      if (pktResult.PayloadDescriptor === "TransactionResult") {
        let result = (JSON.parse(pktResult.Payload) as TransactionResult);
        return result;
      }

      return null as any;
    }
    catch (error) {
      let result: TransactionResult =
      {
        Successful: false,
        Message: error as any,
        Tag: null,
        TagType: ''
      }

      return result;
    }
  }

  public async LoginUser(req: UserLoginRequest) {
    let apiRoot = this.sessionValues.requestController;
    let url = `${apiRoot}/loginsystemuser`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let request = this.http.post(url, req, { headers: headers });
    let resp = await (request.toPromise()
      .then(resp => resp as any)
      .catch(err => {
        let tr = new UserLoginResponse();
        tr.Successful = false;
        tr.Message = err.statusText;
        return tr
      }));

    let result = Object.assign(new UserLoginResponse(), resp) as UserLoginResponse;
    this.sessionValues.CurrentLoginToken = result.LoginToken;
    this.sessionValues.UserDisplayName = result.UserDisplayName;
    this.appStateManagement.setValidMenuItemIds(result.ValidMenuItemIds);
   this.appStateManagement.StorageKey.setItem('SelectedCompanyRef', result.LastSelectedCompanyRef.toString());
   this.appStateManagement.StorageKey.setItem('companyName', result.LastSelectedCompanyName);
   this.appStateManagement.StorageKey.setItem('LoginEmployeeRef', result.LoginEmployeeRef.toString());
   this.companystatemanagement.setCompanyRef(result.LastSelectedCompanyRef,result.LastSelectedCompanyName)
    return result;
  }

  public async LogoutUser(req: UserLogoutRequest) {
    let apiRoot = this.sessionValues.requestController;
    let url = `${apiRoot}/logoutsystemuser`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let request = this.http.post(url, req, { headers: headers });

    let resp = await (request.toPromise()
      .then(resp => resp as any)
      .catch(err => {
        let tr: TransactionResult =
        {
          Successful: false,
          Message: err.statusText
        };
        return tr
      }));

    let result: TransactionResult =
    {
      Successful: true, Message: ''
    };

    this.sessionValues.ClearAllStateValues();
    this.appStateManagement.clearValidMenuItemIds();

    return result;
  }

  public async ChangeLoggedInUserPassword(req: UserLogoutRequest) {
    let apiRoot = this.sessionValues.cloudUIController;
    let url = `${apiRoot}/changeloggedinuserpassword`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let request = this.http.post(url, req, { headers: headers });

    let resp = await (request.toPromise()
      .then(resp => resp as any)
      .catch(err => {
        let tr: TransactionResult =
        {
          Successful: false,
          Message: err.statusText
        };
        return tr
      }));

    let result: TransactionResult =
    {
      Successful: true, Message: ''
    };

    // this.sessionValues.ClearAllStateValues();
    this.appStateManagement.clearValidMenuItemIds();

    return resp;
  }

  public async FetchRequestForMobileApp(endPoint: string, body: any) {
    let apiRoot = this.sessionValues.mobileApp;
    let url = `${apiRoot}/${endPoint}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let request = this.http.post(url, body, { headers: headers });

    let resp = await (request.toPromise()
      .then(resp => resp as any)
      .catch(err => {
        let tr = new UserLoginResponse();
        tr.Successful = false;
        tr.Message = err.statusText;
        return tr
      }));

    let result = Object.assign(new UserLoginResponse(), resp) as UserLoginResponse;
    return result;
  }
  public async SaveSuperUser(body: any) {
    let apiRoot = this.sessionValues.userManagement;
    let url = `${apiRoot}/savecustomeruser/${this.sessionValues.CurrentLoginToken}/${this.sessionValues.LoginDeviceId}`;
    // let body = {}

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let request = this.http.post(url, body);

    let pktResult = await (request.toPromise()
      .then(resp => resp as any)
      .catch(err => {
        let tr: TransactionResult =
        {
          Successful: false,
          Message: err.statusText
        };

        return
        tr
      }));

    if (!pktResult.Successful) {
      let result = pktResult as TransactionResult;
      return result;
    }
    if (pktResult.Successful) {
      let result = pktResult as TransactionResult;
      return result;
    }

    return null as any;
  }

  public async GetSuperUser(projectRef: number) {
    let apiRoot = this.sessionValues.userManagement;
    let url = `${apiRoot}/customeruserlist/${projectRef}/${this.sessionValues.CurrentLoginToken}/${this.sessionValues.LoginDeviceId}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let request = this.http.get(url);

    let pktResult = await (request.toPromise()
      .then(resp => resp as any)
      .catch(err => {
        let tr: TransactionResult =
        {
          Successful: false,
          Message: err.statusText
        };

        return
        tr
      }));

    if (!pktResult.Successful) {
      let result = pktResult as TransactionResult;
      return result;
    }
    if (pktResult.Successful) {
      let result = pktResult as TransactionResult;
      return result;
    }

    return null as any;
  }

  public async GetDateTimeIntegerValue(apiRoot: string, dateString: string): Promise<number> {
    try {
      let parts = dateString.split("/");
      let year = +parts[0];
      let month = +parts[1];
      let day = +parts[2];

      let url = `${apiRoot}/datetimeintegervalue/${year}/${month}/${day}`;

      let request = this.http.get(url);

      let result = await (request.toPromise()
        .then(resp => resp as number)
        .catch(_err => 0));

      return result;
    }
    catch (error) {
      return -1;
    }
  }

  public async GetDateTimeStringValue(apiRoot: string, dateValue: number): Promise<string> {
    try {
      let url = `${apiRoot}/datetimestringvalue/${dateValue}`;

      let request = this.http.get(url);

      let result = await (request.toPromise()
        .then(resp => resp as string)
        .catch(err => err));

      return result;
    }
    catch (error) {
      return '';
    }
  }

  public async GetISOFormatDateTimeStringValue(apiRoot: string, dateValue: number): Promise<string> {
    try {
      let url = `${apiRoot}/isoformatdatetimestringvalue/${dateValue}`;

      let request = this.http.get(url);

      let result = await (request.toPromise()
        .then(resp => resp as string)
        .catch(err => err));

      return result;
    }
    catch (error) {
      return '';
    }
  }

  public async GetNodeConfig(GAAProjectSpaceTypePlannedDeviceConnectionRef: number): Promise<any> {
    try {
      let apiRoot = this.sessionValues.mqttController;
      let url = `${apiRoot}/nodecontrollableparameters/${GAAProjectSpaceTypePlannedDeviceConnectionRef}`;
      let body = {}

      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      let request = this.http.get(url);

      let result = await (request.toPromise()
        .then(resp => resp as string)
        .catch(err => err));

      return result;
    }
    catch (error) {
      return '';
    }
  }

  public async GetCheckListBySpaceGroup(projectRef: number, spacegroupRef: number): Promise<any> {
    try {
      let apiRoot = this.sessionValues.guestOperations;
      let url = `${apiRoot}/currentcheckinlistbyspacegroup/${projectRef}/${spacegroupRef}/${this.sessionValues.CurrentLoginToken}/${this.sessionValues.LoginDeviceId}`;
      let body = {}


      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      let request = this.http.get(url);

      let result = await (request.toPromise()
        .then(resp => resp as string)
        .catch(err => err));

      return result;
    }
    catch (error) {
      return '';
    }
  }

  public async GetCurrentTime(): Promise<any> {
    try {
      let apiRoot = this.sessionValues.requestController;
      let url = `${apiRoot}/currentdatetime`;
      let body = {}


      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      let request = this.http.get(url);

      let result = await (request.toPromise()
        .then(resp => resp as string)
        .catch(err => err));

      return result;
    }
    catch (error) {
      return '';
    }
  }

  public async FetchStringResult(url: string): Promise<string> {
    try {
      let request = this.http.get(url);

      let result = await (request.toPromise()
        .then(resp => resp as string)
        .catch(err => err.error.text));
      return result;
    }
    catch (error) {
      return error as string;
    }
  }
}
