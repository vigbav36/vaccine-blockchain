import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../model/User.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.serverUrl;

  constructor(private http: HttpClient){}
  signup(user: any){
    return this.http.post(`${this.baseUrl}/signup`, user);
  }

  login(credentials: User): Observable<any>{
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers.set('Origin', 'http://localhost:4201');

    const options = {headers, withCredentials: true};
   let l =  this.http.post<any>(`${this.baseUrl}/login`, credentials, options);
    return l;

  }

}
