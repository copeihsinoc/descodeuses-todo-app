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

  // 計算狀態，不改變 Todo 型別
  getStatus(todo: Todo): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(todo.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    if (Number(todo.priority) === 1 && dueDate.getTime() === today.getTime()) {
      return 'Urgent';
    } else if (dueDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (dueDate < today) {
      return 'Overdue';
    } else {
      return 'Normal';
    }
  }

  // Tailwind / 顏色對應
  getStatusColor(status: string): string {
    switch (status) {
      case 'Overdue': return '#f87171';  // bg-red-400
      case 'Urgent': return '#facc15';   // bg-yellow-500
      case 'Today': return '#3b82f6';    // bg-blue-500
      case 'Normal': return '#6b7280';   // bg-gray-500
      default: return '#ffffff';
    }
  }

  fetchTodo() {
    this.todoService.getTodos().subscribe((data) => {
      this.todos = data; // 直接存原始 Todo
    });
  }
}