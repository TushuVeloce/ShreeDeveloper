import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PostRedirectService {
    constructor() { }
    
    post(postActionURL: string) 
    {
      let mapForm = document.createElement("form");
      mapForm.target = "_blank";
      mapForm.method = "POST";
      mapForm.action = postActionURL;
      
      document.body.appendChild(mapForm);
      mapForm.submit();

      return mapForm.parentNode;
    }

    postWithParams(postActionURL: string, params: any) 
    {
      let mapForm = document.createElement("form");
      mapForm.target = "_blank";
      mapForm.method = "POST";
      mapForm.action = postActionURL;

      Object.keys(params).forEach(function(param){
        var mapInput = document.createElement("input");
        mapInput.type = "hidden";
        mapInput.name = param;
        mapInput.setAttribute("value", params[param]);
        mapForm.appendChild(mapInput);
      });
      
      document.body.appendChild(mapForm);
      mapForm.submit();

      return mapForm.parentNode;
    }
}
