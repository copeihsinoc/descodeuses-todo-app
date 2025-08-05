import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { enviroment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  //private apiURL = 'http://localhost:8080/api/user'

  private apiURL = enviroment.apiUrl + '/api/user';

  constructor(private http: HttpClient) { }

  // 🔧 加上 Authorization header（JWT token）
 /* addUser(user: User): Observable<any> {
    return this.http.post<User>('http://localhost:8080/auth/sign-up', user);
  }
*/
  addUser(user: User): Observable<any> {
    return this.http.post(`${enviroment.apiUrl}/auth/sign-up`, user);
  }

  getUsers() {
    return this.http.get<User[]>(this.apiURL);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.apiURL + '/current');
  }

  updateUser(user: User) {
    return this.http.put<User>(this.apiURL + '/' + user.id, user);
  }

  deleteUser(id: number) {
    return this.http.delete(this.apiURL + '/' + id);
  }
}
