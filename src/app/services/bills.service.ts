import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillsService {
  constructor(public http: HttpClient) { }
  url: string = 'http://127.0.0.1:8000/api/';

  // bill Approval
  createApprovalBill(data: any): Observable<any> {
    return this.http.post(this.url + '', data);
  }
  updateApprovalBill(data: any): Observable<any> {
    return this.http.post(this.url + '' + data.id, data);
  }
  getApprovalBill(): Observable<any> {
    return this.http.get(this.url + '');
  }
  deleteApprovalBill(data: any): Observable<any> {
    return this.http.delete(this.url + '', data);
  }
}
