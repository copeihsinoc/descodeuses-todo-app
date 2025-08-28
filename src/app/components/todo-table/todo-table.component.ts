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

  constructor(private todoService: TodoService) {

  }

  ngOnInit(): void {
    this.fetchTodo();
  }

  fetchTodo() {
    this.todoService.getTodos().subscribe((data) => {
      const today = new Date();

      this.todos = data.map(todo => {
        const dueDate = new Date(todo.dueDate);
        
        let status = '';

        if (todo.priority == '1' && dueDate.toDateString() == today.toDateString()) {
          status = 'Urgent';
        } else if (dueDate.toDateString() == today.toDateString()) {
          status = 'Today';
        } else if (dueDate < today) {
          status = 'Overdue';
        } else {
          status = 'Normal';
        }

        return { ...todo, status }; // 新增 status 欄位
      });
    });
  }

}
