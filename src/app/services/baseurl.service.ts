import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseUrlService {
  public get isConnectedLocally() {
    return location.origin.includes('localhost')
      || location.origin.includes('127.0.0.1');
  }

  public GenerateBaseUrl() {
    let baseURLstring = ``;

    if (window.location.hostname.includes('enscloud.in')) {
      baseURLstring = `https://enscloud.in/gladiancedev-gladiance-web-api`;
    } else if (window.location.hostname.includes('gladiance.one')) {
      if (window.location.toString().includes("://dev."))
      {
        baseURLstring = `https://dev.api.gladiance.one/gladiancecloud-web-api`;
      }
      else
      {
        baseURLstring = `https://api.gladiance.one/gladiancecloud-web-api`;
      }
    } else {
      // baseURLstring = `https://localhost:5001`;
      baseURLstring = `https://api.gladiance.one/gladiancecloud-web-api`;
    }

    return baseURLstring;
  }
}
