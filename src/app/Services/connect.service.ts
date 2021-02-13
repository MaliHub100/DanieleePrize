import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { promise } from 'protractor';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class ConnectService {
  //baseUrl = "http://localhost:51087/Service1.svc/";
  baseUrl = "http://qa.webit-track.com/AppTest/Service1.svc/";

  constructor(private http:HttpClient) {
    this.http=http;
   }

  post(functionName : string, data:any) : Promise<any> {
    console.log (functionName);
    console.log (data);
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
