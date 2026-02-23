import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-to-do-list',
  standalone: false,
  templateUrl: './to-do-list.component.html',
  styleUrl: './to-do-list.component.css'
})
export class ToDoListComponent implements OnInit {

  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  searchTask: string = '';

  selectedTodoId: number | null = null;

  // ✅ 新增：multi delete 用（不影響你原本邏輯）
  selectedForDelete: number[] = [];

  constructor(
    private todoService: TodoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchTodos();
  }

  fetchTodos() {
    this.todoService.getTodos().subscribe((data) => {
      this.todos = data;
      this.filteredTodos = data;
      this.selectedForDelete = [];
    });
  }

  onSearch() {
    const query = this.searchTask.toLowerCase();
    this.filteredTodos = this.todos.filter(t =>
      t.title.toLowerCase().includes(query)
    );
  }

  addTodo() {
    this.selectedTodoId = 0;
  }

  onCloseDetail() {
    this.selectedTodoId = null;
    this.fetchTodos();
  }

  openTodoDetail(id: number) {
    this.selectedTodoId = id;
  }

  // ✅ 原本的：刪單筆（完全不動）
  onDeleteTodo(id: number | null) {
    if (id === null || id === 0) return;

    this.todoService.deleteTodo(id).subscribe(() => {
      this.fetchTodos();
      this.snackBar.open('Deleted !', '', { duration: 1000 });
    });
  }

  // ✅ 原本的：completed（完全不動）
  onCheckChange(event: MatCheckboxChange, todo: Todo) {
    todo.completed = event.checked;

    this.todoService.updateTodo(todo).subscribe(() => {
      this.snackBar.open(
        todo.completed ? 'checked !' : 'unchecked !',
        '',
        { duration: 1000 }
      );
    });
  }

  // =========================
  // ✅ 新增：multi delete 專用
  // =========================

  toggleDelete(todo: Todo) {
    const index = this.selectedForDelete.indexOf(todo.id);
    if (index > -1) {
      this.selectedForDelete.splice(index, 1);
    } else {
      this.selectedForDelete.push(todo.id);
    }
  }

  isSelectedForDelete(todo: Todo): boolean {
    return this.selectedForDelete.includes(todo.id);
  }

  deleteSelectedTodos() {
    if (this.selectedForDelete.length === 0) return;

    this.selectedForDelete.forEach(id => {
      this.todoService.deleteTodo(id).subscribe();
    });

    this.snackBar.open(
      `Deleted ${this.selectedForDelete.length} tasks`,
      '',
      { duration: 1200 }
    );

    this.fetchTodos();
  }
}