import { Component, OnInit } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-table',
  standalone: false,
  templateUrl: './todo-table.component.html',
  styleUrl: './todo-table.component.css'
})
export class TodoTableComponent implements OnInit {
  todos: Todo[] = [];
  //displayColums: string[] = ['id', 'titre', 'priority', 'date', 'description', 'completed'];

  constructor(private todoService: TodoService){

  }
  
  ngOnInit(): void {
    this.fetchTodo();
  }

  fetchTodo(){
    this.todoService.getTodos().subscribe((data) =>{
      this.todos = data;
    })
  }

}
