import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';
import { Contact } from '../models/contact.model';



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
      {id:1, title:'Call Secu', completed: false, priority:'1', dueDate:new Date(2025,9,26).toISOString(), description:null, memberIds: [], projectId: null },

      //To do today: due date = today
      {id:2, title:'Send email', completed: false, priority:null, dueDate:new Date(2025,9,26).toISOString(), description: null, memberIds: [], projectId: null },

      //Overdue: due date < today
      {id:3, title:'Declaration impot', completed: false, priority:null, dueDate:new Date(2025,9,1).toISOString(), description:null, memberIds: [], projectId: null },

      //Overdue: due date < today
      {id:4, title:'Send CV', completed: false, priority:null, dueDate:new Date(2025,9,2).toISOString(), description: null, memberIds: [], projectId: null },
    ];

    const contacts : Contact[] = [
      {id:1, firstName:'Alice', lastName:'AAA', genre:'Woman'},
      {id:2, firstName:'Leo', lastName:'BBB', genre:'Man'}   
    ];

    return { todos, contacts }; // un lien endpoint api/todos 
  }
}
