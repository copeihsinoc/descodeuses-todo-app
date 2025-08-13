import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact } from '../models/contact.model';
import { environment } from '../../environments/environment';




@Injectable({
  providedIn: 'root'
})
export class ContactService {
  
  /*contact link */
  //private apiURL = 'http://localhost:8080/api/contact';

  private apiURL = environment.apiUrl + '/api/contact';

  constructor(private http: HttpClient) { }

  addContact(item:Contact){
    return this.http.post<Contact>(this.apiURL, item);
  }

  getContacts() {
    return this.http.get<Contact[]>(this.apiURL); //first lien api3
  }

  getContact(id: number) {
    return this.http.get<Contact>(this.apiURL + '/' + id);
  }

  updateContact(item: Contact) {
    return this.http.put<Contact>(this.apiURL + '/'+item.id, item);
  }

  deleteContact(id: number) {
    return this.http.delete(this.apiURL + '/' + id);
  }
}