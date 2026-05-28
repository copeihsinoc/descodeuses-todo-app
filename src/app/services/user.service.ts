import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  //private apiURL = 'http://localhost:8080/api/user'

  private apiURL = environment.apiUrl + '/user';

  constructor(private http: HttpClient) { }

  // 🔧 加上 Authorization header（JWT token）
  /* addUser(user: User): Observable<any> {
     return this.http.post<User>('http://localhost:8080/auth/sign-up', user);
   }
 */
  addUser(user: User): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/sign-up`, user);
  }

  getUsers() {
    return this.http.get<User[]>(this.apiURL);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiURL}/current`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiURL}/${id}`);
  }

  updateUser(user: User) {
    return this.http.put<User>(this.apiURL + '/' + user.id, user);
  }
  /*
  updateUser(user: User) {
    const payload = { ...user, role: user.role}; // 確保有 role
    return this.http.put<User>(this.apiURL + '/' + user.id, payload);
  }
  */
  deleteUser(id: number) {
    return this.http.delete(`${this.apiURL}/${id}`);
  }

  deleteUsers(ids: number[]) {
    console.log("🔥 FRONTEND IDS =", ids);
    return this.http.post(`${this.apiURL}/delete-batch`, ids);
  }

  // 新增每日獎勵 API
  claimDailyReward(): Observable<User> {
    return this.http.post<User>(`${this.apiURL}/daily-reward`, {});
  }
}
