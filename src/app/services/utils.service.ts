import { Injectable } from '@angular/core';
import { ServerCommunicatorService } from './server-communicator.service';
import { SessionValues } from './sessionvalues.service';
import { RefAllocator } from './refallocator.service';
import { RequestTypes } from '../classes/infrastructure/enums';
import { TransportData } from '../classes/infrastructure/transportdata';
import { ValidationResultEntryCollection } from '../classes/infrastructure/validationresultentrycollection';
import { ValidationResultAccumulator } from '../classes/infrastructure/validationresultaccumulator';
import { TransactionResult } from '../classes/infrastructure/transactionresult';
import { DataContainer } from '../classes/infrastructure/datacontainer';
import { UIUtils } from './uiutils.service';
import { ServiceInjector } from '../classes/infrastructure/injector';
import { PayloadPacketFacade } from '../classes/infrastructure/payloadpacket/payloadpacketfacade';
import { IPersistable } from '../classes/infrastructure/IPersistable';
import { FileTransferObject } from '../classes/infrastructure/filetransferobject';
import { isNullOrUndefined } from 'src/tools';
import { DataContainerService } from '../classes/infrastructure/datacontainer.service';
import { DecimalPacket } from '../classes/infrastructure/payloadpacket/decimalpacket';
import * as _ from 'lodash';


@Injectable({
  providedIn: "root",
})
export class Utils {
  public static OrderByPropertyName(values: any[], propertyName: any) {
    return values.sort((a, b) => {
      if (a[propertyName] < b[propertyName]) {
        return -1;
      }

      if (a[propertyName] > b[propertyName]) {
        return 1;
      }

      return 0
    });
  }

  public static OrderByValue(values: any[]) {
    return values.sort((a, b) => {
      if (a < b) {
        return -1;
      }

      if (a > b) {
        return 1;
      }

      return 0
    });
  }

  constructor(private payloadPacketFacade: PayloadPacketFacade,
    private serverCommunicator: ServerCommunicatorService,
    private sessionValues: SessionValues,
    private refAllocator: RefAllocator,
    private dataContainerService: DataContainerService) {
  }

  public static GetInstance(): Utils {
    return ServiceInjector.AppInjector.get(Utils)
  }

  public MergeObject<T>(objDestination: T, objSource: T) {
    objDestination = _.merge<T, T>(objDestination, objSource);
  }

