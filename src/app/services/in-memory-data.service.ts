import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})

// API virtuelle mock 
// 'InMemory' cad donnees initialise avec chaque demarrage

//prerequis en terminal:
//npm i angular-in-memory-web-api@0.19.0
//ng g service in-memory-data
export class InMemoryDataService implements InMemoryDataService {

  constructor() { }

  createDb() {
    const todos : Todo[] = [
      //Urgent: priority = 1 Et due date = today
      {id:1, title:'Call Secu', completed: false, priority:'1', dueDate:new Date(2025,5,10).toISOString(), description:null},

      //To do today: due date = today
      {id:2, title:'Send email', completed: false, priority:null, dueDate:new Date(2025,5,10).toISOString(), description: null},

      //Overdue: due date < today
      {id:3, title:'Declaration impot', completed: false, priority:null, dueDate:new Date(2025,5,1).toISOString(), description:null},

      //Overdue: due date < today
      {id:4, title:'Send CV', completed: false, priority:null, dueDate:new Date(2025,5,2).toISOString(), description: null},
    ];

    const users : User[] = [
      {id:1, firstname:'Alice', lastname:'AAA', genre:'Woman'},
      {id:2, firstname:'Leo', lastname:'BBB', genre:'Man'}
    ];

    return { todos, users }; // un lien endpoint api/todos 
  }
}
