import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';
import { enviroment } from '../../environments/environment.prod';

//commande pour creer le fichier:
//ng g service todo

//Le service fait le lien entre le front et le back

//Il fait les operations CRUD: Create, Read, Update, Delete
@Injectable({            //create une service
  providedIn: 'root'
})
export class TodoService {

  //private apiURL = 'http://localhost:8080/api/action'; //'api/todos'

  private apiURL = enviroment.apiUrl + '/api/action'; //'api/todos'

  //HttpClient pour communiquer avec le API/Backend
  constructor(private http: HttpClient) { } 

  //C R U D 

  //C : Create
  addTodo(item : Todo) {
    //<Todo> : type de retour de l'appel HTTP
    return this.http.post<Todo>(this.apiURL, item); //envoyer un object
  }

  //R : Read
  //Fetch all (toute lia liste)
  getTodos() {
    //HTTP GET sans 2eme parametre parce que il y a pas de body
    return this.http.get<Todo[]>(this.apiURL); //(this.apiURL)ou on va envoyer
  }

  //R : Read
  //Fetch one item de todo par son Id
  getTodo(id : number) {
    return this.http.get<Todo>(this.apiURL +'/'+ id); //(this.apiURL +'/'+ id)(ou on va envoyer, sth )
  }

  //U : Update
  updateTodo(item : Todo) {
    return this.http.put<Todo>(this.apiURL +'/'+ item.id, item);
  }

  //D : Delete
  deleteTodo(id : number) {
    return this.http.delete(this.apiURL +'/'+ id);
  }

}
