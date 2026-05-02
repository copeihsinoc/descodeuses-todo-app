import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //private apiUrl = 'http://localhost:8080/auth/login'

  private authUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  //payload infos: email/password to send to back

  login(payload: any): Observable<any> {
    // 最終路徑：.../api/auth/login
    return this.http.post(`${this.authUrl}/login`, payload).pipe(
      tap((response: any) => {
        if (response.token) sessionStorage.setItem('authToken', response.token);
        if (response.role) sessionStorage.setItem('authRole', response.role);
      })
    );
  }

  /* 新增：註冊方法 */
  signUp(payload: any): Observable<any> {
    // 最終路徑：.../api/auth/sign-up
    return this.http.post(`${this.authUrl}/sign-up`, payload);
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

  //check user = admin
  get isAdmin(): boolean {
    return sessionStorage.getItem('authRole') === 'ROLE_ADMIN';
  }


  // <!>方便 Guard 或 Sidebar 判斷使用者是否登入
  get isLoggedIn(): boolean {
    return !!this.getToken();
  }

}