  public DeepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj)) as T;
  }

  public TransferData(source: any, destination: any) {
    for (let paramName in source) {
      destination[paramName] = source[paramName];
    }
  }

  public Collate(obj1: any, obj2: any) {
    for (var p in obj2) {
      if (obj2[p].constructor == Object) {
        if (obj1[p]) {
          this.Collate(obj1[p], obj2[p]);
          continue;
        }
      }
      obj1[p] = obj2[p];
    }
  }

  public MergeTransformScalarArrays(destinationArray: any[], sourceArray: any[]) {
    this.Collate(destinationArray, sourceArray);
  }

  public MergeTransformObjectArrays(destinationArray: any[], sourceArray: any[]) {
    this.Collate(destinationArray, sourceArray);
  }

  public GenerateStateTransferObject(obj: any): any {
    let result = {} as any;

    for (let prop in obj) {
      result[prop] = obj[prop];
    }


    return result;
  }

  public PadZero(num: number, maxLength: number): string {
    let s = num.toString() + '';
    while (s.length < maxLength) s = '0' + s;
    return s;
  }

  public CombineListIntoSingleString(lst: string[], combinator: string): string {
    let result: string = '';

    for (let str of lst) {
      if (result.length > 0) result += combinator;
      result += str;
    }

    return result;
  }

  public CreateNewTransportData(requestType: string = RequestTypes.Save.toString()): TransportData {
    let result: TransportData = {
      RequestType: requestType,
      InMemoryDataRepositoryNamesToBeFetched: [],
      MainData: new DataContainer()
    };

    return result;
  }

  public async SavePersistableEntities(entities: IPersistable<any>[],
    files: FileTransferObject[] = [],): Promise<TransactionResult> {
    try {
      let td: TransportData = this.CreateNewTransportData();

      let vrec: ValidationResultEntryCollection = { Entries: [] };
      let vra = new ValidationResultAccumulator(vrec);

      entities.forEach((obj) => obj.CheckSaveValidity(td, vra));

      if (vrec.Entries.length > 0) {
        let tr: TransactionResult = {
          Successful: false,
          Message: ValidationResultEntryCollection.FormulateMessageFromList(vrec)
        };

        return tr;
      }

      for (let obj of entities) {
        await obj.EnsurePrimaryKeysWithValidValues();
        obj.MergeIntoTransportData(td);
      }

      let pkt = this.payloadPacketFacade.CreateNewPayloadPacket2(td, 'TransportData');

      let result = await this.serverCommunicator.sendHttpRequest(pkt, "acceptrequest", files);
      return result;
    } catch (error) {
      let trError = <TransactionResult>{
        Successful: false,
        Message: error
      };

      return trError;
    }
  }

  public GetDecimalValueFromTransportData(td: TransportData) {
    if (this.dataContainerService.CollectionExists(td.MainData, "DecimalValue")) {
      let coll = this.dataContainerService.GetCollection(td.MainData, "DecimalValue");
      for (let e of coll!.Entries) {
        let result = JSON.parse(JSON.stringify(e)) as DecimalPacket;
        return result.V;
      }
    }

    return 0;
  }

  public async GenerateAndFetchDocument(tdRequest: TransportData) {
    let pkt = PayloadPacketFacade.GetInstance().CreateNewPayloadPacket2(tdRequest);

    var tr = await ServerCommunicatorService.GetInstance().GetDocumentGenerationRequestCode(pkt);

    if (!tr.Successful) {
      await UIUtils.GetInstance().showErrorMessage("Error", tr.Message);
      return;
    }

    let code = tr.Tag as string;

    let sv = SessionValues.GetInstance();

    let url = `${sv.requestController}`
      + `/generatedocument`
      + `/${code}`;

    window.open(url, "_blank");
  }

  public Sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private GetValueInObject(obj: any, key: string): any | null {
    for (let k in obj) {
      if (k == key) return obj[k];
    }

    return null;
  }

  private IsObject(obj: any): boolean {
    if (typeof obj === "object" && obj !== null) return true;
    return obj.constructor === Object;
  }

  public AreEqual(p1: any, p2: any): boolean {
    if (isNullOrUndefined(p1) && !isNullOrUndefined(p2)) return false;
    if (!isNullOrUndefined(p1) && isNullOrUndefined(p2)) return false;
    let isP1Object = this.IsObject(p1);
    let isP2Object = this.IsObject(p2);

    if (isP1Object != isP2Object) return false;

    if (isP1Object) {
      for (let k in p1) {
        let valueInP1 = p1[k];
        let valueInP2 = this.GetValueInObject(p2, k);
        if (!this.AreEqual(valueInP1, valueInP2)) return false;
      }

      return true;
    }
    else {
      return p1 == p2;
    }
  }

  public GetString(value: any) {
    if (isNullOrUndefined(value)) return '';
    return String(value);
  }

 // for file uploading
