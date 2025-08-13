import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserProfile {
  username: string;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiURL = environment.apiUrl + '/api/profile';

  constructor(private http: HttpClient) { }

  getProfile(): Observable<UserProfile>{
    return this.http.get<UserProfile>(this.apiURL);
  }
}
