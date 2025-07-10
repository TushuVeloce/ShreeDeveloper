import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BaseUrlService {
  public get isConnectedLocally() {
    return (
      location.origin.includes('localhost') ||
      location.origin.includes('127.0.0.1')
    );
  }

  public GenerateBaseUrl() {
    // let baseURLstring = `http://localhost:5111/api/RequestController2`;
    // let baseURLstring = `http://localhost:5111/api`;   //For Backend Developers
    // let baseURLstring = `http://192.168.29.68:5100/api`;  //For Frontend Developers pc
    let baseURLstring = `http://192.168.29.83:5100/api`; //For Frontend Developers laptop 1
    // let baseURLstring = `http://192.168.29.245:5100/api`;  //For Frontend Developers laptop 2
    // let baseURLstring = `https://psapi.velocetech.space/api`;

    //let baseURLstring = ``;

    // if (window.location.hostname.includes('enscloud.in')) {
    //   baseURLstring = `https://enscloud.in/gladiancedev-gladiance-web-api`;
    // } else if (window.location.hostname.includes('gladiance.one')) {
    //   if (window.location.toString().includes("://dev."))
    //   {
    //     baseURLstring = `https://dev.api.gladiance.one/gladiancecloud-web-api`;
    //   }
    //   else
    //   {
    //     baseURLstring = `https://api.gladiance.one/gladiancecloud-web-api`;
    //   }
    // } else {
    //   // baseURLstring = `https://localhost:5001`;
    //   baseURLstring = `https://api.gladiance.one/gladiancecloud-web-api`;
    // }

    return baseURLstring;
  }

  public GenerateImageBaseUrl() {
    // let ImageBaseUrl: string = "http://192.168.29.68:5100/api/Request/uploadeddocumentpath/";  //For Frontend Developers Pc
    let ImageBaseUrl: string ='http://192.168.29.83:5100/api/Request/uploadeddocumentpath/'; //For Frontend Developers 1 Laptop 1
    // let ImageBaseUrl: string = "http://192.168.29.245:5100/api/Request/uploadeddocumentpath/";  //For Frontend Developers 2 Laptop 2
    // let ImageBaseUrl: string = "http://localhost:5111/api/Request/uploadeddocumentpath/";  //For Backend Developers
    // let ImageBaseUrl: string = "https://psapi.velocetech.space/api/Request/uploadeddocumentpath/";

    //let baseURLstring = ``;

    // if (window.location.hostname.includes('enscloud.in')) {
    //   baseURLstring = `https://enscloud.in/gladiancedev-gladiance-web-api`;
    // } else if (window.location.hostname.includes('gladiance.one')) {
    //   if (window.location.toString().includes("://dev."))
    //   {
    //     baseURLstring = `https://dev.api.gladiance.one/gladiancecloud-web-api`;
    //   }
    //   else
    //   {
    //     baseURLstring = `https://api.gladiance.one/gladiancecloud-web-api`;
    //   }
    // } else {
    //   // baseURLstring = `https://localhost:5001`;
    //   baseURLstring = `https://api.gladiance.one/gladiancecloud-web-api`;
    // }

    return ImageBaseUrl;
  }
}
