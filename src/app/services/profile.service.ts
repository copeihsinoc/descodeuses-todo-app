import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface UserProfile {
  username: string;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {


  constructor(private http: HttpClient) { }

  getProfile(): Observable<UserProfile>{
    return this.http.get<UserProfile>('http://localhost:8080/api/profile');
  }
}
