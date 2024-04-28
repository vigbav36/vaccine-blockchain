import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private baseUrl = environment.serverUrl;

  constructor(private http: HttpClient){}

  requestTransfer(vaccineId:string){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers.set('Origin', 'http://localhost:4201');

    const options = {headers, withCredentials: true};
    return this.http.post(this.baseUrl + "/vaccine/request", JSON.stringify({vaccine_id: vaccineId}), options);
  }

  getIncomingRequests(){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers.set('Origin', 'http://localhost:4201');
    const options = {headers, withCredentials: true};

    return this.http.get(this.baseUrl + "/vaccine/request/all", options);
  }

  acceptRequest(vaccineId: string){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers.set('Origin', 'http://localhost:4201');

    const options = {headers, withCredentials: true};
    return this.http.post(this.baseUrl + "/vaccine/transfer", JSON.stringify({'vaccine_id': vaccineId}), options);
  }
}
