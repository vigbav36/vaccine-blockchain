import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddVaccineService {
  private baseUrl = environment.serverUrl;
  // private baseUrl = 'http://localhost:3000';

  constructor(private http:HttpClient) { }

  addVaccine(payload: any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers.set('Origin', 'http://localhost:4201');

    const options = {headers, withCredentials: true};
    return  this.http.post(this.baseUrl + '/vaccine', payload, options);
  }
}
