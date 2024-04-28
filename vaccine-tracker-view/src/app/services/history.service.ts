import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private baseUrl = environment.serverUrl;

  constructor(private http: HttpClient) { }

  getHistory(vaccineId: string){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {headers, withCredentials: true};
    return this.http.get<any>(this.baseUrl + '/vaccine/history/' + vaccineId, options );

  }
}
