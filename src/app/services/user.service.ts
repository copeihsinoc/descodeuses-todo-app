import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiURL = 'api/users';

  constructor(private http: HttpClient) { }


  getUsers() {
    return this.http.get<User[]>(this.apiURL); //first lien api3
  }

  getUser(id: number) {
    return this.http.get<User>(this.apiURL + '/' + id);
  }

  updateUser(item: User) {
    return this.http.put<User>(this.apiURL + '/'+item.id, item);
  }

  deleteUser(id: string) {
    return this.http.delete(this.apiURL + '/' + id);
  }
}