import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { promise } from 'protractor';


@Injectable({
  providedIn: 'root'
})
export class ConnectService {
  baseUrl = "http://qa.webit-track.com/DanieleePrizeWS/Service.svc/";

  constructor(private http:HttpClient) {
    this.http=http;
   }

  post(functionName : string, data) : Promise<any> {
    console.log (functionName);
    return this.http.post(`${this.baseUrl}${functionName}`, data).toPromise();
  }

  get(url: string): Promise<any>{
    console.log(url);
    return this.http.get(`${this.baseUrl}${url}`).toPromise();

  }

  getFileFolderUrl(){
    return this.baseUrl+'Files/';
  }
}
