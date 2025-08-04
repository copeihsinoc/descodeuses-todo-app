import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //private apiUrl = 'http://localhost:8080/auth/login'

  private apiURL = enviroment.apiUrl + '/auth/login'; //'api/todos'

  constructor(private http: HttpClient) { }

  //payload: email/password
  login(payload : any): Observable<any> {
    return this.http.post(`${this.apiURL}`, payload);
  }
}
