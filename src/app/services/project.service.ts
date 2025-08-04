import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';
import { enviroment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  //private apiURL = 'http://localhost:8080/api/project';

  private apiURL = enviroment.apiUrl + '/api/project';

  constructor(private http: HttpClient) { }

  //C R U D 

  //C : Create
  addProject(item: Project) {
    //<Todo> : type de retour de l'appel HTTP
    return this.http.post<Project>(this.apiURL, item); //envoyer un object
  }

  //R : Read
  //Fetch all (toute lia liste)
  getProjects() {
    //HTTP GET sans 2eme parametre parce que il y a pas de body
    return this.http.get<Project[]>(this.apiURL); //(this.apiURL)ou on va envoyer
  }

  //R : Read
  //Fetch one item de todo par son Id
  getProject(id: number) {
    return this.http.get<Project>(this.apiURL + '/' + id); //(this.apiURL +'/'+ id)(ou on va envoyer, sth )
  }

  //U : Update
  updateProject(item: Project) {
    return this.http.put<Project>(this.apiURL + '/' + item.id, item);
  }

  //D : Delete
  deleteProject(id: number) {
    return this.http.delete(this.apiURL + '/' + id);
  }
}
