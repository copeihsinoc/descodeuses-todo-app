import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //private apiUrl = 'http://localhost:8080/auth/login'

  private apiURL = environment.apiUrl + '/auth/login'; //'api/todos'

  constructor(private http: HttpClient) { }

  //payload infos: email/password to send to back
  login(payload: any): Observable<any> {

    //http post login
    //Send the request → data flows through a pipeline 
    // → do a side task (store token/role) → original data keeps flowing.
    return this.http.post(`${this.apiURL}`, payload).pipe(
      tap((response: any) => {

        // if back send... { token: '...', role: '...' }
        //save token
        if (response.token) {
          sessionStorage.setItem('authToken', response.token);
        }
        //save role
        if (response.role) {
          sessionStorage.setItem('authRole', response.role);
        }
      })
    );
  }

  // logout
  logout(): void {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('authRole');
  }

  // receive token
  getToken(): string | null {
    return sessionStorage.getItem('authToken');
  }

  // get role
  getRole(): string | null {
    return sessionStorage.getItem('authRole');
  }

  isAdmin = false;
}