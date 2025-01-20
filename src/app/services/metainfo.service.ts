import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ServiceInjector } from "../classes/infrastructure/injector";
import { BaseUrlService } from "./baseurl.service";

@Injectable({
  providedIn: "root",
})
export class MetaInfo {
  public static GetInstance(): MetaInfo {
    return ServiceInjector.AppInjector.get(MetaInfo)
  }

  public OrganizationName: string = 'VJ Client';

  public FetchAndSetOrganizationName: () => Promise<string> = async () =>
  {
    if (this.OrganizationName.trim().length === 0)
    {
      try
      {
        let metaInfoUrl = `${this.metaInfoRoot}/customername`;
        let request = this.http.get(metaInfoUrl, {responseType: 'text'});

        let result = await (request.toPromise()
            .then(resp =>
              {
                return resp as string;
              })
            .catch(err => {
              return `ERROR : ${err.message}`;
            }));

        if (result.startsWith("ERROR :")) result = '';

        this.OrganizationName = result;

        return this.OrganizationName;
      }
      catch (error)
      {
        return ''; // `ERROR : ${error as string}`;
      }
    }
    else
    {
      return this.OrganizationName;
    }
  }

  private getCustomerIdentifier()
  {
    let urlString = location.origin;

    if (urlString.includes('localhost'))
    {
      return '';
    }

    urlString = urlString.substring(8);

    let urlParts = urlString.split('.');

    if (urlParts.length > 0)
    {
      let result = urlParts[0];

      if (result.endsWith("-vspot"))
      {
          result = result.substring(0, result.length - "-vspot".length);
      }

      return result;
    }
    else
    {
      return '';
    }
  }

  private formulateMetaInfoUrlString()
  {
    return `${this.baseUrlService.GenerateBaseUrl()}/metainfo`;
  }

  private m_metaInfoRoot: string = '';

  private get metaInfoRoot(): string
  {
    if (this.m_metaInfoRoot.trim().length == 0)
    {
      this.m_metaInfoRoot = this.formulateMetaInfoUrlString();
    }

    return this.m_metaInfoRoot;
  }

  constructor(private http: HttpClient,
    private baseUrlService: BaseUrlService) {}
}