public async handleImageSelection(
  event: any,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif']
): Promise<{
  file: File | null;
  imageUrl: string | null;
  selectedImage: string | null;
  error: string;
}> {
  return new Promise((resolve) => {
    const files: FileList = event.target.files;
    const file: File | null = files.item(0);

    if (!file) {
      resolve({
        file: null,
        imageUrl: null,
        selectedImage: null,
        error: 'No file selected',
      });
      return;
    }

    // Validate the file type (MIME type)
    if (!allowedTypes.includes(file.type)) {
      resolve({
        file: null,
        imageUrl: null,
        selectedImage: null,
        error: 'Only image files (JPG, PNG, GIF) are allowed',
      });
      return;
    }

    // Validate the file extension
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    const allowedExtensions = ['.jpeg', '.jpg', '.png', '.gif','pdf'];

    if (!allowedExtensions.includes(fileExtension)) {
      resolve({
        file: null,
        imageUrl: null,
        selectedImage: null,
        error: 'Invalid file extension. Only JPG, PNG, and GIF,pdf are allowed.',
      });
      return;
    }

    // Proceed with image preview if file is valid
    const reader = new FileReader();

    reader.onload = () => {
      const selectedImage = reader.result as string;
      const imageUrl = URL.createObjectURL(file);
      resolve({
        file,
        imageUrl,
        selectedImage,
        error: '', // No error
      });
    };

    reader.readAsDataURL(file);
  });
}

public getMimeTypeFromFileName = (mimeType: string): string => {

  const mimeToExtensionMap: { [key: string]: string[] } = {
    // Documents
    'application/pdf': ['.pdf'],
    'text/plain': ['.txt'],
    'text/markdown': ['.md'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/vnd.ms-powerpoint': ['.ppt'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    'application/epub+zip': ['.epub'],
    'application/x-mobipocket-ebook': ['.mobi'],
    'application/rtf': ['.rtf'],
    'application/vnd.oasis.opendocument.text': ['.odt'],
    'application/vnd.oasis.opendocument.spreadsheet': ['.ods'],
    'application/vnd.oasis.opendocument.presentation': ['.odp'],
    
    // Images
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'image/bmp': ['.bmp'],
    'image/tiff': ['.tiff'],
    'image/svg+xml': ['.svg'],
    'image/x-icon': ['.ico'],
    
    // Audio
    'audio/mpeg': ['.mp3'],
    'audio/wav': ['.wav'],
    'audio/ogg': ['.ogg'],
    'audio/flac': ['.flac'],
    'audio/aac': ['.aac'],
    'audio/midi': ['.midi', '.mid'],
    
    // Video
    'video/mp4': ['.mp4'],
    'video/x-msvideo': ['.avi'],
    'video/quicktime': ['.mov'],
    'video/x-ms-wmv': ['.wmv'],
    'video/webm': ['.webm'],
    'video/ogg': ['.ogv'],
    
    // Archives
    'application/zip': ['.zip'],
    'application/x-tar': ['.tar'],
    'application/gzip': ['.gz'],
    'application/x-bzip2': ['.bz2'],
    'application/x-7z-compressed': ['.7z'],
    'application/x-rar-compressed': ['.rar'],
    'application/x-iso9660-image': ['.iso'],
    'application/x-debian-package': ['.deb'],
    'application/x-rpm': ['.rpm'],
    
    // Web
    'text/html': ['.html', '.htm'],
    'text/css': ['.css'],
    'application/javascript': ['.js'],
    'application/json': ['.json'],
    'application/xml': ['.xml'],
    'text/csv': ['.csv'],
    'application/ld+json': ['.jsonld'],
    'application/xhtml+xml': ['.xhtml'],
    
    // Fonts
    'font/woff': ['.woff'],
    'font/woff2': ['.woff2'],
    'font/ttf': ['.ttf'],
    'font/otf': ['.otf'],
    
    // Miscellaneous
    'application/postscript': ['.ps'],
    'application/vnd.android.package-archive': ['.apk'],
    'application/vnd.apple.installer+xml': ['.ipa'],
    'application/x-xpinstall': ['.xpi'],
    'application/x-shockwave-flash': ['.swf'],
    'application/x-bittorrent': ['.torrent'],
    'application/x-apple-diskimage': ['.dmg'],
    'application/octet-stream': ['.bin'],
    'application/vnd.ms-fontobject': ['.eot'],
    
    // Other
    'text/yaml': ['.yaml', '.yml'],
    'text/calendar': ['.ics'],
    'text/vcard': ['.vcf'],
    'application/xml-dtd': ['.dtd'],
  };
  
  return mimeToExtensionMap[mimeType]?.[0] || '';
}



}
